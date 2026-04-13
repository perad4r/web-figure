const express = require('express');

const variantsController = require('../../controllers/admin/variantsController');
const { uploaderFor } = require('../../config/multer');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/variants', isAuthenticated, isAdmin, variantsController.index);
router.get('/variants/new', isAuthenticated, isAdmin, variantsController.newForm);
router.post('/variants', isAuthenticated, isAdmin, uploaderFor('variants').single('image'), variantsController.create);
router.get('/variants/:id/edit', isAuthenticated, isAdmin, variantsController.editForm);
router.put('/variants/:id', isAuthenticated, isAdmin, uploaderFor('variants').single('image'), variantsController.update);
router.delete('/variants/:id', isAuthenticated, isAdmin, variantsController.destroy);
router.patch('/variants/:id/restore', isAuthenticated, isAdmin, variantsController.restore);

module.exports = router;
