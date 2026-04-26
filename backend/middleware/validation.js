const { body, validationResult } = require('express-validator');

// Validation rules for consultation
const validateConsultation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('healthConcern').trim().isLength({ min: 10 }).withMessage('Health concern must be at least 10 characters')
];

// Validation rules for update
const validateUpdate = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('healthSummary').optional().trim().isLength({ max: 500 }).withMessage('Max 500 characters')
];

// Error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateConsultation, validateUpdate, handleValidationErrors };