import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    return _client

EMBED_MODEL = "gemini-embedding-001"

def embed_documents(texts: list[str]) -> list[list[float]]:
    """Embed document chunks for indexing. Truncated to 1536 dims for Upstash free tier."""
    client = get_client()
    result = []
    for text in texts:
        response = client.models.embed_content(
            model=EMBED_MODEL,
            contents=text,
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT",
                output_dimensionality=1536
            )
        )
        result.append(response.embeddings[0].values)
    return result

def embed_query(text: str) -> list[float]:
    """Embed a user query. Must match index dimension (1536)."""
    client = get_client()
    response = client.models.embed_content(
        model=EMBED_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=1536
        )
    )
    return response.embeddings[0].values