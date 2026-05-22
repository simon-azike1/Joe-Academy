const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required']
  },
  endTime: {
    type: String
  },
  type: {
    type: String,
    enum: ['virtual', 'in-person'],
    default: 'virtual'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  meetingLink: {
    type: String
  },
  meetingPassword: {
    type: String
  },
  location: {
    type: String
  },
  topic: {
    type: String,
    maxlength: [200, 'Topic cannot exceed 200 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  duration: {
    type: Number,
    default: 60
  },
  // --- New fields for standalone bookings ---
  address: {
    type: String,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  subject: {
    type: String,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  isWeekly: {
    type: Boolean,
    default: false
  },
  bookingSource: {
    type: String,
    enum: ['website', 'google-form'],
    default: 'website'
  },
  studentName: {
    type: String
  },
  studentEmail: {
    type: String
  },
  studentPhone: {
    type: String
  },
  totalFee: {
    type: Number,
    default: 0
  },
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

bookingSchema.index({ userId: 1 });
bookingSchema.index({ instructorId: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingSource: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
