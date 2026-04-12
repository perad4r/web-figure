const express = require('express');

const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/auth');
const isGuest = require('../middleware/guest');

const router = express.Router();

router.get('/dang-nhap', isGuest, authController.showLogin);
router.post('/dang-nhap', isGuest, authController.login);
router.get('/dang-ky', isGuest, authController.showRegister);
router.post('/dang-ky', isGuest, authController.register);
router.post('/dang-xuat', isAuthenticated, authController.logout);

module.exports = router;

