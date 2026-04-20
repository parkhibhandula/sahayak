import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

export const signup = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      location, 
      role,
      yearsOfExperience,
      availability,
      specialization,
      hourlyRate,
      profileImage
    } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Additional validation for caretakers
    if (role === 'caretaker') {
      if (!yearsOfExperience || !availability || !specialization || !hourlyRate) {
        return res.status(400).json({ message: 'Please provide all caretaker-specific fields' });
      }
      if (!Array.isArray(specialization) || specialization.length === 0) {
        return res.status(400).json({ message: 'Specialization must be a non-empty array' });
      }
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      location,
      role: role || 'donor',
      ...(role === 'caretaker' && {
        yearsOfExperience,
        availability,
        specialization,
        hourlyRate,
        profileImage,
        isVerified: true // Auto-verify caretakers for now
      })
    });

    await user.save();

    // Create token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error during signup',
      error: error.message,
    });
  }
};

export const getCaretakers = async (req, res) => {
  try {
    const caretakers = await User.find({ role: 'caretaker', isVerified: true })
      .select('name email phone location yearsOfExperience availability specialization hourlyRate profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      caretakers,
    });
  } catch (error) {
    console.error('Get caretakers error:', error);
    res.status(500).json({
      message: 'Error fetching caretakers',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during logout',
      error: error.message,
    });
  }
};
