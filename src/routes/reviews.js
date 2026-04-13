const express = require('express');

const reviewController = require('../controllers/reviewController');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.post('/danhgia/client', isAuthenticated, reviewController.submitReview);

module.exports = router;

