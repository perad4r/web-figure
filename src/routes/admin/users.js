const express = require('express');

const usersController = require('../../controllers/admin/usersController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/users', isAuthenticated, isAdmin, usersController.index);
router.get('/users/new', isAuthenticated, isAdmin, usersController.newForm);
router.post('/users', isAuthenticated, isAdmin, usersController.create);
router.get('/users/:id/edit', isAuthenticated, isAdmin, usersController.editForm);
router.put('/users/:id', isAuthenticated, isAdmin, usersController.update);
router.delete('/users/:id', isAuthenticated, isAdmin, usersController.destroy);
router.patch('/users/:id/restore', isAuthenticated, isAdmin, usersController.restore);
router.patch('/users/:id/toggle', isAuthenticated, isAdmin, usersController.toggleStatus);

module.exports = router;
