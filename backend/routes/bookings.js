const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.get('/user', protect, bookingController.getUserBookings);
router.get('/instructor', protect, bookingController.getInstructorBookings);
router.put('/:id', protect, bookingController.updateBookingStatus);
router.delete('/:id', protect, bookingController.cancelBooking);

module.exports = router;