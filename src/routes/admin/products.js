const express = require('express');

const productsController = require('../../controllers/admin/productsController');
const { uploaderFor } = require('../../config/multer');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/products', isAuthenticated, isAdmin, productsController.index);
router.get('/products/new', isAuthenticated, isAdmin, productsController.newForm);
router.post('/products', isAuthenticated, isAdmin, uploaderFor('products').single('image'), productsController.create);
router.get('/products/:id/edit', isAuthenticated, isAdmin, productsController.editForm);
router.put('/products/:id', isAuthenticated, isAdmin, uploaderFor('products').single('image'), productsController.update);
router.delete('/products/:id', isAuthenticated, isAdmin, productsController.destroy);
router.patch('/products/:id/restore', isAuthenticated, isAdmin, productsController.restore);

module.exports = router;

