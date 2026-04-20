const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/lecture/:lectureId', protect, progressController.getLectureProgress);
router.post('/:courseId', protect, progressController.updateProgress);
router.get('/:courseId', protect, progressController.getCourseProgress);

module.exports = router;