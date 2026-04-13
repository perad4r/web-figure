const express = require('express');

const healthRoutes = require('./health');
const authRoutes = require('./auth');
const clientRoutes = require('./client');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const profileRoutes = require('./profile');
const reviewRoutes = require('./reviews');
const adminDashboardRoutes = require('./admin/dashboard');
const adminCategoryRoutes = require('./admin/categories');
const adminUploadRoutes = require('./admin/uploads');
const adminColorRoutes = require('./admin/colors');
const adminSizeRoutes = require('./admin/sizes');
const adminProductRoutes = require('./admin/products');
const adminVariantRoutes = require('./admin/variants');
const adminUserRoutes = require('./admin/users');
const adminOrderRoutes = require('./admin/orders');
const adminCustomerRoutes = require('./admin/customers');
const adminReviewRoutes = require('./admin/reviews');
const paymentRoutes = require('./payment');

const router = express.Router();

router.use('/api', healthRoutes);
router.use(authRoutes);
router.use(clientRoutes);
router.use(cartRoutes);
router.use(orderRoutes);
router.use(profileRoutes);
router.use(reviewRoutes);
router.use('/admin', adminDashboardRoutes);
router.use('/admin', adminCategoryRoutes);
router.use('/admin', adminUploadRoutes);
router.use('/admin', adminColorRoutes);
router.use('/admin', adminSizeRoutes);
router.use('/admin', adminProductRoutes);
router.use('/admin', adminVariantRoutes);
router.use('/admin', adminUserRoutes);
router.use('/admin', adminOrderRoutes);
router.use('/admin', adminCustomerRoutes);
router.use('/admin', adminReviewRoutes);
router.use(paymentRoutes);

module.exports = router;
