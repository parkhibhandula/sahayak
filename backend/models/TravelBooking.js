import mongoose from 'mongoose';

const travelBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelPackage',
      required: true,
    },
    numberOfParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequirements: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially-paid', 'paid'],
      default: 'unpaid',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TravelBooking', travelBookingSchema);
