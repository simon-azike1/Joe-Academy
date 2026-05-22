const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

let client = null;

const isValidAccountSid = accountSid && accountSid.startsWith('AC') && accountSid.length > 30;
const isValidAuthToken = authToken && authToken.length > 20;

if (isValidAccountSid && isValidAuthToken && whatsappFromNumber) {
  client = twilio(accountSid, authToken);
  console.log('[Twilio] WhatsApp client initialized');
} else {
  console.warn('[Twilio] Missing or invalid environment variables. WhatsApp notifications disabled.');
  if (!isValidAccountSid) {
    console.warn('[Twilio] TWILIO_ACCOUNT_SID must start with AC and be a valid SID');
  }
  if (!isValidAuthToken) {
    console.warn('[Twilio] TWILIO_AUTH_TOKEN is missing or too short');
  }
}

/**
 * Send WhatsApp message to lecturer about a new manual payment order
 * @param {Object} order - Purchase document with populated course and user
 * @returns {Promise<Object>} Twilio message result
 */
exports.sendOrderNotification = async (order) => {
  if (!client) {
    console.warn('[Twilio] Client not initialized. Skipping WhatsApp message.');
    return { skipped: true, reason: 'Twilio not configured' };
  }

  try {
    const { courseId, userId, amount, manualPaymentReference } = order;
    const student = userId;
    const course = courseId;

    const message = `
📦 *New Course Order*

👤 *Student:* ${student?.name || 'Unknown'}
📧 *Email:* ${student?.email || 'N/A'}
📱 *Phone:* ${student?.phone || 'N/A'}
📚 *Course:* ${course?.title || 'Unknown'}
💰 *Amount:* $${amount?.toFixed(2) || '0.00'}
🆔 *Order ID:* ${manualPaymentReference}

Please confirm payment in your instructor dashboard after receiving payment.

Link: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/instructor/orders
    `.trim();

    // Use course's lecturerWhatsApp or fallback to env
    const rawInstructorWhatsApp = course?.lecturerWhatsApp || process.env.LECTURER_WHATSAPP_FALLBACK;
    if (!rawInstructorWhatsApp) {
      throw new Error('No WhatsApp number configured for lecturer');
    }

    // Ensure number has whatsapp: prefix but not duplicated
    let instructorWhatsApp = rawInstructorWhatsApp;
    if (!instructorWhatsApp.startsWith('whatsapp:')) {
      instructorWhatsApp = `whatsapp:${instructorWhatsApp}`;
    }

    // Ensure from number has whatsapp: prefix but not duplicated
    let fromWhatsApp = whatsappFromNumber;
    if (!fromWhatsApp.startsWith('whatsapp:')) {
      fromWhatsApp = `whatsapp:${fromWhatsApp}`;
    }

    const result = await client.messages.create({
      from: fromWhatsApp,
      to: instructorWhatsApp,
      body: message
    });

    console.log(`[Twilio] WhatsApp message sent: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('[Twilio] Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send confirmation message to student that lecturer will contact them
 * @param {string} studentWhatsApp - Student's WhatsApp number
 * @param {Object} order - Order details
 * @returns {Promise<Object>}
 */
exports.sendStudentNotification = async (studentWhatsApp, order) => {
  if (!client || !studentWhatsApp) {
    console.warn('[Twilio] Client not initialized or no student WhatsApp. Skipping message.');
    return { skipped: true };
  }

  try {
    const message = `
✅ *Order Received!*

Thank you for ordering "${order.courseId?.title || 'the course'}".

Your lecturer will contact you on WhatsApp shortly to complete the payment.

Once payment is confirmed, you'll get instant access to the course.

📞 *Order ID:* ${order.manualPaymentReference}
    `.trim();

    // Ensure numbers have whatsapp: prefix but not duplicated
    let studentWhatsAppFormatted = studentWhatsApp;
    if (!studentWhatsAppFormatted.startsWith('whatsapp:')) {
      studentWhatsAppFormatted = `whatsapp:${studentWhatsAppFormatted}`;
    }
    let fromWhatsApp = whatsappFromNumber;
    if (!fromWhatsApp.startsWith('whatsapp:')) {
      fromWhatsApp = `whatsapp:${fromWhatsApp}`;
    }

    const result = await client.messages.create({
      from: fromWhatsApp,
      to: studentWhatsAppFormatted,
      body: message
    });

    console.log(`[Twilio] Student notification sent: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('[Twilio] Error sending student notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderNotification: exports.sendOrderNotification,
  sendStudentNotification: exports.sendStudentNotification
};
