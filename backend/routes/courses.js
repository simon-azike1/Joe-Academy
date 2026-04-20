const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const { protect, isInstructorOrAdmin } = require('../middleware/auth');

router.get('/', courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/instructor', protect, isInstructorOrAdmin, courseController.getInstructorCourses);
router.get('/:id', courseController.getCourse);

router.post('/', protect, isInstructorOrAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price is required'),
  body('category').notEmpty().withMessage('Category is required')
], courseController.createCourse);

router.put('/:id', protect, isInstructorOrAdmin, courseController.updateCourse);

router.delete('/:id', protect, isInstructorOrAdmin, courseController.deleteCourse);

router.put('/:id/publish', protect, isInstructorOrAdmin, courseController.publishCourse);

module.exports = router;