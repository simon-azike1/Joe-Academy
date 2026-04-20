const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect, isInstructorOrAdmin } = require('../middleware/auth');

// Public route - verifies payment via Stripe session
router.get('/verify-session', purchaseController.verifySession);

// Protected routes
router.post('/', protect, purchaseController.initiatePurchase);
router.post('/create-checkout-session', protect, purchaseController.createCheckoutSession);
router.post('/whatsapp-order', protect, purchaseController.createWhatsAppOrder);
router.get('/user', protect, purchaseController.getUserPurchases);
router.get('/lecturer-orders', protect, isInstructorOrAdmin, purchaseController.getLecturerOrders);
router.post('/confirm-manual/:orderId', protect, isInstructorOrAdmin, purchaseController.confirmManualPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), purchaseController.stripeWebhook);

module.exports = router;
