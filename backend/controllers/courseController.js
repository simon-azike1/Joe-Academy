const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Purchase = require('../models/Purchase');
const Review = require('../models/Review');

exports.getCourses = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      level, 
      type, 
      minPrice, 
      maxPrice, 
      sortBy,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (type) {
      query.type = type;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price-asc') sort = { price: 1 };
    if (sortBy === 'price-desc') sort = { price: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    if (sortBy === 'popular') sort = { enrollmentCount: -1 };

    const skip = (page - 1) * limit;

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar title')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      page: Number(page),
      courses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar title bio expertise');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const reviews = await Review.find({ courseId: course._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    const hasPurchased = req.user 
      ? await Purchase.findOne({ 
          userId: req.user.id, 
          courseId: course._id,
          paymentStatus: 'completed'
        })
      : false;

    res.json({
      success: true,
      course,
      reviews,
      hasPurchased: !!hasPurchased
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await Lecture.deleteMany({ courseId: course._id });
    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar')
      .sort({ enrollmentCount: -1 })
      .limit(6);

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      success: true,
      course,
      message: course.isPublished ? 'Course published' : 'Course unpublished'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};