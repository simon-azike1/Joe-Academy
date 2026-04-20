const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  title: {
    type: String,
    required: [true, 'Lecture title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  videoUrl: {
    type: String,
    default: ''
  },
  videoId: {
    type: String
  },
  duration: {
    type: Number,
    default: 0
  },
  durationText: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

lectureSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model('Lecture', lectureSchema);