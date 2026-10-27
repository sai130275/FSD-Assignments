require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const bookingRoutes = require('./routes/bookings');
const ratingRoutes = require('./routes/ratings');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Restaurant API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant API running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
