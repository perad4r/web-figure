const express = require('express');

const reviewsController = require('../../controllers/admin/reviewsController');
const isAuthenticated = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const router = express.Router();

router.get('/reviews', isAuthenticated, isAdmin, reviewsController.index);
router.get('/reviews/:id/edit', isAuthenticated, isAdmin, reviewsController.editForm);
router.put('/reviews/:id', isAuthenticated, isAdmin, reviewsController.update);
router.delete('/reviews/:id', isAuthenticated, isAdmin, reviewsController.destroy);
router.patch('/reviews/:id/restore', isAuthenticated, isAdmin, reviewsController.restore);

module.exports = router;
