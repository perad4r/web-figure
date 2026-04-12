const express = require('express');

const { dashboard } = require('../../controllers/admin/dashboardController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/dashboard', isAuthenticated, isAdmin, dashboard);

module.exports = router;

