const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');

const ratingValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('review').optional().trim().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['Overall', 'Food', 'Service', 'Ambiance', 'Value'])
    .withMessage('Invalid category'),
];

// GET /api/ratings - Get all ratings with average
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).limit(50);
    const avgResult = await Rating.aggregate([
      { $group: { _id: null, avgStars: { $avg: '$stars' }, count: { $sum: 1 } } },
    ]);

    const average = avgResult.length > 0 ? Math.round(avgResult[0].avgStars * 10) / 10 : 0;
    const totalCount = avgResult.length > 0 ? avgResult[0].count : 0;

    res.json({
      success: true,
      data: {
        ratings,
        average,
        totalCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
  }
});

// POST /api/ratings - Submit a rating
router.post('/', ratingValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { customerName, stars, review, category } = req.body;
    const rating = new Rating({
      customerName,
      stars: parseInt(stars),
      review: review || '',
      category: category || 'Overall',
    });

    await rating.save();

    // Compute new average
    const avgResult = await Rating.aggregate([
      { $group: { _id: null, avgStars: { $avg: '$stars' }, count: { $sum: 1 } } },
    ]);
    const newAverage = avgResult.length > 0 ? Math.round(avgResult[0].avgStars * 10) / 10 : stars;

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating!',
      data: { rating, newAverage },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save rating' });
  }
});

module.exports = router;
