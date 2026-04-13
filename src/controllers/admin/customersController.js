const KhachHang = require('../../models/KhachHang');
const User = require('../../models/User');
const { getKnex } = require('../../config/database');

async function withSelectedUser(users, id) {
  if (!id) return users;
  const exists = users.some((u) => Number(u.id) === Number(id));
  if (exists) return users;
  const row = await User.queryWithDeleted().findById(Number(id));
  if (!row) return users;
  return [{ ...row, email: `[DELETED] ${row.email}` }, ...users];
}

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize || 50)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = showDeleted ? KhachHang.queryWithDeleted() : KhachHang.query();
  if (showDeleted) query.whereNotNull('deleted_at');

  query.withGraphFetched('user').orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  if (q) {
    query.where((qb) => {
      qb.where('ten', 'like', `%${q}%`).orWhere('sdt', 'like', `%${q}%`).orWhere('email', 'like', `%${q}%`);
    });
  }

  const rowsPlus = await query;
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/customers/index', { title: 'Customers', rows, showDeleted, q, page, pageSize, hasNext });
}

async function newForm(req, res) {
  const users = await User.query().orderBy('id', 'desc');
  return res.render('admin/customers/new', { title: 'New Customer', users, error: null, values: {} });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  const sdt = String(req.body.sdt || '').trim();
  const dia_chi = String(req.body.dia_chi || '').trim();
  const email = req.body.email ? String(req.body.email).trim() : null;
  const ma_user = req.body.ma_user ? Number(req.body.ma_user) : null;

  const users = await User.query().orderBy('id', 'desc');
  const values = { ten, sdt, dia_chi, email, ma_user: ma_user || '' };

  if (!ten || !sdt || !dia_chi) {
    return res.status(400).render('admin/customers/new', { title: 'New Customer', users, error: 'Missing required fields', values });
  }

  await KhachHang.queryWithDeleted().insert({
    ten,
    sdt,
    email: email || null,
    dia_chi,
    ma_user: ma_user || null,
    deleted_at: null,
  });

  req.flash('success', 'Customer created');
  return res.redirect('/admin/customers');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await KhachHang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  let users = await User.query().orderBy('id', 'desc');
  users = await withSelectedUser(users, row.ma_user);
  return res.render('admin/customers/edit', { title: 'Edit Customer', row, users, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await KhachHang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const ten = String(req.body.ten || '').trim();
  const sdt = String(req.body.sdt || '').trim();
  const dia_chi = String(req.body.dia_chi || '').trim();
  const email = req.body.email ? String(req.body.email).trim() : null;
  const ma_user = req.body.ma_user ? Number(req.body.ma_user) : null;

  let users = await User.query().orderBy('id', 'desc');
  users = await withSelectedUser(users, row.ma_user);

  if (!ten || !sdt || !dia_chi) {
    return res.status(400).render('admin/customers/edit', { title: 'Edit Customer', row, users, error: 'Missing required fields' });
  }

  await row.$query().patch({
    ten,
    sdt,
    dia_chi,
    email: email || null,
    ma_user: ma_user || null,
  });

  req.flash('success', 'Customer updated');
  return res.redirect('/admin/customers');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('khach_hangs').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Customer deleted');
  return res.redirect('/admin/customers');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('khach_hangs').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Customer restored');
  return res.redirect('/admin/customers?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
