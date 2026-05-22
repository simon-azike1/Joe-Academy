const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// POST /api/webhooks/stripe - Stripe webhook endpoint (no auth, raw body)
router.post('/', express.raw({ type: 'application/json' }), purchaseController.stripeWebhook);

module.exports = router;
