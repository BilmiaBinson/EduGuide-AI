# Google Colab to Local ChromaDB Export & Import Guide 🎓

This guide explains how to export your scraped W3Schools tutorial chunks and metadata from your Google Colab notebook and load them into your local EduGuide AI backend while preserving all source URLs.

---

## Option 1: Export as JSON (Recommended — 100% Cross-Platform Compatible)

Because Google Colab runs Linux (x86_64) and your laptop is running Windows, SQLite and ChromaDB binary index files can occasionally have version mismatch issues. Exporting to a portable JSON file is the most reliable approach.

### Step 1: Run this cell in your Google Colab Notebook

```python
import json
import chromadb
from google.colab import files

# 1. Connect to your existing ChromaDB collection in Colab
# (Replace the path and collection name with the ones you used in Colab)
client = chromadb.PersistentClient(path="./chroma_db")  # or /content/chroma_db
collection = client.get_collection("w3schools_python")

# 2. Extract all chunks, documents, and metadata
data = collection.get(include=["documents", "metadatas"])

export_chunks = []
for chunk_id, doc, meta in zip(data["ids"], data["documents"], data["metadatas"]):
    export_chunks.append({
        "id": chunk_id,
        "content": doc,
        # Preserve source URL and metadata
        "url": meta.get("url") or meta.get("source", "https://www.w3schools.com/python/"),
        "title": meta.get("title", "W3Schools Tutorial"),
        "metadata": meta
    })

# 3. Save to JSON and download
output_filename = "w3schools_chunks.json"
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(export_chunks, f, ensure_ascii=False, indent=2)

print(f"✅ Successfully exported {len(export_chunks)} chunks with source URLs.")
files.download(output_filename)
```

### Step 2: Import into your Local EduGuide AI Backend

1. Move the downloaded `w3schools_chunks.json` into the `backend/` folder on your laptop.
2. Open PowerShell in `backend/` and run:
   ```powershell
   python load_chunks.py w3schools_chunks.json
   ```
3. The script will compute embeddings with `all-MiniLM-L6-v2` and store them in `backend/data/chroma_db` with all source URLs preserved.

---

## Option 2: Direct Zip Archive Transfer

If your Colab notebook wrote the ChromaDB database to a directory (e.g. `/content/chroma_db`):

### Step 1: In Google Colab
```python
!zip -r chroma_db.zip /content/chroma_db
from google.colab import files
files.download("chroma_db.zip")
```

### Step 2: On your Laptop
1. Extract `chroma_db.zip`.
2. Place the contents directly into `EduGuide-AI/backend/data/chroma_db/`.
3. Verify that `CHROMA_PERSIST_DIRECTORY=./data/chroma_db` in `backend/.env`.

---

## Built-In Seed Fallback

If you haven't exported your Colab notebook yet, the backend includes built-in seed chunks in `seed_data.py` covering core Python topics (Introduction, Syntax, Indentation, Variables, Data Types, If...Else, Loops, Functions) with verified W3Schools URLs. The backend will automatically load this seed data so you can test immediately!
