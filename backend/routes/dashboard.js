const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, (req, res) => {
  if (req.user.role === 'student') {
    return dashboardController.getStudentStats(req, res);
  }
  if (req.user.role === 'instructor' || req.user.role === 'admin') {
    return dashboardController.getInstructorStats(req, res);
  }
  res.json({ error: 'Invalid role' });
});

router.get('/admin/stats', protect, dashboardController.getAdminStats);

module.exports = router;