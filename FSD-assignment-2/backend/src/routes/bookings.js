const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');

// Restaurant capacity config
const TOTAL_TABLES = 10;
const MAX_CAPACITY_PER_SLOT = 50; // max guests per time slot
const SLOT_DURATION_MINUTES = 90; // booking slot duration

function parseDateTime(dateStr, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dt = new Date(dateStr);
  dt.setHours(hours, minutes, 0, 0);
  return dt;
}

const bookingValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('customerPhone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]{7,15}$/)
    .withMessage('Invalid phone number'),
  body('bookingDate').notEmpty().withMessage('Booking date is required').isISO8601().withMessage('Invalid date format'),
  body('bookingTime')
    .notEmpty()
    .withMessage('Booking time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('guestCount').isInt({ min: 1, max: 20 }).withMessage('Guest count must be between 1 and 20'),
  body('specialRequests').optional().trim().isLength({ max: 300 }),
];

// POST /api/bookings - Create a new booking
router.post('/', bookingValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { customerName, customerPhone, bookingDate, bookingTime, guestCount, specialRequests } = req.body;

  try {
    // Reject past dates
    const requestedDT = parseDateTime(bookingDate, bookingTime);
    const now = new Date();
    if (requestedDT <= now) {
      return res.status(400).json({ success: false, message: 'Booking date and time must be in the future' });
    }

    // Check operating hours (10:00 - 22:00)
    const [hours] = bookingTime.split(':').map(Number);
    if (hours < 10 || hours >= 22) {
      return res.status(400).json({ success: false, message: 'Bookings are only accepted between 10:00 AM and 10:00 PM' });
    }

    // Check capacity availability for this slot (±90 min window)
    const slotStart = new Date(requestedDT.getTime() - SLOT_DURATION_MINUTES * 60 * 1000);
    const slotEnd = new Date(requestedDT.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
    
    const dateOnly = new Date(bookingDate);
    const dayStart = new Date(dateOnly.setHours(0, 0, 0, 0));
    const dayEnd = new Date(dateOnly.setHours(23, 59, 59, 999));

    const existingBookings = await Booking.find({
      bookingDate: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: 'cancelled' },
    });

    // Find overlapping bookings
    const overlapping = existingBookings.filter((b) => {
      const bDT = parseDateTime(b.bookingDate.toISOString().split('T')[0], b.bookingTime);
      return bDT >= slotStart && bDT <= slotEnd;
    });

    const totalExistingGuests = overlapping.reduce((sum, b) => sum + b.guestCount, 0);
    const totalTables = overlapping.length;

    if (totalTables >= TOTAL_TABLES) {
      return res.status(409).json({
        success: false,
        message: 'No tables available for this time slot. Please choose a different time.',
      });
    }

    if (totalExistingGuests + parseInt(guestCount) > MAX_CAPACITY_PER_SLOT) {
      return res.status(409).json({
        success: false,
        message: 'Insufficient capacity for this time slot. Please choose a different time.',
      });
    }

    // Assign a table number (simple: next available)
    const usedTables = overlapping.map((b) => b.tableNumber).filter(Boolean);
    let tableNumber = 1;
    while (usedTables.includes(tableNumber)) tableNumber++;

    const booking = new Booking({
      customerName,
      customerPhone,
      bookingDate: new Date(bookingDate),
      bookingTime,
      guestCount: parseInt(guestCount),
      specialRequests: specialRequests || '',
      tableNumber,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Table booked successfully',
      data: {
        bookingId: booking._id,
        referenceId: booking.referenceId,
        tableNumber: booking.tableNumber,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        guestCount: booking.guestCount,
        status: booking.status,
      },
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
});

// GET /api/bookings/:id - Get booking by ID or reference ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let booking;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    } else {
      booking = await Booking.findOne({ referenceId: id.toUpperCase() });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
});

module.exports = router;
