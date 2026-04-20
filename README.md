
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

  