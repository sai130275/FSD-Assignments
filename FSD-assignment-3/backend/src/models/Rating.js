const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    stars: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number',
      },
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: ['Overall', 'Food', 'Service', 'Ambiance', 'Value'],
      default: 'Overall',
    },
  },
  { timestamps: true }
);

ratingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Rating', ratingSchema);
