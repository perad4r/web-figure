const express = require('express');

const productsController = require('../../controllers/admin/productsController');
const { uploaderFor } = require('../../config/multer');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/products', isAuthenticated, adminOnly, productsController.index);
router.get('/products/new', isAuthenticated, adminOnly, productsController.newForm);
router.post('/products', isAuthenticated, adminOnly, uploaderFor('products').single('image'), productsController.create);
router.get('/products/:id/edit', isAuthenticated, adminOnly, productsController.editForm);
router.put('/products/:id', isAuthenticated, adminOnly, uploaderFor('products').single('image'), productsController.update);
router.delete('/products/:id', isAuthenticated, adminOnly, productsController.destroy);
router.patch('/products/:id/restore', isAuthenticated, adminOnly, productsController.restore);

module.exports = router;
