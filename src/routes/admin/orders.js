const express = require('express');

const ordersController = require('../../controllers/admin/ordersController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/orders', isAuthenticated, isAdmin, ordersController.index);
router.get('/orders/:id', isAuthenticated, isAdmin, ordersController.show);
router.get('/orders/:id/partial', isAuthenticated, isAdmin, ordersController.detailPartial);
router.patch('/orders/:id/status', isAuthenticated, isAdmin, ordersController.updateStatus);
router.get('/orders/:id/payos', isAuthenticated, isAdmin, ordersController.payosCheckout);

module.exports = router;
