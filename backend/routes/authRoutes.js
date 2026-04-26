const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updatePassword,
  logout
} = require('../controllers/authController');

// Validation rules for registration
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('healthConcern').trim().isLength({ min: 10 }).withMessage('Health concern must be at least 10 characters')
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, (req, res, next) => {
  register(req, res, next);
});
router.post('/login', loginValidation, (req, res, next) => {
  login(req, res, next);
});

// Protected routes
router.get('/me', protect, (req, res, next) => {
  getMe(req, res, next);
});

router.put('/updatepassword', protect, (req, res, next) => {
  updatePassword(req, res, next);
});

router.post('/logout', protect, (req, res, next) => {
  logout(req, res, next);
});

module.exports = router;