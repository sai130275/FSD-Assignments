const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

const feedbackValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Service', 'Food Quality', 'Delivery', 'General Suggestion', 'Complaint', 'Compliment'])
    .withMessage('Invalid category'),
  body('comments')
    .trim()
    .notEmpty()
    .withMessage('Comments are required')
    .isLength({ min: 10 })
    .withMessage('Comments must be at least 10 characters')
    .isLength({ max: 1000 })
    .withMessage('Comments cannot exceed 1000 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
];

// GET /api/feedback - Get all feedback (limited, no sensitive data)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find({}, '-email').sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

// POST /api/feedback - Submit feedback
router.post('/', feedbackValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { customerName, category, comments, email } = req.body;

    const feedback = new Feedback({
      customerName,
      category,
      comments,
      email: email || '',
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      data: { feedbackId: feedback._id, category: feedback.category },
    });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ success: false, message: 'Failed to save feedback' });
  }
});

module.exports = router;
