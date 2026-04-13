const express = require('express');

const profileController = require('../controllers/profileController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.get('/ho-so', isAuthenticated, profileController.editProfile);
router.put('/ho-so', isAuthenticated, profileController.updateProfile);

module.exports = router;

