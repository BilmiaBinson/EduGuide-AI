import os
import sys

# Prevent transformers from probing incompatible legacy tensorflow protobufs
os.environ["USE_TF"] = "0"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

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

from seed_data import get_seed_documents

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EduGuideChunkLoader")

load_dotenv()

PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chroma_db")
COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "w3schools_python")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")


def get_embedding_model(model_name: str = EMBEDDING_MODEL_NAME) -> SentenceTransformer:
    logger.info(f"Loading sentence-transformers model: {model_name}...")
    return SentenceTransformer(model_name)


def get_chroma_collection(
    persist_dir: str = PERSIST_DIR,
    collection_name: str = COLLECTION_NAME
) -> chromadb.Collection:
    abs_dir = Path(persist_dir).resolve()
    abs_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Connecting to ChromaDB client at: {abs_dir}")

    client = chromadb.PersistentClient(
        path=str(abs_dir),
        settings=Settings(anonymized_telemetry=False)
    )
    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={"description": "W3Schools Scraped Educational Tutorial Chunks"}
    )
    return collection


def import_chunks_to_chroma(
    chunks: List[Dict[str, Any]],
    collection: Optional[chromadb.Collection] = None,
    model: Optional[SentenceTransformer] = None,
    batch_size: int = 64
) -> int:
    """
    Takes a list of chunk dictionaries and adds them to ChromaDB.
    Supports flexible schemas:
      - text/content/document
      - url/source
      - title/header
      - id
    """
    if collection is None:
        collection = get_chroma_collection()
    if model is None:
        model = get_embedding_model()

    if not chunks:
        logger.warning("No chunks provided to import.")
        return 0

    ids: List[str] = []
    documents: List[str] = []
    metadatas: List[Dict[str, Any]] = []

    for idx, item in enumerate(chunks):
        chunk_id = str(item.get("id") or item.get("chunk_id") or f"chunk_{idx}")
        doc_text = item.get("content") or item.get("text") or item.get("document") or ""

        if not doc_text.strip():
            continue

        raw_meta = item.get("metadata", {})
        if not isinstance(raw_meta, dict):
            raw_meta = {}

        # Preserve URL and title from item or nested metadata
        source_url = (
            item.get("url")
            or item.get("source")
            or raw_meta.get("url")
            or raw_meta.get("source")
            or "https://www.w3schools.com/python/"
        )
        title = (
            item.get("title")
            or raw_meta.get("title")
            or "W3Schools Python Tutorial"
        )

        metadata = {
            "url": str(source_url),
            "title": str(title),
            "source": str(source_url),
        }

        # Include any additional metadata fields
        for k, v in raw_meta.items():
            if k not in metadata and isinstance(v, (str, int, float, bool)):
                metadata[k] = v

        ids.append(chunk_id)
        documents.append(doc_text)
        metadatas.append(metadata)

    total = len(documents)
    logger.info(f"Computing embeddings and inserting {total} chunks into ChromaDB...")

    # Process in batches
    for start_idx in range(0, total, batch_size):
        end_idx = min(start_idx + batch_size, total)
        batch_docs = documents[start_idx:end_idx]
        batch_ids = ids[start_idx:end_idx]
        batch_metas = metadatas[start_idx:end_idx]

        embeddings = model.encode(batch_docs, show_progress_bar=False).tolist()

        collection.upsert(
            ids=batch_ids,
            documents=batch_docs,
            metadatas=batch_metas,
            embeddings=embeddings
        )
        logger.info(f"Inserted chunks {start_idx + 1} to {end_idx} of {total}")

    logger.info(f"Successfully imported {total} chunks into ChromaDB collection '{collection.name}'.")
    return total


def load_file_and_import(file_path: str):
    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {file_path}")
        sys.exit(1)

    logger.info(f"Reading chunks from {path}...")
    with open(path, "r", encoding="utf-8") as f:
        if path.suffix == ".jsonl":
            chunks = [json.loads(line) for line in f if line.strip()]
        else:
            chunks = json.load(f)

    if isinstance(chunks, dict) and "chunks" in chunks:
        chunks = chunks["chunks"]

    import_chunks_to_chroma(chunks)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        load_file_and_import(sys.argv[1])
    else:
        logger.info("No file provided. Initializing ChromaDB with built-in W3Schools seed tutorial chunks...")
        import_chunks_to_chroma(get_seed_documents())
