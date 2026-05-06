netstat -ano | findstr :5000
taskkill /PID 25904 /F

PART-1
  # Sahayak (Accessibility Support Platform)

A full-stack React + Node.js platform to help specially-abled individuals, senior citizens, orphan homes, and donors connect with accessibility services, community resources, and support programs.

## 🚀 Features

- Authentication (login/signup) with JWT (backend + frontend)
- Password hashing (bcrypt) and secure token middleware
- Role-aware user model: `donor`, `specially-abled`, `senior-citizen`, `orphan-home`
- Protected route sample: `/api/auth/profile`
- Client-side auth context and state persistence (localStorage)
- Responsive UI with accessible controls (voice guidance, high contrast, font scaling)
- Landing pages for:
  - About
  - How It Works
  - Impact
  - Careers
  - Community
  - Accessibility Map
  - Travel Booking
  - Government Schemes
  - Story Sharing
  - Donations
- Dashboard with quick actions and map integration
- Chatbot + voice navigation components
- Modern UI library components (Alert, Button, Card, Modal, etc.)

## 📦 Stack

- Frontend: Vite + React + TypeScript + Tailwind + Lucide Icons
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt
- Dev tools: Nodemon, CORS, Dotenv

## ▶️ Clone & run

```bash
# clone repo
git clone https://github.com/parkhibhandula/Sahayak.git
cd sahayak

# install root dependencies
npm install

# install backend dependencies
cd backend
npm install
```

## 🧩 Backend setup

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sahayak
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

Run backend:

```bash
cd backend
npm run dev
```

## 🧩 Frontend setup

Create `./.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
cd sahayak
npm run dev
```

Open http://localhost:5173 in browser.

## 🔐 Auth endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected `Authorization: Bearer <token>`)
- `POST /api/auth/logout`

## 🧪 Build

- Frontend production: `npm run build`
- Backend prod: `npm start`

## 💡 Tips

- If `JWT_SECRET` not set, backend uses default fallback (`your-secret-key`), but change in production.
- Ensure MongoDB is running locally.
- Use browser DevTools Network to verify frontend calls hit `http://localhost:5000`.

PART-2  
# 🚀 Sahayak – Chatbot Integration (Branch: chatbot-integration)

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
1. Go to aistudio.google.com → Sign in with Google → Click "Get API Key" → Create API key → Copy it
2. Go to upstash.com → Sign up free → Go to Vector → Create Index → Name: sahayak → Dimensions: 1536 → Metric: Cosine → Copy the REST URL and REST Token
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
