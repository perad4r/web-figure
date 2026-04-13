const express = require('express');

const variantsController = require('../../controllers/admin/variantsController');
const { uploaderFor } = require('../../config/multer');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

const router = express.Router();

router.get('/variants', isAuthenticated, adminOnly, variantsController.index);
router.get('/variants/new', isAuthenticated, adminOnly, variantsController.newForm);
router.post('/variants', isAuthenticated, adminOnly, uploaderFor('variants').single('image'), variantsController.create);
router.get('/variants/:id/edit', isAuthenticated, adminOnly, variantsController.editForm);
router.put('/variants/:id', isAuthenticated, adminOnly, uploaderFor('variants').single('image'), variantsController.update);
router.delete('/variants/:id', isAuthenticated, adminOnly, variantsController.destroy);
router.patch('/variants/:id/restore', isAuthenticated, adminOnly, variantsController.restore);

module.exports = router;
