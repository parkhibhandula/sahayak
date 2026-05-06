import mongoose from 'mongoose';

const rideBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    rideType: {
      type: String,
      enum: ['economy', 'premium', 'wheelchair'],
      required: true,
    },
    specialRequirements: [{
      type: String,
      enum: ['assistance', 'luggage', 'medical'],
    }],
    emergencyContact: {
      type: String,
      required: true,
    },
    fare: {
      baseFare: { type: Number, required: true },
      distance: { type: Number },
      duration: { type: Number },
      taxes: { type: Number },
      total: { type: Number, required: true },
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver', // Assuming we have a Driver model
    },
    vehicle: {
      model: { type: String },
      number: { type: String },
      color: { type: String },
      type: { type: String },
    },
    status: {
      type: String,
      enum: ['searching', 'assigned', 'arriving', 'pickup', 'enroute', 'arrived', 'completed', 'cancelled'],
      default: 'searching',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
    timestamps: {
      bookedAt: { type: Date, default: Date.now },
      assignedAt: { type: Date },
      pickedUpAt: { type: Date },
      completedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
rideBookingSchema.index({ userId: 1, createdAt: -1 });
rideBookingSchema.index({ driverId: 1, status: 1 });
rideBookingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('RideBooking', rideBookingSchema);