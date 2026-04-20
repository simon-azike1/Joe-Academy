require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lectureRoutes = require('./routes/lectures');
const purchaseRoutes = require('./routes/purchases');
const webhookRoutes = require('./routes/webhooks');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const progressRoutes = require('./routes/progress');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Mount webhook route FIRST (before any body parsing) - it needs raw body
app.use('/api/webhooks/stripe', require('./routes/webhooks'));

// Now add CORS and body parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all other routes (they get parsed JSON body)
app.use('/api/purchase', purchaseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LearnHub API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
