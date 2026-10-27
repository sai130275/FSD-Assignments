const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides', 'Specials'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 20,
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
