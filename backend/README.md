# Sahayak Backend - JWT Authentication

This is the backend server for the Sahayak application with JWT authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder (already created with default values):

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sahayak
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on `mongodb://127.0.0.1:27017`

```bash
mongod
```

### 4. Run the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Signup
- **POST** `/api/auth/signup`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "location": "New York",
  "role": "donor"
}
```
- **Response:** 
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": { user-object }
}
```

#### 2. Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** 
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": { user-object }
}
```

#### 3. Get Profile
- **GET** `/api/auth/profile`
- **Headers:**
```json
{
  "Authorization": "Bearer jwt-token-here"
}
```
- **Response:**
```json
{
  "success": true,
  "user": { user-object }
}
```

#### 4. Logout
- **POST** `/api/auth/logout`
- **Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT
- ✅ Password Hashing with bcryptjs
- ✅ JWT Token Generation & Verification
- ✅ Protected Routes with JWT Middleware
- ✅ MongoDB Integration
- ✅ CORS Enabled
- ✅ Role-based User Management

## User Roles

- `specially-abled`: For differently-abled individuals
- `senior-citizen`: For senior citizens
- `orphan-home`: For orphanage organizations
- `donor`: For donors/volunteers

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Implement rate limiting** for authentication endpoints
4. **Add email verification** for new signups
5. **Add password reset** functionality
6. **Implement refresh tokens** for better security

## Frontend Integration

The frontend is integrated with this backend via `src/services/authService.ts`. The service handles:
- Login
- Signup
- Profile fetching
- Token storage in localStorage
- Logout

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  location: String,
  role: String (enum),
  profileImage: String,
  bio: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running
- **Port Already in Use**: Change PORT in `.env` file
- **JWT Token Expired**: User needs to login again
- **CORS Error**: Check if frontend URL is in CORS allowed origins
