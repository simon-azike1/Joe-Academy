const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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
  paymentStatus: {
    type: String,
    enum: ['pending', 'pending_manual_payment', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'card', 'free', 'whatsapp'],
    default: 'card'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  transactionId: {
    type: String
  },
  stripePaymentIntentId: {
    type: String
  },
  couponCode: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  manualPaymentReference: {
    type: String,
    unique: true,
    sparse: true
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: {
    type: Date
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

purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });
purchaseSchema.index({ userId: 1 });
purchaseSchema.index({ courseId: 1 });
purchaseSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);