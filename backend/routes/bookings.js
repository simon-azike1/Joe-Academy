const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.post('/standalone', protect, bookingController.createStandaloneBooking);
router.get('/estimate', protect, bookingController.getFeeEstimate);
router.get('/lecturers', protect, bookingController.getAvailableLecturers);
router.get('/user', protect, bookingController.getUserBookings);
router.get('/instructor', protect, bookingController.getInstructorBookings);
router.put('/:id', protect, bookingController.updateBookingStatus);
router.delete('/:id', protect, bookingController.cancelBooking);
router.post('/google-form', bookingController.googleFormWebhook);
router.get('/google-form/responses', protect, bookingController.getGoogleFormResponses);

module.exports = router;
