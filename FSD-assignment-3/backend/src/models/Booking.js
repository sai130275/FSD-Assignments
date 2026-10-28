const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    bookingTime: {
      type: String,
      required: [true, 'Booking time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'At least 1 guest required'],
      max: [20, 'Maximum 20 guests per booking'],
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [300, 'Special requests cannot exceed 300 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    tableNumber: {
      type: Number,
      min: 1,
      max: 20,
    },
  },
  { timestamps: true }
);

// Auto-generate reference ID
bookingSchema.pre('save', async function (next) {
  if (!this.referenceId) {
    const count = await this.constructor.countDocuments();
    this.referenceId = `BKG-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

bookingSchema.index({ bookingDate: 1, bookingTime: 1 });
bookingSchema.index({ customerPhone: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
