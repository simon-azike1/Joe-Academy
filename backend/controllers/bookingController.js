const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('instructorId', 'name avatar title')
      .populate('courseId', 'title')
      .sort({ date: 1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstructorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ instructorId: req.user.id })
      .populate('userId', 'name avatar email')
      .populate('courseId', 'title')
      .sort({ date: 1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, meetingLink } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, meetingLink },
      { new: true }
    );

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};