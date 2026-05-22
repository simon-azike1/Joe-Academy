const mongoose = require('mongoose');

const googleFormResponseSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  
  // Session Details
  sessionType: {
    type: String,
    enum: ['virtual', 'home-service'],
    required: [true, 'Session type is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  lecturerPreference: {
    type: String,
    enum: ['match', 'preferred'],
    default: 'match'
  },
  preferredLecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Schedule
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  duration: {
    type: Number,
    default: 1
  },
  frequency: {
    type: String,
    enum: ['one-time', 'weekly'],
    default: 'one-time'
  },
  
  // Location (for home service)
  address: {
    type: String
  },
  
  // Additional Info
  notes: {
    type: String
  },
  
  // Processing Status
  processed: {
    type: Boolean,
    default: false
  },
  processedAt: {
    type: Date
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Google Form Metadata
  googleFormId: {
    type: String,
    required: [true, 'Google Form ID is required']
  },
  responseId: {
    type: String,
    required: [true, 'Response ID is required']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
googleFormResponseSchema.index({ email: 1 });
googleFormResponseSchema.index({ processed: 1 });
googleFormResponseSchema.index({ submittedAt: -1 });
googleFormResponseSchema.index({ googleFormId: 1, responseId: 1 }, { unique: true });

module.exports = mongoose.model('GoogleFormResponse', googleFormResponseSchema);