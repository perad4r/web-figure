const express = require('express');

const colorsController = require('../../controllers/admin/colorsController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/colors', isAuthenticated, isAdmin, colorsController.index);
router.get('/colors/new', isAuthenticated, isAdmin, colorsController.newForm);
router.post('/colors', isAuthenticated, isAdmin, colorsController.create);
router.get('/colors/:id/edit', isAuthenticated, isAdmin, colorsController.editForm);
router.put('/colors/:id', isAuthenticated, isAdmin, colorsController.update);
router.delete('/colors/:id', isAuthenticated, isAdmin, colorsController.destroy);
router.patch('/colors/:id/restore', isAuthenticated, isAdmin, colorsController.restore);

module.exports = router;

