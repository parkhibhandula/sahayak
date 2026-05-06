import express from 'express';
import {
  createRideBooking,
  getUserRideBookings,
  getRideBookingById,
  updateRideBooking,
  cancelRideBooking,
  getFareEstimate,
  assignDriver,
} from '../controllers/rideController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/fare-estimate', getFareEstimate);

// Protected routes (require authentication)
router.post('/bookings', protect, createRideBooking);
router.get('/bookings', protect, getUserRideBookings);
router.get('/bookings/:bookingId', protect, getRideBookingById);
router.patch('/bookings/:bookingId', protect, updateRideBooking);
router.delete('/bookings/:bookingId', protect, cancelRideBooking);

// Admin/Driver routes (might need additional middleware)
router.patch('/bookings/:bookingId/assign-driver', protect, assignDriver);

export default router;