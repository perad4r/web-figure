const DanhGia = require('../../models/DanhGia');
const { getKnex } = require('../../config/database');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize || 50)));
  const offset = (page - 1) * pageSize;

  const query = showDeleted ? DanhGia.queryWithDeleted() : DanhGia.query();
  if (showDeleted) query.whereNotNull('deleted_at');

  const rowsPlus = await query
    .withGraphFetched('[user, product, order]')
    .orderBy('id', 'desc')
    .offset(offset)
    .limit(pageSize + 1);

  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/reviews/index', { title: 'Reviews', rows, showDeleted, page, pageSize, hasNext });
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const row = await DanhGia.queryWithDeleted().findById(id);
  if (!row) return res.redirect('/admin/reviews');
  const knex = getKnex();
  await knex('danh_gias').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Review deleted');
  return res.redirect('/admin/reviews');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const row = await DanhGia.queryWithDeleted().findById(id);
  if (!row) return res.redirect('/admin/reviews?deleted=1');
  const knex = getKnex();
  await knex('danh_gias').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Review restored');
  return res.redirect('/admin/reviews?deleted=1');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await DanhGia.queryWithDeleted().findById(id).withGraphFetched('[user, product, order]');
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/reviews/edit', { title: `Edit Review #${row.id}`, row, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await DanhGia.queryWithDeleted().findById(id).withGraphFetched('[user, product, order]');
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const danh_gia = String(req.body.danh_gia || '').trim();
  const rating = req.body.rating !== undefined && req.body.rating !== '' ? Number(req.body.rating) : null;

  if (!danh_gia) {
    return res.status(400).render('admin/reviews/edit', { title: `Edit Review #${row.id}`, row, error: 'Missing content' });
  }

  const patch = { danh_gia };
  if (rating === null || Number.isNaN(rating)) patch.rating = null;
  else patch.rating = rating;

  await row.$query().patch(patch);
  req.flash('success', 'Review updated');
  return res.redirect('/admin/reviews');
}

module.exports = { index, editForm, update, destroy, restore };
