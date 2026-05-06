import RideBooking from '../models/RideBooking.js';
import User from '../models/User.js';

// Create a new ride booking
export const createRideBooking = async (req, res) => {
  try {
    const {
      pickupLocation,
      destination,
      rideType,
      specialRequirements,
      emergencyContact,
      fare,
    } = req.body;

    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!pickupLocation?.address || !destination?.address || !rideType || !emergencyContact || !fare?.total) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    // Create booking
    const booking = new RideBooking({
      userId,
      pickupLocation,
      destination,
      rideType,
      specialRequirements: specialRequirements || [],
      emergencyContact,
      fare,
      status: 'searching',
    });

    await booking.save();

    // Populate user info
    await booking.populate('userId', 'name phone');

    res.status(201).json({
      success: true,
      booking,
      message: 'Ride booked successfully. Finding driver...',
    });
  } catch (error) {
    console.error('Create ride booking error:', error);
    res.status(500).json({
      message: 'Error creating ride booking',
      error: error.message,
    });
  }
};

// Get user's ride bookings
export const getUserRideBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, skip = 0 } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const bookings = await RideBooking.find(query)
      .populate('userId', 'name phone')
      .populate('driverId', 'name phone rating vehicle')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await RideBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + bookings.length < total,
      },
    });
  } catch (error) {
    console.error('Get user ride bookings error:', error);
    res.status(500).json({
      message: 'Error fetching ride bookings',
      error: error.message,
    });
  }
};

// Get ride booking by ID
export const getRideBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await RideBooking.findOne({ _id: bookingId, userId })
      .populate('userId', 'name phone')
      .populate('driverId', 'name phone rating vehicle');

    if (!booking) {
      return res.status(404).json({ message: 'Ride booking not found' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get ride booking error:', error);
    res.status(500).json({
      message: 'Error fetching ride booking',
      error: error.message,
    });
  }
};

// Update ride booking (for status updates, cancellations)
export const updateRideBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Prevent updating certain fields
    const allowedUpdates = ['status', 'rating', 'feedback', 'paymentMethod'];
    const updateFields = Object.keys(updates).filter(key => allowedUpdates.includes(key));

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const booking = await RideBooking.findOneAndUpdate(
      { _id: bookingId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'name phone').populate('driverId', 'name phone rating vehicle');

    if (!booking) {
      return res.status(404).json({ message: 'Ride booking not found' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Update ride booking error:', error);
    res.status(500).json({
      message: 'Error updating ride booking',
      error: error.message,
    });
  }
};

// Cancel ride booking
export const cancelRideBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await RideBooking.findOneAndUpdate(
      { _id: bookingId, userId, status: { $in: ['searching', 'assigned', 'arriving'] } },
      {
        status: 'cancelled',
        'timestamps.cancelledAt': new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Ride booking not found or cannot be cancelled' });
    }

    res.status(200).json({
      success: true,
      booking,
      message: 'Ride cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel ride booking error:', error);
    res.status(500).json({
      message: 'Error cancelling ride booking',
      error: error.message,
    });
  }
};

// Get fare estimate (mock implementation)
export const getFareEstimate = async (req, res) => {
  try {
    const { pickup, destination, rideType } = req.query;

    // Validate inputs
    if (!pickup || !destination) {
      return res.status(400).json({
        message: 'Pickup and destination are required',
      });
    }

    // Base fares per ride type
    const baseFares = {
      economy: 50,
      premium: 80,
      wheelchair: 100,
    };

    // Price per kilometer for each ride type
    const pricePerKm = {
      economy: 15,
      premium: 25,
      wheelchair: 20,
    };

    // Estimate distance based on address length (simple heuristic)
    // In production, use Google Maps API or similar
    const addressCombined = `${pickup}${destination}`.length;
    const baseDistance = 5; // Minimum 5 km
    const estimatedDistance = baseDistance + Math.floor(addressCombined / 50) + (Math.random() * 10);

    const baseFare = baseFares[rideType] || 50;
    const pricePerKmRate = pricePerKm[rideType] || 15;
    const distance = Math.round(estimatedDistance * 10) / 10; // Round to 1 decimal
    const duration = Math.round(distance * 2); // Approx 2 min per km
    
    // Calculate total: baseFare + (distance * pricePerKm) + GST
    const subtotal = baseFare + (distance * pricePerKmRate);
    const taxes = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + taxes;

    res.status(200).json({
      success: true,
      estimate: {
        baseFare,
        distance,
        pricePerKm: pricePerKmRate,
        duration,
        subtotal: Math.round(subtotal),
        taxes,
        total: Math.round(total),
      },
    });
  } catch (error) {
    console.error('Get fare estimate error:', error);
    res.status(500).json({
      message: 'Error calculating fare estimate',
      error: error.message,
    });
  }
};

// Assign driver to booking (admin/driver endpoint)
export const assignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { driverId, vehicle } = req.body;

    const booking = await RideBooking.findByIdAndUpdate(
      bookingId,
      {
        driverId,
        vehicle,
        status: 'assigned',
        'timestamps.assignedAt': new Date(),
      },
      { new: true }
    ).populate('driverId', 'name phone rating');

    if (!booking) {
      return res.status(404).json({ message: 'Ride booking not found' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Assign driver error:', error);
    res.status(500).json({
      message: 'Error assigning driver',
      error: error.message,
    });
  }
};

export default {
  createRideBooking,
  getUserRideBookings,
  getRideBookingById,
  updateRideBooking,
  cancelRideBooking,
  getFareEstimate,
  assignDriver,
};