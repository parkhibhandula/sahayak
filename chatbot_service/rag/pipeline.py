import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from rag.embedder import embed_query, get_client
from rag.vector_store import search_similar

load_dotenv()

SYSTEM_PROMPT = """You are a friendly helper for the Sahayak platform. Sahayak helps senior citizens, specially-abled people, orphan homes, and donors get services like travel help, caretakers, and finding accessible places.

Your job is to answer questions in a warm, simple, and natural way — like a helpful person talking to someone, not like a robot reading instructions.

Guidelines:
- Talk naturally. Use simple everyday words. Short sentences.
- Never say things like "Based on the context provided" or "According to the information" — just answer directly.
- If someone asks how to do something, walk them through it step by step in a friendly way.
- If the answer is not in the context below, say: "I'm not sure about that — you could contact the Sahayak support team for help!"
- Be warm and encouraging. Many of our users are elderly or specially-abled. Be patient.
- Never make up steps or features that are not in the context.
- Keep answers focused and not too long.

Here is the information you can use to answer:
{context}

Question: {question}

Answer (naturally and warmly):"""


def run_rag_pipeline(user_question: str) -> dict:
    query_vector = embed_query(user_question)
    chunks = search_similar(query_vector, top_k=4)

    if not chunks:
        return {
            "answer": "I'm not sure about that one! You can reach out to the Sahayak support team and they'll be happy to help.",
            "sources": []
        }

    context = "\n\n".join([c["text"] for c in chunks])
    prompt = SYSTEM_PROMPT.format(context=context, question=user_question)

    client = get_client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.4,
            max_output_tokens=600
        )
    )

    return {
        "answer": response.text.strip(),
        "sources": [c["text"][:80] + "..." for c in chunks]
    }