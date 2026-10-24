const express = require('express');
const router = express.Router();
const Application = require('../models/todo');

// GET: Retrieve all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error retrieving applications:', error.message);

    res.status(500).json({
      message: 'Failed to retrieve applications'
    });
  }
});

// GET: Retrieve one application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid application ID'
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error retrieving application:', error.message);

    res.status(500).json({
      message: 'Failed to retrieve application'
    });
  }
});

// POST: Submit a new internship application
router.post('/applications', async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      internshipId,
      internshipTitle,
      company
    } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof rollNumber !== 'string' ||
      !rollNumber.trim() ||
      !internshipId ||
      !internshipTitle ||
      !company
    ) {
      return res.status(400).json({
        message: 'Please fill in all required fields'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid email address'
      });
    }

    const application = new Application({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim(),
      internshipId,
      internshipTitle,
      company
    });

    const savedApplication = await application.save();

    return res.status(201).json({
      message: 'Application submitted successfully!',
      application: savedApplication
    });
  } catch (error) {
    console.error('Error submitting application:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: 'Failed to submit application'
    });
  }
});

module.exports = router;