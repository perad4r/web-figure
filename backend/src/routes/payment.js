const express = require('express');

const paymentController = require('../controllers/paymentController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/thanh-toan/payos/return', paymentController.handleReturn);
router.get('/thanh-toan/payos/cancel', paymentController.handleCancel);
router.get('/thanh-toan/payos/cancel/:orderId', paymentController.handleCancel);
router.get('/thanh-toan/payos/:orderId', isAuthenticated, paymentController.checkout);

router.post(
  '/thanh-toan/payos/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.webhook
);

module.exports = router;
