# Chapter 4 — Auth & Middleware

## Session-Based Authentication

datn-kien uses Laravel's built-in session auth. Node.js equivalent:

```
express-session        — Session management
connect-session-knex   — Store sessions in MySQL (like Laravel's database driver)
bcryptjs               — Password hashing (like Hash::make / Hash::check)
```

### Session Config (`src/config/session.js`)

```js
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

module.exports = (knex) => session({
  store: new KnexSessionStore({ knex, tablename: 'sessions' }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
});
```

---

## Auth Controller (`controllers/authController.js`)

### Routes (from `routes/auth.js`)

| Method | Path | Handler | Middleware | Laravel Equivalent |
|--------|------|---------|------------|--------------------|
| GET | `/dang-nhap` | showLogin | guest | `AuthController@showLoginForm` |
| POST | `/dang-nhap` | login | guest | `AuthController@login` |
| GET | `/dang-ky` | showRegister | guest | `AuthController@showRegisterForm` |
| POST | `/dang-ky` | register | guest | `AuthController@register` |
| POST | `/dang-xuat` | logout | auth | `AuthController@logout` |

### Login Flow

```
1. POST /dang-nhap { email, password }
2. Find user by email → bcrypt.compare(password, user.password)
3. On success: req.session.userId = user.id → redirect /
4. On fail: redirect back with error flash
```

### Register Flow

```
1. POST /dang-ky { ten, email, password, password_confirmation, phone, address }
2. Validate (email unique, password match)
3. bcrypt.hash(password, 10)
4. Insert user (role = 1 / customer)
5. Auto-login → redirect /
```

---

## Middleware

### `isAuthenticated` (`middleware/auth.js`)

```js
// Laravel: auth middleware
module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/dang-nhap');
};
```

### `isAdmin` (`middleware/admin.js`)

```js
// Laravel: EnsureUserIsAdmin middleware
module.exports = (req, res, next) => {
  if (req.user && (req.user.role === 0 || req.user.role === 2)) {
    return next();
  }
  return res.status(403).render('errors/403');
};
```

### `isGuest` (`middleware/guest.js`)

```js
// Laravel: guest middleware
module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  return next();
};
```

### `loadUser` (global middleware)

Loads user into `req.user` on every request if session exists:

```js
module.exports = async (req, res, next) => {
  if (req.session.userId) {
    req.user = await User.query().findById(req.session.userId);
    res.locals.user = req.user; // Available in all EJS templates
  }
  next();
};
```

---

## Cart Count (Global)

datn-kien provides `$cartCount` to all views via `AppServiceProvider`.
Node.js equivalent — global middleware:

```js
app.use(async (req, res, next) => {
  if (req.user) {
    const count = await GioHang.query().where('user_id', req.user.id).resultSize();
    res.locals.cartCount = count;
  } else {
    res.locals.cartCount = 0;
  }
  next();
});
```
