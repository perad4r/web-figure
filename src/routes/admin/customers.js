const express = require('express');

const customersController = require('../../controllers/admin/customersController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/customers', isAuthenticated, isAdmin, customersController.index);
router.get('/customers/new', isAuthenticated, isAdmin, customersController.newForm);
router.post('/customers', isAuthenticated, isAdmin, customersController.create);
router.get('/customers/:id/edit', isAuthenticated, isAdmin, customersController.editForm);
router.put('/customers/:id', isAuthenticated, isAdmin, customersController.update);
router.delete('/customers/:id', isAuthenticated, isAdmin, customersController.destroy);
router.patch('/customers/:id/restore', isAuthenticated, isAdmin, customersController.restore);

module.exports = router;
