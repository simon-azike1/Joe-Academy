const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: [true, 'Lecture ID is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchedDuration: {
    type: Number,
    default: 0
  },
  lastWatchedPosition: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

progressSchema.index({ userId: 1, courseId: 1, lectureId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model('Progress', progressSchema);