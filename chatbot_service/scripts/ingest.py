"""
Run ONCE to index sahayak_docs.md into Upstash Vector.
Re-run only when you update the docs.

From inside chatbot_service/ with venv active:
    python scripts/ingest.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from rag.embedder import embed_documents
from rag.vector_store import upsert_vectors

DOCS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sahayak_docs.md")
CHUNK_SIZE = 800

def split_text(text: str) -> list[str]:
    chunks = []
    current = ""
    for para in text.split("\n\n"):
        para = para.strip()
        if not para:
            continue
        candidate = (current + "\n\n" + para).strip() if current else para
        if len(candidate) <= CHUNK_SIZE:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = para
    if current:
        chunks.append(current)
    return chunks

def main():
    print("=== SAhayak Ingestion ===", flush=True)

    with open(DOCS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"Loaded: {len(content)} characters", flush=True)

    chunks = split_text(content)
    print(f"Chunks: {len(chunks)}", flush=True)

    print("Embedding via Google text-embedding-004...", flush=True)
    vectors = []
    BATCH = 5

    for i in range(0, len(chunks), BATCH):
        batch = chunks[i: i + BATCH]
        embeddings = embed_documents(batch)
        for j, (chunk, emb) in enumerate(zip(batch, embeddings)):
            vectors.append({
                "id": f"chunk_{i + j}",
                "vector": emb,
                "metadata": {"text": chunk}
            })
        print(f"  Embedded {min(i + BATCH, len(chunks))}/{len(chunks)}", flush=True)

    print("Uploading to Upstash Vector...", flush=True)
    upsert_vectors(vectors)
    print(f"Uploaded {len(vectors)} vectors.", flush=True)
    print("\nDone. Chatbot knowledge base is ready.", flush=True)

if __name__ == "__main__":
    main()