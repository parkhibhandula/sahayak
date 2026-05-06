import TravelPackage from '../models/TravelPackage.js';
import TravelBooking from '../models/TravelBooking.js';
import User from '../models/User.js';

// Travel Packages
export const getTravelPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find({ isActive: true })
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error('Get travel packages error:', error);
    res.status(500).json({
      message: 'Error fetching travel packages',
      error: error.message,
    });
  }
};

export const getTravelPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;

    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage) {
      return res.status(404).json({ message: 'Travel package not found' });
    }

    res.status(200).json({
      success: true,
      package: travelPackage,
    });
  } catch (error) {
    console.error('Get travel package error:', error);
    res.status(500).json({
      message: 'Error fetching travel package',
      error: error.message,
    });
  }
};

export const createTravelPackage = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, price, description, maxParticipants, accessibility, guide, image } = req.body;

    // Validation
    if (!title || !destination || !startDate || !endDate || !price || !description || !maxParticipants) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const travelPackage = new TravelPackage({
      title,
      destination,
      startDate,
      endDate,
      price,
      description,
      maxParticipants,
      accessibility: accessibility || [],
      guide: guide || {},
      image,
    });

    await travelPackage.save();

    res.status(201).json({
      success: true,
      message: 'Travel package created successfully',
      package: travelPackage,
    });
  } catch (error) {
    console.error('Create travel package error:', error);
    res.status(500).json({
      message: 'Error creating travel package',
      error: error.message,
    });
  }
};

// Travel Bookings
export const createTravelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packageId, numberOfParticipants, specialRequirements, contactNumber, notes, totalCost } = req.body;

    // Validation
    if (!packageId || !numberOfParticipants || !contactNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify package exists
    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage) {
      return res.status(404).json({ message: 'Travel package not found' });
    }

    // Create booking
    const booking = new TravelBooking({
      userId,
      packageId,
      numberOfParticipants,
      specialRequirements: specialRequirements || '',
      contactNumber,
      notes: notes || '',
      totalCost: totalCost || (numberOfParticipants * travelPackage.price),
    });

    await booking.save();

    // Populate user and package info
    await booking.populate('userId', 'name email phone');
    await booking.populate('packageId', 'title destination startDate endDate price');

    res.status(201).json({
      success: true,
      message: 'Travel booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create travel booking error:', error);
    res.status(500).json({
      message: 'Error creating travel booking',
      error: error.message,
    });
  }
};

export const getUserTravelBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await TravelBooking.find({ userId })
      .populate('packageId', 'title destination startDate endDate price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Get user travel bookings error:', error);
    res.status(500).json({
      message: 'Error fetching travel bookings',
      error: error.message,
    });
  }
};

export const getTravelBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await TravelBooking.findById(bookingId)
      .populate('userId', 'name email phone')
      .populate('packageId', 'title destination startDate endDate price image guide');

    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get travel booking error:', error);
    res.status(500).json({
      message: 'Error fetching travel booking',
      error: error.message,
    });
  }
};

export const updateTravelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const { status, numberOfParticipants, specialRequirements, contactNumber, notes } = req.body;

    const booking = await TravelBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (status) booking.status = status;
    if (numberOfParticipants) booking.numberOfParticipants = numberOfParticipants;
    if (specialRequirements !== undefined) booking.specialRequirements = specialRequirements;
    if (contactNumber) booking.contactNumber = contactNumber;
    if (notes !== undefined) booking.notes = notes;

    // Recalculate cost if participants change
    if (numberOfParticipants) {
      const travelPackage = await TravelPackage.findById(booking.packageId);
      booking.totalCost = numberOfParticipants * travelPackage.price;
    }

    await booking.save();

    await booking.populate('userId', 'name email phone');
    await booking.populate('packageId', 'title destination price');

    res.status(200).json({
      success: true,
      message: 'Travel booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update travel booking error:', error);
    res.status(500).json({
      message: 'Error updating travel booking',
      error: error.message,
    });
  }
};

export const cancelTravelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await TravelBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed bookings' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Travel booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Cancel travel booking error:', error);
    res.status(500).json({
      message: 'Error cancelling travel booking',
      error: error.message,
    });
  }
};

export const addTravelReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await TravelBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to add review' });
    }

    booking.rating = rating;
    booking.review = review || '';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      booking,
    });
  } catch (error) {
    console.error('Add travel review error:', error);
    res.status(500).json({
      message: 'Error adding review',
      error: error.message,
    });
  }
};
