const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new patient
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  console.log('1. Register function called');
  console.log('2. Request body:', req.body);
  
  try {
    const { name, email, password, healthConcern } = req.body;
    
    console.log('3. Checking if patient exists');
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      console.log('4. Patient already exists');
      return res.status(400).json({ 
        success: false, 
        error: 'Patient already exists with this email' 
      });
    }
    
    console.log('5. Creating patient');
    const patient = await Patient.create({
      name,
      email,
      password,
      healthConcern
    });
    
    console.log('6. Generating token');
    const token = generateToken(patient._id);
    
    console.log('7. Sending response');
    res.status(201).json({
      success: true,
      token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        healthConcern: patient.healthConcern
      }
    });
  } catch (error) {
    console.log('ERROR:', error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login patient
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide email and password' 
      });
    }
    
    // Check if patient exists and get password
    const patient = await Patient.findOne({ email }).select('+password');
    
    if (!patient) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Check if patient is active
    if (!patient.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: 'Account has been deactivated' 
      });
    }
    
    // Check password
    const isPasswordMatch = await patient.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Update last login
    patient.lastLogin = Date.now();
    await patient.save();
    
    // Generate token
    const token = generateToken(patient._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        healthConcern: patient.healthConcern,
        healthSummary: patient.healthSummary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current logged in patient
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get patient with password
    const patient = await Patient.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await patient.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }
    
    // Update password
    patient.password = newPassword;
    await patient.save();
    
    // Generate new token
    const token = generateToken(patient._id);
    
    res.json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  // Since we're using stateless JWT, logout is handled client-side
  // by removing the token
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
  logout
};