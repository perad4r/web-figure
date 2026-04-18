const express = require('express');

const homeContentController = require('../../controllers/admin/homeContentController');
const isAuthenticated = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const { uploaderFor } = require('../../config/multer');

const router = express.Router();

router.get('/home-content', isAuthenticated, adminOnly, homeContentController.index);
router.get('/home-content/new', isAuthenticated, adminOnly, homeContentController.newForm);
router.post(
  '/home-content',
  isAuthenticated,
  adminOnly,
  uploaderFor('home').single('image'),
  homeContentController.create
);
router.get('/home-content/:id/edit', isAuthenticated, adminOnly, homeContentController.editForm);
router.put(
  '/home-content/:id',
  isAuthenticated,
  adminOnly,
  uploaderFor('home').single('image'),
  homeContentController.update
);
router.delete('/home-content/:id', isAuthenticated, adminOnly, homeContentController.destroy);
router.patch('/home-content/:id/toggle', isAuthenticated, adminOnly, homeContentController.toggle);
router.post('/home-content/reorder', isAuthenticated, adminOnly, homeContentController.reorder);

module.exports = router;
