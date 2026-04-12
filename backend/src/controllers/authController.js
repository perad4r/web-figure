const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function showLogin(req, res) {
  res.render('auth/login', { error: null });
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).render('auth/login', { error: 'Missing email/password' });
  }

  const user = await User.query().where({ email }).first();
  if (!user || !user.status) {
    return res.status(401).render('auth/login', { error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).render('auth/login', { error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  return res.redirect('/');
}

async function showRegister(req, res) {
  res.render('auth/register', { error: null });
}

async function register(req, res) {
  const { ten, email, password, password_confirmation, phone, address } = req.body || {};

  if (!ten || !email || !password) {
    return res.status(400).render('auth/register', { error: 'Missing fields' });
  }

  if (password !== password_confirmation) {
    return res.status(400).render('auth/register', { error: 'Password confirmation mismatch' });
  }

  const exists = await User.query().where({ email }).first();
  if (exists) {
    return res.status(409).render('auth/register', { error: 'Email already used' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.query().insert({
    ten,
    email,
    password: hashed,
    phone: phone || null,
    address: address || null,
    role: User.ROLE_CUSTOMER,
    status: true,
  });

  req.session.userId = user.id;
  return res.redirect('/');
}

async function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = { showLogin, login, showRegister, register, logout };

