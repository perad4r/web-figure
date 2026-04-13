const express = require('express');

const sizesController = require('../../controllers/admin/sizesController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/sizes', isAuthenticated, isAdmin, sizesController.index);
router.get('/sizes/new', isAuthenticated, isAdmin, sizesController.newForm);
router.post('/sizes', isAuthenticated, isAdmin, sizesController.create);
router.get('/sizes/:id/edit', isAuthenticated, isAdmin, sizesController.editForm);
router.put('/sizes/:id', isAuthenticated, isAdmin, sizesController.update);
router.delete('/sizes/:id', isAuthenticated, isAdmin, sizesController.destroy);
router.patch('/sizes/:id/restore', isAuthenticated, isAdmin, sizesController.restore);

module.exports = router;

