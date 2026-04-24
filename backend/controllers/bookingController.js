const Booking = require('../models/Booking');
const User = require('../models/User');
const GoogleFormResponse = require('../models/GoogleFormResponse');

// Subject-based pricing (DHS)
const SCIENCE_SUBJECTS = ['Chemistry', 'Mathematics', 'Biology', 'Physics', 'GIS', 'Remote Sensing'];
const LANGUAGE_SUBJECTS = ['French', 'English'];

/**
 * Calculate booking fee based on subject, duration, and frequency
 * @param {string} subject - Subject name
 * @param {number} durationHours - Duration in hours
 * @param {boolean} isWeekly - Whether it's a weekly/continuous session
 * @returns {number} Total fee in DHS
 */
const calculateFee = (subject, durationHours, isWeekly = false) => {
  const category = SCIENCE_SUBJECTS.includes(subject) ? 'science' : LANGUAGE_SUBJECTS.includes(subject) ? 'language' : 'science';
  const hourlyRate = category === 'science' ? 130 : 120;
  let total = hourlyRate * durationHours;
  
  if (isWeekly) {
    total = total * 0.9; // 10% discount
  }
  
  return Math.round(total);
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a standalone booking (not tied to a course)
 * For online sessions and home services
 */
exports.createStandaloneBooking = async (req, res) => {
  try {
    const {
      instructorId,
      date,
      time,
      type,
      subject,
      duration,
      isWeekly,
      topic,
      notes,
      address,
      studentName,
      studentEmail,
      studentPhone
    } = req.body;

    // Validate required fields
    if (!instructorId || !date || !time || !type || !subject) {
      return res.status(400).json({ error: 'Please provide instructor, date, time, type, and subject' });
    }

    // Home service requires address
    if (type === 'in-person' && !address) {
      return res.status(400).json({ error: 'Address is required for home service bookings' });
    }

    // Calculate fee
    const durationHours = Number(duration) || 1;
    const fee = calculateFee(subject, durationHours, isWeekly || false);

    // Create the booking
    const booking = await Booking.create({
      userId: req.user.id,
      instructorId,
      date: new Date(date),
      time,
      type,
      subject,
      duration: durationHours * 60,
      isWeekly: isWeekly || false,
      topic: topic || `${subject} Session`,
      notes,
      address: type === 'in-person' ? address : undefined,
      price: fee,
      totalFee: fee,
      studentName: studentName || req.user.name,
      studentEmail: studentEmail || req.user.email,
      studentPhone: studentPhone || req.user.phone,
      bookingSource: 'website',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create standalone booking error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get fee estimate without creating a booking
 */
exports.getFeeEstimate = async (req, res) => {
  try {
    const { subject, duration, isWeekly } = req.query;
    
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const durationHours = Number(duration) || 1;
    const fee = calculateFee(subject, durationHours, isWeekly === 'true');

    // Get subject category
    const category = SCIENCE_SUBJECTS.includes(subject) ? 'science' : LANGUAGE_SUBJECTS.includes(subject) ? 'language' : 'science';
    const hourlyRate = category === 'science' ? 130 : 120;

    res.json({
      success: true,
      fee,
      breakdown: {
        hourlyRate,
        durationHours,
        subtotal: hourlyRate * durationHours,
        discount: isWeekly === 'true' ? Math.round(hourlyRate * durationHours * 0.1) : 0,
        isWeekly: isWeekly === 'true'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get available instructors/lecturers for booking
 */
exports.getAvailableLecturers = async (req, res) => {
  try {
    const { subject } = req.query;
    
    // Find instructors, optionally filtered by expertise matching subject
    let query = { role: 'instructor' };
    
    if (subject) {
      // Try to match expertise or title with subject
      query = {
        role: 'instructor',
        $or: [
          { expertise: { $regex: subject, $options: 'i' } },
          { title: { $regex: subject, $options: 'i' } },
          { bio: { $regex: subject, $options: 'i' } }
        ]
      };
    }

    const lecturers = await User.find(query)
      .select('name avatar title bio expertise hourlyRate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: lecturers.length,
      lecturers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('instructorId', 'name avatar title')
      .populate('courseId', 'title')
      .sort({ date: 1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstructorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ instructorId: req.user.id })
      .populate('userId', 'name avatar email')
      .populate('courseId', 'title')
      .sort({ date: 1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, meetingLink } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, meetingLink },
      { new: true }
    );

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle Google Form webhook submissions
 * Receives POST from Google Apps Script
 */
exports.googleFormWebhook = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      sessionType,
      subject,
      lecturerPreference,
      preferredLecturer,
      date,
      time,
      duration,
      frequency,
      address,
      notes,
      googleFormId,
      responseId
    } = req.body;

    console.log('[GoogleForm] Received submission:', googleFormId || 'unknown');

    // Validate required fields
    if (!name || !email || !phone || !sessionType || !subject || !date || !time) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    // Check for duplicate submission
    if (googleFormId && responseId) {
      const existing = await GoogleFormResponse.findOne({ googleFormId, responseId });
      if (existing) {
        return res.status(400).json({ 
          success: false,
          error: 'Duplicate submission detected' 
        });
      }
    }

    // Find or create a placeholder user
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create a placeholder user for Google Form submissions
      user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: Math.random().toString(36).slice(-8), // Random password
        role: 'student'
      });
      console.log('[GoogleForm] Created placeholder user:', user._id);
    }

    // Find instructor - use preferred if specified, otherwise find any matching
    let instructor;
    if (lecturerPreference === 'preferred' && preferredLecturer) {
      instructor = await User.findById(preferredLecturer);
    }
    
    if (!instructor) {
      // Find first instructor that matches the subject
      instructor = await User.findOne({
        role: 'instructor',
        $or: [
          { expertise: { $regex: subject, $options: 'i' } },
          { title: { $regex: subject, $options: 'i' } }
        ]
      });
    }

    // Fallback: find any instructor
    if (!instructor) {
      instructor = await User.findOne({ role: 'instructor' });
    }

    if (!instructor) {
      return res.status(400).json({ 
        success: false,
        error: 'No instructor available' 
      });
    }

    // Calculate fee
    const durationHours = Number(duration) || 1;
    const isWeekly = frequency === 'weekly';
    const fee = calculateFee(subject, durationHours, isWeekly);

    // Create the booking
    const booking = await Booking.create({
      userId: user._id,
      instructorId: instructor._id,
      date: new Date(date),
      time,
      type: sessionType === 'home-service' ? 'in-person' : 'virtual',
      subject,
      duration: durationHours * 60,
      isWeekly,
      topic: `${subject} Session - ${name}`,
      notes: notes || `Google Form submission: ${googleFormId || 'N/A'}`,
      address: sessionType === 'home-service' ? address : undefined,
      price: fee,
      totalFee: fee,
      studentName: name,
      studentEmail: email,
      studentPhone: phone,
      bookingSource: 'google-form',
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Save Google Form response
    if (googleFormId) {
      await GoogleFormResponse.create({
        name,
        email: email.toLowerCase(),
        phone,
        sessionType,
        subject,
        lecturerPreference: lecturerPreference || 'match',
        preferredLecturer,
        date: new Date(date),
        time,
        duration: durationHours,
        frequency: frequency || 'one-time',
        address: sessionType === 'home-service' ? address : undefined,
        notes,
        processed: true,
        processedAt: new Date(),
        bookingId: booking._id,
        googleFormId,
        responseId: responseId || Math.random().toString(36).substring(2, 15)
      });
    }

    console.log('[GoogleForm] Booking created:', booking._id);

    res.status(201).json({
      success: true,
      booking,
      message: 'Booking created from Google Form submission'
    });
  } catch (error) {
    console.error('[GoogleForm] Webhook error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Get Google Form responses
 */
exports.getGoogleFormResponses = async (req, res) => {
  try {
    const responses = await GoogleFormResponse.find()
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      responses
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
