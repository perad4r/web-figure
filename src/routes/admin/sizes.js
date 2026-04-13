const express = require('express');

const sizesController = require('../../controllers/admin/sizesController');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/sizes', isAuthenticated, adminOnly, sizesController.index);
router.get('/sizes/new', isAuthenticated, adminOnly, sizesController.newForm);
router.post('/sizes', isAuthenticated, adminOnly, sizesController.create);
router.get('/sizes/:id/edit', isAuthenticated, adminOnly, sizesController.editForm);
router.put('/sizes/:id', isAuthenticated, adminOnly, sizesController.update);
router.delete('/sizes/:id', isAuthenticated, adminOnly, sizesController.destroy);
router.patch('/sizes/:id/restore', isAuthenticated, adminOnly, sizesController.restore);

module.exports = router;
