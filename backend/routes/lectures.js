const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { protect, isInstructorOrAdmin } = require('../middleware/auth');

router.get('/lecture/:id', protect, lectureController.getLecture);
router.get('/:courseId', protect, lectureController.getLectures);
router.post('/:courseId', protect, isInstructorOrAdmin, lectureController.createLecture);
router.put('/:id', protect, isInstructorOrAdmin, lectureController.updateLecture);
router.delete('/:id', protect, isInstructorOrAdmin, lectureController.deleteLecture);
router.put('/:courseId/reorder', protect, isInstructorOrAdmin, lectureController.reorderLectures);

module.exports = router;