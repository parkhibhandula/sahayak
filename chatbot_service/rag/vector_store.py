import os
from upstash_vector import Index
from dotenv import load_dotenv

load_dotenv()

_index = None

def get_index() -> Index:
    global _index
    if _index is None:
        _index = Index(
            url=os.environ["UPSTASH_VECTOR_REST_URL"],
            token=os.environ["UPSTASH_VECTOR_REST_TOKEN"]
        )
    return _index

def upsert_vectors(vectors: list[dict]):
    """
    Upload vectors to Upstash index.
    Each dict must have: id (str), vector (list[float]), metadata (dict with "text" key)
    """
    get_index().upsert(vectors=vectors)

def search_similar(query_vector: list[float], top_k: int = 4) -> list[dict]:
    """
    Find top_k most similar chunks to the query vector.
    Returns list of {"text": str, "score": float}
    """
    results = get_index().query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )
    return [
        {"text": r.metadata.get("text", ""), "score": r.score}
        for r in results
        if r.metadata
    ]