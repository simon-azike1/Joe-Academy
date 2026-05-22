const Progress = require('../models/Progress');
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const User = require('../models/User');

const COURSE_COMPLETION_CREDITS = 100; // Credits awarded per completed course

exports.updateProgress = async (req, res) => {
  try {
    const { lectureId, completed, watchedDuration, lastWatchedPosition } = req.body;
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture || lecture.courseId.toString() !== courseId) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const progressData = {
      userId,
      courseId,
      lectureId,
      completed: completed || false,
      watchedDuration: watchedDuration || 0,
      lastWatchedPosition: lastWatchedPosition || 0
    };

    if (completed) {
      progressData.completedAt = new Date();
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, lectureId },
      progressData,
      { new: true, upsert: true }
    );

    // Check for course completion and award credits
    let creditsAwarded = 0;
    if (completed) {
      const totalLectures = await Lecture.countDocuments({ courseId });
      const completedCount = await Progress.countDocuments({
        userId,
        courseId,
        completed: true
      });

      if (completedCount === totalLectures) {
        // Course fully completed - check if already credited
        const user = await User.findById(userId);
        if (user) {
          const alreadyCredited = user.completedCourses && user.completedCourses.includes(courseId);
          if (!alreadyCredited) {
            creditsAwarded = COURSE_COMPLETION_CREDITS;
            user.credits += creditsAwarded;
            if (!user.completedCourses) user.completedCourses = [];
            user.completedCourses.push(courseId);
            await user.save();

            // Update course stats
            await Course.findByIdAndUpdate(courseId, {
              $inc: { creditsEarned: creditsAwarded }
            });

            console.log(`[Credits] Awarded ${creditsAwarded} to user ${userId} for completing course ${courseId}`);
          }
        }
      }
    }

    res.json({
      success: true,
      progress,
      creditsAwarded
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.find({ 
      userId: req.user.id,
      courseId
    });

    const totalLectures = await Lecture.countDocuments({ courseId });
    const completedLectures = progress.filter(p => p.completed).length;
    const percentageCompleted = totalLectures > 0 
      ? Math.round((completedLectures / totalLectures) * 100) 
      : 0;

    res.json({
      success: true,
      progress,
      totalLectures,
      completedLectures,
      percentageCompleted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLectureProgress = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const progress = await Progress.findOne({
      userId: req.user.id,
      lectureId
    });

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};