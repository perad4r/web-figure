const express = require('express');

const categoriesController = require('../../controllers/admin/categoriesController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/categories', isAuthenticated, isAdmin, categoriesController.index);
router.get('/categories/new', isAuthenticated, isAdmin, categoriesController.newForm);
router.post('/categories', isAuthenticated, isAdmin, categoriesController.create);
router.get('/categories/:id/edit', isAuthenticated, isAdmin, categoriesController.editForm);
router.put('/categories/:id', isAuthenticated, isAdmin, categoriesController.update);
router.delete('/categories/:id', isAuthenticated, isAdmin, categoriesController.destroy);

module.exports = router;

