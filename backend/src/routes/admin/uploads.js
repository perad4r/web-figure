const express = require('express');

const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');
const { uploaderFor } = require('../../config/multer');
const uploadsController = require('../../controllers/admin/uploadsController');

const router = express.Router();

router.post(
  '/uploads/products',
  isAuthenticated,
  isAdmin,
  uploaderFor('products').single('image'),
  uploadsController.uploadProductImage
);

router.post(
  '/uploads/variants',
  isAuthenticated,
  isAdmin,
  uploaderFor('variants').single('image'),
  uploadsController.uploadVariantImage
);

module.exports = router;

