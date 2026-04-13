const express = require('express');

const clientController = require('../controllers/clientController');

const router = express.Router();

router.get('/', clientController.home);
router.get('/san-pham', clientController.productListing);
router.get('/san-pham/:id', clientController.productDetail);
router.get('/san-pham/:id/variants', clientController.productVariantsJson);

module.exports = router;

