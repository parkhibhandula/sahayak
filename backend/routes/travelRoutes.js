import express from 'express';
import {
  getTravelPackages,
  getTravelPackageById,
  createTravelPackage,
  createTravelBooking,
  getUserTravelBookings,
  getTravelBookingById,
  updateTravelBooking,
  cancelTravelBooking,
  addTravelReview,
} from '../controllers/travelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/packages', getTravelPackages);
router.get('/packages/:packageId', getTravelPackageById);

// Admin routes (could add admin check middleware)
router.post('/packages', protect, createTravelPackage);

// Booking routes (require authentication)
router.post('/bookings', protect, createTravelBooking);
router.get('/bookings/user', protect, getUserTravelBookings);
router.get('/bookings/:bookingId', protect, getTravelBookingById);
router.patch('/bookings/:bookingId', protect, updateTravelBooking);
router.delete('/bookings/:bookingId', protect, cancelTravelBooking);
router.post('/bookings/:bookingId/review', protect, addTravelReview);

export default router;
