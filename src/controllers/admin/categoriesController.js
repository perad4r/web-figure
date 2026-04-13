const TheLoai = require('../../models/TheLoai');
const { getKnex } = require('../../config/database');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  const q = String(req.query.q || '').trim();

  const query = showDeleted ? TheLoai.queryWithDeleted() : TheLoai.query();
  if (showDeleted) query.whereNotNull('deleted_at');

  query.orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  if (q) query.where('ten', 'like', `%${q}%`);

  const rowsPlus = await query;
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/categories/index', { title: 'Categories', rows, showDeleted, q, page, pageSize, hasNext });
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

  req.flash('success', 'Category created');
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
  req.flash('success', 'Category updated');
  return res.redirect('/admin/categories');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('the_loais').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Category deleted');
  return res.redirect('/admin/categories');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('the_loais').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Category restored');
  return res.redirect('/admin/categories?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
