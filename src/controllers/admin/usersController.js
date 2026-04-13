const User = require('../../models/User');
const { getKnex } = require('../../config/database');
const bcrypt = require('bcryptjs');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize || 50)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = showDeleted ? User.queryWithDeleted() : User.query();
  if (showDeleted) query.whereNotNull('deleted_at');

  query.orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  if (q) query.where('email', 'like', `%${q}%`);

  const rowsPlus = await query;
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/users/index', { title: 'Users', rows, showDeleted, q, page, pageSize, hasNext });
}

async function toggleStatus(req, res) {
  const id = Number(req.params.id);
  const user = await User.queryWithDeleted().findById(id);
  if (!user) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  await user.$query().patch({ status: !user.status });
  req.flash('success', 'User status toggled');
  return res.redirect('/admin/users');
}

async function newForm(req, res) {
  return res.render('admin/users/new', { title: 'New User', error: null, values: {} });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  const email = String(req.body.email || '').trim();
  const passwordRaw = String(req.body.password || '');
  const phone = req.body.phone ? String(req.body.phone).trim() : null;
  const address = req.body.address ? String(req.body.address).trim() : null;
  const role = Number(req.body.role);
  const status = req.body.status === '1' || req.body.status === 'on';

  const values = { ten, email, phone, address, role, status };

  if (!ten || !email || !passwordRaw || Number.isNaN(role)) {
    return res.status(400).render('admin/users/new', { title: 'New User', error: 'Missing required fields', values });
  }

  const existing = await User.queryWithDeleted().where({ email }).first();
  if (existing) {
    return res.status(400).render('admin/users/new', { title: 'New User', error: 'Email already exists', values });
  }

  const password = await bcrypt.hash(passwordRaw, 10);
  await User.queryWithDeleted().insert({
    ten,
    email,
    password,
    phone: phone || null,
    address: address || null,
    role,
    status,
    deleted_at: null,
  });

  req.flash('success', 'User created');
  return res.redirect('/admin/users');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await User.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/users/edit', { title: 'Edit User', row, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await User.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const ten = String(req.body.ten || '').trim();
  const email = String(req.body.email || '').trim();
  const passwordRaw = req.body.password ? String(req.body.password) : '';
  const phone = req.body.phone ? String(req.body.phone).trim() : null;
  const address = req.body.address ? String(req.body.address).trim() : null;
  const role = Number(req.body.role);
  const status = req.body.status === '1' || req.body.status === 'on';

  if (!ten || !email || Number.isNaN(role)) {
    return res.status(400).render('admin/users/edit', { title: 'Edit User', row, error: 'Missing required fields' });
  }

  const existing = await User.queryWithDeleted().where({ email }).whereNot('id', id).first();
  if (existing) {
    return res.status(400).render('admin/users/edit', { title: 'Edit User', row, error: 'Email already exists' });
  }

  const patch = { ten, email, phone: phone || null, address: address || null, role, status };
  if (passwordRaw) patch.password = await bcrypt.hash(passwordRaw, 10);

  await row.$query().patch(patch);
  req.flash('success', 'User updated');
  return res.redirect('/admin/users');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('users').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'User deleted');
  return res.redirect('/admin/users');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('users').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'User restored');
  return res.redirect('/admin/users?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore, toggleStatus };
