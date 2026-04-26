const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token (excluding password)
      const Patient = require('../models/Patient');
      req.user = await Patient.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }
      
      if (!req.user.isActive) {
        return res.status(401).json({ success: false, error: 'Account deactivated' });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

// Middleware for role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };