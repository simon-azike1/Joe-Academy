const Review = require('../models/Review');
const Course = require('../models/Course');
const Purchase = require('../models/Purchase');

exports.createReview = async (req, res) => {
  try {
    const { courseId } = req.params;

    const purchase = await Purchase.findOne({
      userId: req.user.id,
      courseId,
      paymentStatus: 'completed'
    });

    const existingReview = await Review.findOne({
      userId: req.user.id,
      courseId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this course' });
    }

    const review = await Review.create({
      userId: req.user.id,
      courseId,
      ...req.body,
      isVerified: !!purchase
    });

    const courseReviews = await Review.find({ courseId });
    const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

    await Course.findByIdAndUpdate(courseId, {
      rating: avgRating,
      reviewCount: courseReviews.length
    });

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const oldRating = review.rating;
    const newRating = req.body.rating || oldRating;

    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (oldRating !== newRating) {
      const courseReviews = await Review.find({ courseId: review.courseId });
      const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

      await Course.findByIdAndUpdate(review.courseId, {
        rating: avgRating
      });
    }

    res.json({
      success: true,
      message: 'Review updated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const courseId = review.courseId;
    await review.deleteOne();

    const courseReviews = await Review.find({ courseId });
    const avgRating = courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
      : 0;

    await Course.findByIdAndUpdate(courseId, {
      rating: avgRating,
      reviewCount: courseReviews.length
    });

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};