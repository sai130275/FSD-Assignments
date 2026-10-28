const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Feedback category is required'],
      enum: ['Service', 'Food Quality', 'Delivery', 'General Suggestion', 'Complaint', 'Compliment'],
    },
    comments: {
      type: String,
      required: [true, 'Comments are required'],
      trim: true,
      minlength: [10, 'Comments must be at least 10 characters'],
      maxlength: [1000, 'Comments cannot exceed 1000 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      default: '',
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ category: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
