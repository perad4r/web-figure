const KichCo = require('../../models/KichCo');
const { getKnex } = require('../../config/database');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = showDeleted ? KichCo.queryWithDeleted() : KichCo.query();

  if (showDeleted) query.whereNotNull('deleted_at');
  if (q) query.where('ten', 'like', `%${q}%`);

  const rowsPlus = await query.orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/sizes/index', { title: 'Sizes', rows, showDeleted, q, page, pageSize, hasNext });
}

async function newForm(req, res) {
  return res.render('admin/sizes/new', { title: 'New Size', error: null });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  if (!ten) {
    return res.status(400).render('admin/sizes/new', { title: 'New Size', error: 'Missing name' });
  }

  await KichCo.queryWithDeleted().insert({
    ten,
    deleted_at: null,
  });

  req.flash('success', 'Size created');
  return res.redirect('/admin/sizes');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await KichCo.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/sizes/edit', { title: 'Edit Size', row, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await KichCo.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const ten = String(req.body.ten || '').trim();
  if (!ten) {
    return res.status(400).render('admin/sizes/edit', { title: 'Edit Size', row, error: 'Missing name' });
  }

  await row.$query().patch({ ten });
  req.flash('success', 'Size updated');
  return res.redirect('/admin/sizes');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('kich_cos').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Size deleted');
  return res.redirect('/admin/sizes');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('kich_cos').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Size restored');
  return res.redirect('/admin/sizes?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
