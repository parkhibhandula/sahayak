import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    role: {
      type: String,
      enum: ['specially-abled', 'senior-citizen', 'orphan-home', 'donor', 'caretaker'],
      default: 'donor',
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    // Caretaker specific fields
    yearsOfExperience: {
      type: Number,
      required: function() { return this.role === 'caretaker'; },
    },
    availability: {
      type: String,
      enum: ['full-time', 'part-time'],
      required: function() { return this.role === 'caretaker'; },
    },
    specialization: [{
      type: String,
      enum: ['travel assistant', 'Mobility Support', 'Elderly Care', 'Rehabilitation', 'Physical Therapy', 'Daily Activities', 'Companionship'],
      required: function() { return this.role === 'caretaker'; },
    }],
    hourlyRate: {
      type: Number,
      required: function() { return this.role === 'caretaker'; },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
playerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
playerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', playerSchema);

export default User;
