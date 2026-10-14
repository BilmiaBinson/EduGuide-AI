import os
import sys

# Prevent transformers from probing incompatible legacy tensorflow protobufs
os.environ["USE_TF"] = "0"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import logging
from pathlib import Path
from typing import List, Tuple, Dict, Any, Optional

# On Windows/Python 3.9, ChromaDB requires sqlite3 >= 3.35.0.
# Use pysqlite3 as replacement if available.
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from groq import Groq

from seed_data import get_seed_documents

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EduGuideRAGService")

# Load environment variables
load_dotenv()

# Configuration
CHROMA_PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chroma_db")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "w3schools_python")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


class EduGuideRAG:
    _instance: Optional["EduGuideRAG"] = None

    def __init__(self):
        self.persist_dir = Path(CHROMA_PERSIST_DIRECTORY).resolve()
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        self.collection_name = CHROMA_COLLECTION_NAME
        self.embedding_model_name = EMBEDDING_MODEL_NAME
        self.groq_model = GROQ_MODEL

        logger.info(f"Initializing EduGuideRAG with model '{self.embedding_model_name}' and collection '{self.collection_name}'")

        # Initialize Embedding Model
        self.embedding_model = SentenceTransformer(self.embedding_model_name)

        # Initialize ChromaDB Client
        self.chroma_client = chromadb.PersistentClient(
            path=str(self.persist_dir),
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "W3Schools Scraped Educational Tutorial Chunks"}
        )

        # Auto-seed if collection is empty
        self._ensure_grounding_data()

    def _ensure_grounding_data(self):
        count = self.collection.count()
        logger.info(f"Current ChromaDB collection '{self.collection_name}' has {count} document(s).")
        if count == 0:
            logger.info("ChromaDB is empty. Auto-seeding with authentic W3Schools Python tutorial chunks...")
            seed_docs = get_seed_documents()
            ids = [doc["id"] for doc in seed_docs]
            documents = [doc["content"] for doc in seed_docs]
            metadatas = [{"url": doc["url"], "title": doc["title"], "source": doc["url"]} for doc in seed_docs]
            embeddings = self.embedding_model.encode(documents, show_progress_bar=False).tolist()

            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )
            logger.info(f"Auto-seeded {len(seed_docs)} W3Schools tutorial chunks successfully.")

    def retrieve(self, question: str, top_k: int = 4) -> Tuple[str, List[str]]:
        """
        Embeds the question and retrieves top matching chunks from ChromaDB.
        Returns combined context and deduplicated source URLs.
        """
        query_embedding = self.embedding_model.encode(question).tolist()

        count = self.collection.count()
        if count == 0:
            return "", []

        n_results = min(top_k, count)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        context_blocks = []
        sources: List[str] = []
        seen_urls = set()

        for doc, meta in zip(documents, metadatas):
            context_blocks.append(doc)
            url = meta.get("url") or meta.get("source") if meta else None
            if url and url not in seen_urls:
                seen_urls.add(url)
                sources.append(url)

        context_str = "\n\n---\n\n".join(context_blocks)
        return context_str, sources

    def generate_answer(self, question: str, context: str) -> str:
        """
        Generates an educational, code-rich answer using Groq with the openai/gpt-oss-20b model.
        """
        groq_api_key = os.getenv("GROQ_API_KEY", "").strip()

        if not groq_api_key or groq_api_key == "your_groq_api_key_here":
            raise ValueError(
                "GROQ_API_KEY is not configured in backend/.env. "
                "Please open backend/.env and paste your Groq API key (starts with 'gsk_')."
            )

        client = Groq(api_key=groq_api_key)

        system_prompt = (
            "You are EduGuide AI, a patient, encouraging educational AI tutor grounded in W3Schools tutorial content.\n"
            "Your goal is to help students learn programming clearly, step-by-step.\n\n"
            "Guidelines:\n"
            "1. Ground your answer in the provided W3Schools context whenever possible.\n"
            "2. Provide clear, concise explanations with practical, clean Python code examples.\n"
            "3. Format code inside markdown ```python ... ``` blocks.\n"
            "4. If relevant, explain common pitfalls (like Python indentation errors or syntax quirks).\n"
            "5. Maintain a supportive, approachable educational tone.\n\n"
            "Retrieved W3Schools Tutorial Context:\n"
            f"{context if context else 'No specific W3Schools chunks retrieved.'}"
        )

        completion = client.chat.completions.create(
            model=self.groq_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.2,
            max_tokens=1024,
        )

        answer = completion.choices[0].message.content or ""
        return answer.strip()

    def answer_question(self, question: str) -> Dict[str, Any]:
        """
        End-to-end RAG pipeline:
        Retrieve W3Schools context -> Generate response via Groq -> Return answer & sources.
        """
        context, sources = self.retrieve(question)
        answer = self.generate_answer(question, context)
        return {
            "answer": answer,
            "sources": sources
        }


# Global singleton helper
_rag_instance: Optional[EduGuideRAG] = None

def get_rag_service() -> EduGuideRAG:
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = EduGuideRAG()
    return _rag_instance
