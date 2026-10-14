import os
import sys

# Prevent transformers from probing incompatible legacy tensorflow protobufs
os.environ["USE_TF"] = "0"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import logging
from typing import List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from rag_service import get_rag_service, EduGuideRAG

# Load environment configuration
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EduGuideAPI")


# Lifespan event to warm up the RAG pipeline on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing EduGuide AI RAG service and embedding models...")
    try:
        rag = get_rag_service()
        logger.info(
            f"RAG service initialized. ChromaDB collection contains {rag.collection.count()} chunks."
        )
    except Exception as e:
        logger.warning(f"Note: RAG warmup encountered: {e}. Will retry on request.")
    yield
    logger.info("EduGuide AI backend shutting down.")


app = FastAPI(
    title="EduGuide AI - W3Schools RAG Backend",
    description="Educational AI assistant backend answering questions using W3Schools tutorials.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
allowed_origins_env = os.getenv("CORS_ORIGIN", "http://localhost:5173")
allowed_origins = [
    origin.strip()
    for origin in allowed_origins_env.split(",")
    if origin.strip()
]
# Ensure standard local Vite dev URLs are permitted
for default_origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
    if default_origin not in allowed_origins:
        allowed_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request and Response Models
class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Student question to ask EduGuide AI")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Educational answer grounded in W3Schools content")
    sources: List[str] = Field(default_factory=list, description="Referenced W3Schools tutorial URLs")


class HealthResponse(BaseModel):
    status: str
    chroma_collection: str
    documents_indexed: int
    groq_model: str
    groq_key_configured: bool


@app.get("/", tags=["Info"])
def root_info():
    return {
        "service": "EduGuide AI Backend",
        "status": "online",
        "docs": "/docs",
        "chat_endpoint": "POST /chat"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    key_configured = bool(groq_key and groq_key != "your_groq_api_key_here")

    try:
        rag = get_rag_service()
        doc_count = rag.collection.count()
        collection_name = rag.collection.name
        model_name = rag.groq_model
    except Exception as e:
        return HealthResponse(
            status=f"Degraded: {str(e)}",
            chroma_collection="unknown",
            documents_indexed=0,
            groq_model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            groq_key_configured=key_configured,
        )

    return HealthResponse(
        status="healthy",
        chroma_collection=collection_name,
        documents_indexed=doc_count,
        groq_model=model_name,
        groq_key_configured=key_configured,
    )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    question = request.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )

    logger.info(f"Received question: '{question}'")

    try:
        rag = get_rag_service()
        result = rag.answer_question(question)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except ValueError as val_err:
        logger.error(f"Configuration error: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error(f"Error handling chat request: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the answer: {str(err)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting EduGuide AI FastAPI backend on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
