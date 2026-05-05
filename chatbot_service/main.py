from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag.pipeline import run_rag_pipeline
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SAhayak Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.environ.get("FRONTEND_URL", "*")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str | None = None

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]

@app.get("/")
def root():
    return {"status": "SAhayak chatbot service is running"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(request.message) > 500:
        raise HTTPException(status_code=400, detail="Message too long")
    result = run_rag_pipeline(request.message.strip())
    return ChatResponse(answer=result["answer"], sources=result["sources"])