const express = require('express');

const orderController = require('../controllers/orderController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/lich-su-don-hang', isAuthenticated, orderController.orderHistory);
router.get('/lich-su-don-hang/:id', isAuthenticated, orderController.orderDetail);
router.patch('/lich-su-don-hang/:id/huy', isAuthenticated, orderController.cancelOrder);
router.patch('/lich-su-don-hang/:id/da-nhan', isAuthenticated, orderController.markReceived);

module.exports = router;

