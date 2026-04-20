import express from 'express';
import { signup, login, getProfile, logout, getCaretakers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', logout);
router.get('/caretakers', getCaretakers);

export default router;
