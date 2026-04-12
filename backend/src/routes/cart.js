const express = require('express');

const cartController = require('../controllers/cartController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/giohangs', isAuthenticated, cartController.cartPage);
router.post('/giohangs', isAuthenticated, cartController.addToCart);
router.put('/giohangs/:id', isAuthenticated, cartController.updateQty);
router.delete('/giohangs/:id', isAuthenticated, cartController.removeItem);
router.post('/giohangs/checkout', isAuthenticated, cartController.checkout);

module.exports = router;

