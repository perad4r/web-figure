const express = require('express');

const colorsController = require('../../controllers/admin/colorsController');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/colors', isAuthenticated, adminOnly, colorsController.index);
router.get('/colors/new', isAuthenticated, adminOnly, colorsController.newForm);
router.post('/colors', isAuthenticated, adminOnly, colorsController.create);
router.get('/colors/:id/edit', isAuthenticated, adminOnly, colorsController.editForm);
router.put('/colors/:id', isAuthenticated, adminOnly, colorsController.update);
router.delete('/colors/:id', isAuthenticated, adminOnly, colorsController.destroy);
router.patch('/colors/:id/restore', isAuthenticated, adminOnly, colorsController.restore);

module.exports = router;
