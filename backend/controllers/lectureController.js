const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Purchase = require('../models/Purchase');

exports.getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const course = await Course.findById(lecture.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isInstructor = req.user &&
      (course.instructor.toString() === req.user.id || req.user.role === 'admin');

    if (!isInstructor && !lecture.isPublished) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.json({
      success: true,
      lecture
    });
  } catch (error) {
    console.error('Error in getLecture:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const userId = req.user?.id;
    const userRole = req.user?.role;
    const isInstructor = userId &&
      (course.instructor.toString() === userId || userRole === 'admin');

    if (!isInstructor && course.type === 'internal') {
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const hasPurchased = await Purchase.findOne({
        userId,
        courseId,
        paymentStatus: 'completed'
      });

      if (!hasPurchased) {
        return res.status(403).json({
          error: 'You must purchase this course to access lectures',
          code: 'COURSE_NOT_PURCHASED'
        });
      }
    }

    const query = { courseId };
    if (!isInstructor) {
      query.isPublished = true;
    }

    const lectures = await Lecture.find(query)
      .sort({ order: 1 });

    res.json({
      success: true,
      lectures
    });
  } catch (error) {
    console.error('Error in getLectures:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const lastLecture = await Lecture.findOne({ courseId }).sort({ order: -1 });
    const order = lastLecture ? lastLecture.order + 1 : 1;

    const lecture = await Lecture.create({
      ...req.body,
      courseId,
      order,
      isPublished: true // New lectures are published by default
    });

    const lectureCount = await Lecture.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, {
      totalLectures: lectureCount,
      totalDuration: req.body.duration
    });

    res.status(201).json({
      success: true,
      lecture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  try {
    let lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const course = await Course.findById(lecture.courseId);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      lecture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const course = await Course.findById(lecture.courseId);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Progress.deleteMany({ lectureId: lecture._id });
    await lecture.deleteOne();

    const lectureCount = await Lecture.countDocuments({ courseId: course._id });
    await Course.findByIdAndUpdate(course._id, { totalLectures: lectureCount });

    res.json({
      success: true,
      message: 'Lecture deleted'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reorderLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectures } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    for (let i = 0; i < lectures.length; i++) {
      await Lecture.findByIdAndUpdate(lectures[i], { order: i + 1 });
    }

    res.json({
      success: true,
      message: 'Lectures reordered'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};