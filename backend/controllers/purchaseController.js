const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendOrderNotification, sendStudentNotification } = require('../services/twilioService');
const { sendOrderNotificationEmail } = require('../services/emailService');

console.log('[Stripe] Initialized with key:', process.env.STRIPE_SECRET_KEY ? '****' + process.env.STRIPE_SECRET_KEY.slice(-4) : 'MISSING');
console.log('[Config] FRONTEND_URL:', process.env.FRONTEND_URL || 'not set (defaulting to localhost:3000)');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log(`[Checkout] Creating session for user ${userId}, course ${courseId}`);

    const course = await Course.findById(courseId);
    if (!course) {
      console.error(`[Checkout] Course not found: ${courseId}`);
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.price === 0) {
      return res.status(400).json({ error: 'Free courses cannot be purchased via checkout' });
    }

    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
      paymentStatus: 'completed'
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You already own this course' });
    }

    const existingPendingPurchase = await Purchase.findOne({
      userId,
      courseId,
      paymentStatus: 'pending'
    });

    let purchase;
    if (!existingPendingPurchase) {
      purchase = await Purchase.create({
        userId,
        courseId,
        amount: course.price,
        paymentMethod: 'stripe',
        paymentStatus: 'pending'
      });
      console.log(`[Checkout] Created pending purchase: ${purchase._id}`);
    } else {
      purchase = existingPendingPurchase;
      console.log(`[Checkout] Using existing pending purchase: ${purchase._id}`);
    }

    // Build a valid absolute URL for the image
    let imageUrl = null;
    if (course.thumbnail) {
      if (course.thumbnail.startsWith('http')) {
        imageUrl = course.thumbnail;
      } else {
        // For relative paths, use frontend URL or localhost
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        // Ensure single slash between base and path
        const normalizedPath = course.thumbnail.startsWith('/') ? course.thumbnail : '/' + course.thumbnail;
        imageUrl = baseUrl + normalizedPath;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.shortDescription || (course.description ? course.description.substring(0, 100) : ''),
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}`,
      metadata: {
        purchaseId: purchase._id.toString(),
        userId,
        courseId
      },
      client_reference_id: purchase._id.toString(),
    });

    console.log(`[Checkout] Stripe session created: ${session.id}`);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('[Checkout] Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.initiatePurchase = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.price === 0) {
      const existingPurchase = await Purchase.findOne({
        userId,
        courseId,
        paymentStatus: 'completed'
      });

      if (existingPurchase) {
        return res.status(400).json({ error: 'You already own this course' });
      }

      const purchase = await Purchase.create({
        userId,
        courseId,
        amount: 0,
        paymentMethod: 'free',
        paymentStatus: 'completed'
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchasedCourses: courseId }
      });

      await Course.findByIdAndUpdate(courseId, {
        $inc: { enrollmentCount: 1 }
      });

      return res.json({
        success: true,
        purchase,
        message: 'Free course enrolled successfully'
      });
    }

    res.status(400).json({ error: 'Use checkout endpoint for paid courses' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.user.id
    })
      .populate('courseId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      purchases
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySession = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session from Stripe to get metadata and payment status
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const { purchaseId } = session.metadata;

    if (!purchaseId) {
      return res.status(404).json({ error: 'Purchase ID not found in session metadata' });
    }

    let purchase = await Purchase.findById(purchaseId)
      .populate('courseId');

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // If payment is confirmed in Stripe but our record is still pending, fulfill it now
    if (session.payment_status === 'paid' && purchase.paymentStatus !== 'completed') {
      console.log(`[VerifySession] Fulfilling pending purchase ${purchaseId} (webhook may have not arrived)`);
      purchase.paymentStatus = 'completed';
      purchase.transactionId = session.payment_intent;
      purchase.stripePaymentIntentId = session.payment_intent;
      await purchase.save();

      await User.findByIdAndUpdate(purchase.userId, {
        $addToSet: { purchasedCourses: purchase.courseId }
      });

      await Course.findByIdAndUpdate(purchase.courseId, {
        $inc: { enrollmentCount: 1 }
      });

      // Reload purchase with populated course
      purchase = await Purchase.findById(purchaseId).populate('courseId');
    }

    res.json({
      success: true,
      purchase,
      paymentStatus: purchase.paymentStatus
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { purchaseId } = session.metadata;

    console.log(`[Webhook] Processing checkout.session.completed for purchase: ${purchaseId}`);

    try {
      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        console.error(`[Webhook] Purchase not found: ${purchaseId}`);
        return res.status(404).json({ error: 'Purchase not found' });
      }

      if (purchase.paymentStatus === 'completed') {
        console.log(`[Webhook] Purchase already completed: ${purchaseId}`);
        return res.json({ received: true });
      }

      // Update purchase
      purchase.paymentStatus = 'completed';
      purchase.transactionId = session.payment_intent;
      purchase.stripePaymentIntentId = session.payment_intent;
      await purchase.save();
      console.log(`[Webhook] Purchase marked completed: ${purchaseId}`);

      // Add course to user's purchased list
      await User.findByIdAndUpdate(purchase.userId, {
        $addToSet: { purchasedCourses: purchase.courseId }
      });
      console.log(`[Webhook] Added course ${purchase.courseId} to user ${purchase.userId}`);

      // Increment enrollment
      await Course.findByIdAndUpdate(purchase.courseId, {
        $inc: { enrollmentCount: 1 }
      });
      console.log(`[Webhook] Enrollment count incremented for course ${purchase.courseId}`);

      console.log(`[Webhook] Purchase fulfillment complete: ${purchaseId}`);
    } catch (error) {
      console.error('[Webhook] Error fulfilling purchase:', error);
      return res.status(500).json({ error: 'Failed to fulfill purchase' });
    }
  }

  res.json({ received: true });
};

/**
 * Create WhatsApp manual payment order
 */
exports.createWhatsAppOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log(`[WhatsApp] Creating order for user ${userId}, course ${courseId}`);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if lecturer has WhatsApp number configured
    if (!course.lecturerWhatsApp && !process.env.LECTURER_WHATSAPP_FALLBACK) {
      return res.status(400).json({
        error: 'Lecturer WhatsApp number not configured. Please contact support.'
      });
    }

    // Check if user already owns this course (completed)
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
      paymentStatus: 'completed'
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You already own this course' });
    }

    // Check for existing pending manual order
    const existingPending = await Purchase.findOne({
      userId,
      courseId,
      paymentStatus: 'pending_manual_payment'
    });

    let purchase;
    let isNewOrder = false;
    if (!existingPending) {
      // Generate unique order reference
      const manualPaymentReference = `WSP-${Date.now()}-${userId.toString().slice(-6)}`;

      purchase = await Purchase.create({
        userId,
        courseId,
        amount: course.price,
        paymentMethod: 'whatsapp',
        paymentStatus: 'pending_manual_payment',
        manualPaymentReference
      });

      console.log(`[WhatsApp] Created order: ${manualPaymentReference} (${purchase._id})`);
      isNewOrder = true;
    } else {
      purchase = existingPending;
      console.log(`[WhatsApp] Using existing pending order: ${purchase._id}`);
    }

    // Populate user and course data for response
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'courseId',
        select: 'title price lecturerWhatsApp instructor',
        populate: { path: 'instructor', select: 'email' }
      });

    // Send notifications to lecturer for new orders (WhatsApp + Email fallback)
    if (isNewOrder) {
      let whatsappSuccess = false;
      
      // Try WhatsApp first
      try {
        const twilioResult = await sendOrderNotification(populatedPurchase);
        if (twilioResult.skipped) {
          console.warn('[WhatsApp] Order created but WhatsApp notification skipped (Twilio not configured)');
        } else if (!twilioResult.success) {
          console.warn('[WhatsApp] Order created but WhatsApp notification failed:', twilioResult.error);
        } else {
          console.log('[WhatsApp] Order notification sent:', twilioResult.messageSid);
          whatsappSuccess = true;
        }
      } catch (twilioError) {
        console.error('[WhatsApp] Twilio notification error:', twilioError.message);
      }

      // Send email notification as primary or fallback
      try {
        const emailResult = await sendOrderNotificationEmail(populatedPurchase);
        if (emailResult.skipped) {
          console.warn('[Email] Order email skipped:', emailResult.reason);
        } else if (!emailResult.success) {
          console.warn('[Email] Order email failed:', emailResult.error);
        } else {
          console.log('[Email] Order notification sent:', emailResult.messageId);
        }
      } catch (emailError) {
        console.error('[Email] Order notification error:', emailError.message);
      }
    }

    res.json({
      success: true,
      purchase: populatedPurchase,
      message: 'Order placed! Check your WhatsApp for instructions.',
      manualPaymentReference: purchase.manualPaymentReference
    });
  } catch (error) {
    console.error('[WhatsApp] Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get lecturer's pending manual payment orders
 */
exports.getLecturerOrders = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Find all courses taught by this instructor
    const instructorCourses = await Course.find({ instructor: instructorId }).select('_id');
    const courseIds = instructorCourses.map(c => c._id);

    // Find all orders for those courses with pending manual payment status
    const orders = await Purchase.find({
      paymentStatus: 'pending_manual_payment',
      courseId: { $in: courseIds }
    })
      .populate('userId', 'name email')
      .populate('courseId', 'title thumbnail price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('[Lecturer] Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Confirm manual payment and unlock course
 */
exports.confirmManualPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const instructorId = req.user.id;

    const purchase = await Purchase.findById(orderId)
      .populate('courseId')
      .populate('userId');

    if (!purchase) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify this instructor owns the course
    if (purchase.courseId.instructor.toString() !== instructorId) {
      return res.status(403).json({ error: 'Not authorized to confirm this order' });
    }

    if (purchase.paymentStatus !== 'pending_manual_payment') {
      return res.status(400).json({ error: 'Order is not pending manual payment' });
    }

    // Update purchase status
    purchase.paymentStatus = 'completed';
    purchase.paymentMethod = 'whatsapp';
    purchase.confirmedBy = instructorId;
    purchase.confirmedAt = new Date();
    await purchase.save();

    // Add course to student's purchased list
    await User.findByIdAndUpdate(purchase.userId, {
      $addToSet: { purchasedCourses: purchase.courseId }
    });

    // Increment enrollment
    await Course.findByIdAndUpdate(purchase.courseId, {
      $inc: { enrollmentCount: 1 }
    });

    console.log(`[WhatsApp] Order ${orderId} confirmed by instructor ${instructorId}`);

    res.json({
      success: true,
      purchase,
      message: 'Payment confirmed. Student now has access to the course.'
    });
  } catch (error) {
    console.error('[WhatsApp] Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
};
