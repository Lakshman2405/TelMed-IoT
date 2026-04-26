const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const { protect, authorize } = require('../middleware/auth');
const { validateConsultation, validateUpdate, handleValidationErrors } = require('../middleware/validation');

// ============ PROTECTED ROUTES (Require Authentication) ============

// GET all patients (Admin only)
router.get('/patients', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single patient (Own profile or admin)
router.get('/patients/:email', protect, async (req, res) => {
  try {
    // Check if user is accessing their own data or is admin
    if (req.user.email !== req.params.email && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. You can only view your own profile.' 
      });
    }
    
    const patient = await Patient.findOne({ email: req.params.email, isActive: true });
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST consultation - ANY name, ANY email, logged-in user can submit for anyone
router.post('/consultation', protect, validateConsultation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, healthConcern } = req.body;
    
    // Save consultation separately from Patient accounts
    const consultation = new Consultation({
      name,
      email,
      healthConcern,
      submittedBy: req.user.email  // Track who submitted
    });
    
    await consultation.save();
    
    res.status(201).json({ 
      success: true, 
      message: `Consultation submitted for ${name} (${email})`
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE patient profile (Own profile only)
router.put('/patients/:email', protect, validateUpdate, handleValidationErrors, async (req, res) => {
  try {
    // Only allow users to update their own profile
    if (req.user.email !== req.params.email) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. You can only update your own profile.' 
      });
    }
    
    const patient = await Patient.findOne({ email: req.params.email, isActive: true });
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    if (req.body.email) patient.email = req.body.email;
    if (req.body.healthSummary !== undefined) patient.healthSummary = req.body.healthSummary;
    
    await patient.save();
    res.json({ success: true, message: 'Profile updated successfully', data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE patient (Own profile or admin)
router.delete('/patients/:email', protect, async (req, res) => {
  try {
    // Allow users to delete themselves or admin to delete any
    if (req.user.email !== req.params.email && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. You can only delete your own profile.' 
      });
    }
    
    const patient = await Patient.findOne({ email: req.params.email });
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    patient.isActive = false;
    await patient.save();
    
    res.json({ success: true, message: 'Profile deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;