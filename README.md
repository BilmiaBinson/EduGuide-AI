# EduGuide AI 🎓

A modern, responsive educational AI chatbot web interface built for a website-scraped RAG assistant grounded in W3Schools tutorial content.

## Features

- **Modern Educational Dashboard**: Clean, distraction-free light theme with rounded cards, subtle shadows, and typography tailored for learning.
- **Sidebar Navigation**:
  - EduGuide AI brand with RAG badge
  - **New Chat** button
  - Recent chat history saved locally
  - Dedicated **Knowledge source: W3Schools** information card
- **Main Chat & Suggested Prompts**:
  - Welcoming hero: *"Learn anything, one question at a time."*
  - 4 quick starter cards:
    - *What is Python?*
    - *Why is Python easy to learn?*
    - *What can Python do?*
    - *Explain Python indentation.*
- **Distinct Student & AI Messages**:
  - Student messages with user bubble and timestamp
  - AI responses rendered with rich Markdown (tables, lists, code syntax, bold text)
  - Copy response button
  - **Referenced Sources**: Clickable source link pills with W3Schools badges opening directly in new tabs
- **Clean Input Bar**: Multiline auto-expanding textarea, Enter to send, Shift+Enter for new line, Send button with loading spinner.
- **Error & Offline Handling**: No fake answers. If the FastAPI backend is not running, shows a clear connection error with host details and troubleshooting hints, plus a **Retry** button.
- **Fully Responsive**: Adapts seamlessly from mobile screens (with sliding drawer) to desktop displays.

---

## Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **React Markdown** & **Remark GFM**

---

## Getting Started

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### 2. Configure Environment

Create or check your `.env` file (configured by default for standard FastAPI):

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
```

### 3. Start Development Server

Run the Vite development server:

```bash
npm run dev
```

Then open your browser at `http://localhost:5173`.

---

## FastAPI Backend Integration Guide

EduGuide AI expects a Python FastAPI server running at `VITE_API_BASE_URL`.

### Expected API Endpoint

- **Method**: `POST`
- **Path**: `/chat`
- **Request Body**:
  ```json
  {
    "question": "What is Python?"
  }
  ```
- **Response Body**:
  ```json
  {
    "answer": "Python is a popular programming language created by Guido van Rossum...",
    "sources": [
      "https://www.w3schools.com/python/python_intro.asp"
    ]
  }
  ```

### Sample FastAPI Implementation (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union

app = FastAPI(title="EduGuide AI RAG Backend")

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Your W3Schools RAG retrieval & generation pipeline goes here:
    # 1. Retrieve top matching chunks from scraped W3Schools vector DB
    # 2. Feed context and question to LLM
    # 3. Return answer and source URLs
    return ChatResponse(
        answer=f"Here is an explanation of '{request.question}' based on W3Schools...",
        sources=["https://www.w3schools.com/python/python_intro.asp"]
    )
```

Run with:
```bash
uvicorn main:app --reload --port 8001
```
