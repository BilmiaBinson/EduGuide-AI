# 🎓 EduGuide AI — RAG-Powered Educational Chatbot

An AI-powered educational assistant that answers questions using content retrieved from W3Schools Python tutorials. EduGuide AI combines Retrieval-Augmented Generation (RAG) with a modern web interface to provide context-aware answers grounded in educational resources.

## ✨ Features

- **AI-Powered Q&A:** Ask questions about Python concepts and programming fundamentals.
- **Retrieval-Augmented Generation (RAG):** Retrieves relevant educational text chunks before generating answers.
- **Source-Grounded Responses:** Provides source links to relevant W3Schools documentation.
- **Interactive Chat Interface:** Clean, responsive UI with message cards and chat controls.
- **Recent Chats:** Displays recent conversations in the interface.
- **Vector Search:** Uses ChromaDB to retrieve relevant content based on semantic similarity.
- **FastAPI Backend:** Exposes an API for communication between the frontend and the RAG pipeline.

> Note: Recent chats are currently displayed in the interface. Persistent storage across sessions should be verified separately.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| RAG | Retrieval-Augmented Generation |
| Vector Database | ChromaDB |
| Embeddings | Sentence Transformers |
| Language Model | Groq API |
| Knowledge Source | W3Schools Python tutorials |

## 🏗️ System Architecture

```text
W3Schools Python Tutorials
          |
          v
   Web Scraping
          |
          v
   Text Chunking
          |
          v
 Sentence Embeddings
          |
          v
      ChromaDB
          |
          | Relevant context
          v
User Question --> React Frontend
                       |
                       v
                 FastAPI Backend
                       |
                       v
                 RAG Retrieval
                       |
                       v
                   Groq LLM
                       |
                       v
              Answer + Source Links
```

## ⚙️ How It Works

1. **Content collection:** Educational content is extracted from W3Schools Python tutorials.
2. **Text processing:** The extracted content is divided into smaller chunks.
3. **Embedding generation:** Sentence Transformers converts chunks into vector embeddings.
4. **Knowledge storage:** ChromaDB stores the embeddings and associated text.
5. **Question processing:** The user submits a question through the chat interface.
6. **Context retrieval:** The backend retrieves relevant educational chunks.
7. **Answer generation:** The Groq-hosted language model generates a response using the retrieved context.
8. **Source attribution:** Relevant source links are returned with the answer.

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or a compatible version
- Node.js and npm
- Git
- A Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/BilmiaBinson/EduGuide-AI.git
cd EduGuide-AI
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and configure the environment variables expected by your backend code, including your Groq API key.

**Never commit API keys or `.env` files to GitHub.**

### 3. Prepare the Knowledge Base

If the project requires pre-scraped chunks, place the exported `w3schools_chunks.json` file in the expected location and run the chunk loader according to its usage instructions.

```bash
python load_chunks.py w3schools_chunks.json
```

Ensure the ChromaDB collection is populated before asking questions. If the database is not included in the repository, it must be initialized or rebuilt locally.

### 4. Start the Backend

From the `backend` directory:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

The API will be available at:

- API: http://127.0.0.1:8001
- Interactive API documentation: http://127.0.0.1:8001/docs

### 5. Start the Frontend

Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

## 📚 Knowledge Source

The current knowledge source is the W3Schools Python tutorial collection.

- [W3Schools Python Tutorial](https://www.w3schools.com/python/)

Answers depend on the content available in the indexed knowledge base. Adding more educational webpages requires extracting, processing, and indexing their content.

## 🔮 Future Enhancements

- User authentication and individual chat histories.
- Persistent storage of questions and answers.
- Support for multiple subjects and educational websites.
- Document uploads for PDF-based question answering.
- Improved retrieval and answer evaluation.
- Cloud deployment for public access.
- Conversation management with saved and searchable sessions.

## 🔐 Security

- Keep API keys in environment variables.
- Exclude `.env` files from version control.
- Do not commit local database files or private credentials.
- Review third-party website terms before scraping content.

## 👩‍💻 Author

**Bilmia Binson**

GitHub: [@BilmiaBinson](https://github.com/BilmiaBinson)

## 📄 License

A license has not yet been specified. Add a `LICENSE` file if you intend to distribute the project under an open-source license.
