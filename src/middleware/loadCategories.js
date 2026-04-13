const TheLoai = require('../models/TheLoai');

async function loadCategories(_req, res, next) {
  try {
    res.locals.categories = await TheLoai.query()
      .where('trang_thai', true)
      .orderBy('id', 'desc');
  } catch (_e) {
    res.locals.categories = [];
  }

  next();
}

module.exports = loadCategories;

