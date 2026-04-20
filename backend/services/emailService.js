const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOrderNotificationEmail = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] Email not configured. Skipping email notification.');
    return { skipped: true, reason: 'Email not configured' };
  }

  try {
    const { courseId, userId, amount, manualPaymentReference } = order;
    const student = userId;
    const course = courseId;

    // Try multiple sources for instructor email
    let instructorEmail = course?.instructor?.email;
    
    if (!instructorEmail && course?.instructor) {
      // If instructor is just an ObjectId, fetch from User model
      const User = require('../models/User');
      const instructor = await User.findById(course.instructor).select('email');
      instructorEmail = instructor?.email;
    }
    
    // Fallback to env var
    if (!instructorEmail) {
      instructorEmail = process.env.LECTURER_EMAIL_FALLBACK;
    }
    
    if (!instructorEmail) {
      return { skipped: true, reason: 'No instructor email found' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: instructorEmail,
      subject: `📦 New Course Order - ${manualPaymentReference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A2D44;">New Course Order</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Student:</strong> ${student?.name || 'Unknown'}</p>
            <p><strong>📧 Email:</strong> ${student?.email || 'N/A'}</p>
            <p><strong>📱 Phone:</strong> ${student?.phone || 'N/A'}</p>
            <p><strong>📚 Course:</strong> ${course?.title || 'Unknown'}</p>
            <p><strong>💰 Amount:</strong> $${amount?.toFixed(2) || '0.00'}</p>
            <p><strong>🆔 Order ID:</strong> ${manualPaymentReference}</p>
          </div>

          <p style="color: #666;">Please confirm payment and grant access to the student from your instructor dashboard.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/instructor/orders" 
             style="display: inline-block; background: #F59E0B; color: #1A2D44; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Orders
          </a>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('[Email] Order notification sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] Error sending order notification:', error.message);
    return { success: false, error: error.message };
  }
};