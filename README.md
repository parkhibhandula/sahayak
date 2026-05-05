# 🚀 SAhayak – Chatbot Integration (Branch: chatbot-integration)

This branch introduces an AI-powered chatbot system integrated into the SAhayak platform to assist senior citizens and specially-abled users with accessible, real-time support.

---

## ✨ What’s Added in This Branch

### 🧠 1. Python Chatbot Service (`chatbot_service/`)

* Built using **FastAPI**
* Uses **RAG (Retrieval-Augmented Generation)** pipeline
* Powered by:

  * Google Gemini API (for responses)
  * Upstash Vector Database (for semantic search)
* Provides `/api/chat` endpoint for frontend communication

---

### 💬 2. Chatbot UI Integration (Frontend)

Updated files:

* `src/app/components/chatbot.tsx`
* `src/App.tsx`

Features:

* Floating chatbot widget (visible on all pages)
* Voice Input (Speech-to-Text)
* Voice Output (Text-to-Speech)
* Accessible UI for senior citizens
* Real-time API interaction with backend chatbot

---

## ⚙️ Setup Instructions

### 🔑 Step 1 — Get API Keys (set chatbot_service/.env)

You need:

```env
GOOGLE_API_KEY=your_google_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
```
1.Go to aistudio.google.com → Sign in with Google → Click "Get API Key" → Create API key → Copy it
2.Go to upstash.com → Sign up free → Go to Vector → Create Index → Name: sahayak → Dimensions: 1536 → Metric: Cosine → Copy the REST URL and REST Token
---

### 🐍 Terminal 1 — Run Chatbot Service

```bash
cd chatbot_service
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

---

### ⚙️ Terminal 2 — Run Node Backend

```bash
cd backend
npm install
npm run dev
```

---

### 🌐 Terminal 3 — Run Frontend

```bash
cd Sahayak
npm install
npm run dev
```

---

### 🌍 Open in Browser

```bash
http://localhost:5173
```

---

## 🧠 How It Works (RAG Flow)

1. User sends message from chatbot UI
2. Backend sends request to FastAPI
3. Query is embedded using Gemini embeddings
4. Relevant documents are retrieved from Upstash
5. Gemini generates context-aware response
6. Response returned to frontend chatbot

---






---

## 🙌 Summary

This integration enhances SAhayak by adding an intelligent, accessible assistant that provides both digital guidance and real-world support, especially for elderly and specially-abled users.
