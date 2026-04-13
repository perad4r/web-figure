const express = require('express');

const usersController = require('../../controllers/admin/usersController');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/users', isAuthenticated, adminOnly, usersController.index);
router.get('/users/new', isAuthenticated, adminOnly, usersController.newForm);
router.post('/users', isAuthenticated, adminOnly, usersController.create);
router.get('/users/:id/edit', isAuthenticated, adminOnly, usersController.editForm);
router.put('/users/:id', isAuthenticated, adminOnly, usersController.update);
router.delete('/users/:id', isAuthenticated, adminOnly, usersController.destroy);
router.patch('/users/:id/restore', isAuthenticated, adminOnly, usersController.restore);
router.patch('/users/:id/toggle', isAuthenticated, adminOnly, usersController.toggleStatus);

module.exports = router;
