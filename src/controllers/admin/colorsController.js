const Mau = require('../../models/Mau');
const { getKnex } = require('../../config/database');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = showDeleted ? Mau.queryWithDeleted() : Mau.query();

  if (showDeleted) query.whereNotNull('deleted_at');
  if (q) query.where('ten', 'like', `%${q}%`);

  const rowsPlus = await query.orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/colors/index', { title: 'Colors', rows, showDeleted, q, page, pageSize, hasNext });
}

async function newForm(req, res) {
  return res.render('admin/colors/new', { title: 'New Color', error: null });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  const hex_code = req.body.hex_code ? String(req.body.hex_code).trim() : null;
  if (!ten) {
    return res.status(400).render('admin/colors/new', { title: 'New Color', error: 'Missing name' });
  }

  await Mau.queryWithDeleted().insert({
    ten,
    hex_code: hex_code || null,
    deleted_at: null,
  });

  req.flash('success', 'Color created');
  return res.redirect('/admin/colors');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await Mau.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/colors/edit', { title: 'Edit Color', row, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await Mau.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const ten = String(req.body.ten || '').trim();
  const hex_code = req.body.hex_code ? String(req.body.hex_code).trim() : null;
  if (!ten) {
    return res.status(400).render('admin/colors/edit', { title: 'Edit Color', row, error: 'Missing name' });
  }

  await row.$query().patch({ ten, hex_code: hex_code || null });
  req.flash('success', 'Color updated');
  return res.redirect('/admin/colors');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('maus').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Color deleted');
  return res.redirect('/admin/colors');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('maus').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Color restored');
  return res.redirect('/admin/colors?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
