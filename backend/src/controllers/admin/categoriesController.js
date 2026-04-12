const TheLoai = require('../../models/TheLoai');

async function index(req, res) {
  const rows = await TheLoai.query().orderBy('id', 'desc');
  return res.render('admin/categories/index', { title: 'Categories', rows });
}

async function newForm(req, res) {
  return res.render('admin/categories/new', { title: 'New Category', error: null });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  const mo_ta = req.body.mo_ta ? String(req.body.mo_ta).trim() : null;
  const trang_thai = req.body.trang_thai === '1' || req.body.trang_thai === 'on';

  if (!ten) {
    return res.status(400).render('admin/categories/new', {
      title: 'New Category',
      error: 'Missing name',
    });
  }

  await TheLoai.query().insert({
    ten,
    mo_ta,
    trang_thai,
  });

  return res.redirect('/admin/categories');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await TheLoai.query().findById(id);
  if (!row) return res.status(404).render('errors/403');

  return res.render('admin/categories/edit', { title: 'Edit Category', row, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await TheLoai.query().findById(id);
  if (!row) return res.status(404).render('errors/403');

  const ten = String(req.body.ten || '').trim();
  const mo_ta = req.body.mo_ta ? String(req.body.mo_ta).trim() : null;
  const trang_thai = req.body.trang_thai === '1' || req.body.trang_thai === 'on';

  if (!ten) {
    return res.status(400).render('admin/categories/edit', {
      title: 'Edit Category',
      row,
      error: 'Missing name',
    });
  }

  await row.$query().patch({ ten, mo_ta, trang_thai });
  return res.redirect('/admin/categories');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  await TheLoai.query().deleteById(id);
  return res.redirect('/admin/categories');
}

module.exports = { index, newForm, create, editForm, update, destroy };

