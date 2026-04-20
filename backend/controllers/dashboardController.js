const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const Booking = require('../models/Booking');
const Progress = require('../models/Progress');

exports.getStudentStats = async (req, res) => {
  try {
    const purchasedCourses = await Purchase.find({ 
      userId: req.user.id,
      paymentStatus: 'completed'
    }).populate('courseId');

    const bookings = await Booking.find({ userId: req.user.id });
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = bookings.filter(b => 
      b.status === 'confirmed' && new Date(b.date) > new Date()
    ).length;

    res.json({
      success: true,
      stats: {
        purchasedCoursesCount: purchasedCourses.length,
        completedCoursesCount: purchasedCourses.filter(p => p.courseId).length,
        completedBookings,
        upcomingBookings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const totalStudents = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);
    const totalRevenue = courses.reduce((sum, c) => sum + (c.price * c.enrollmentCount), 0);

    const bookings = await Booking.find({ 
      instructorId: req.user.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    res.json({
      success: true,
      stats: {
        coursesCount: courses.length,
        totalStudents,
        totalRevenue,
        pendingBookings: bookings.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalUsers = await require('../models/User').countDocuments({});
    const totalPurchases = await Purchase.countDocuments({ paymentStatus: 'completed' });
    const totalBookings = await Booking.countDocuments({});

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalUsers,
        totalPurchases,
        totalBookings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};