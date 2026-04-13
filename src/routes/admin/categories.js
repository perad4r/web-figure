const express = require('express');

const categoriesController = require('../../controllers/admin/categoriesController');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/categories', isAuthenticated, adminOnly, categoriesController.index);
router.get('/categories/new', isAuthenticated, adminOnly, categoriesController.newForm);
router.post('/categories', isAuthenticated, adminOnly, categoriesController.create);
router.get('/categories/:id/edit', isAuthenticated, adminOnly, categoriesController.editForm);
router.put('/categories/:id', isAuthenticated, adminOnly, categoriesController.update);
router.delete('/categories/:id', isAuthenticated, adminOnly, categoriesController.destroy);
router.patch('/categories/:id/restore', isAuthenticated, adminOnly, categoriesController.restore);

module.exports = router;
