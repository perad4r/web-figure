# Chapter 8 — Admin UI (EJS Templates)

## Template Engine: EJS

EJS = closest to Laravel Blade. Comparison:

| Blade | EJS |
|-------|-----|
| `@extends('layout')` | `<%- include('partials/header') %>` |
| `@yield('content')` | `<%- body %>` (via express-ejs-layouts) |
| `@section('content')` | Main content in page file |
| `{{ $variable }}` | `<%= variable %>` (escaped) |
| `{!! $html !!}` | `<%- html %>` (unescaped) |
| `@if / @foreach` | `<% if() {} %>` / `<% for() {} %>` |
| `@csrf` | Hidden input with CSRF token (csurf) |

---

## Admin Layout (`views/layouts/admin.ejs`)

Port from `layout.blade.php`. Structure:

```
┌──────────────────────────────────────────┐
│ Navbar (dark bg, "Admin Panel", user menu) │
├────────┬─────────────────────────────────┤
│Sidebar │ Main Content                    │
│(nav)   │ <%- body %>                     │
│        │                                 │
│📊 Dash │                                 │
│📦 Prods│                                 │
│🗂️ Cats │                                 │
│🎨 Color│                                 │
│📏 Sizes│                                 │
│🧾 Order│                                 │
│👤 Users│                                 │
└────────┴─────────────────────────────────┘
```

Sidebar items conditional on `user.role` (admin vs staff).
Mobile: offcanvas sidebar (Bootstrap).

---

## Template File List

### Layouts
- `views/layouts/admin.ejs` — Admin wrapper (~150 lines)

### Partials
- `views/partials/flash.ejs` — Flash messages
- `views/partials/pagination.ejs` — Pagination controls

### Dashboard
- `views/admin/dashboard.ejs` — Stats cards + recent orders table

### Products (Hàng)
- `views/admin/products/index.ejs` — Product list table
- `views/admin/products/create.ejs` — Create form
- `views/admin/products/edit.ejs` — Edit form (reusable with create)

### Categories
- `views/admin/categories/index.ejs` — List
- `views/admin/categories/form.ejs` — Create/edit combined

### Colors
- `views/admin/colors/index.ejs` — List with hex preview
- `views/admin/colors/form.ejs` — Create/edit

### Sizes
- `views/admin/sizes/index.ejs` — List
- `views/admin/sizes/form.ejs` — Create/edit

### Orders
- `views/admin/orders/index.ejs` — Order list with status filters
- `views/admin/orders/edit.ejs` — Order detail + status management
- `views/admin/orders/create.ejs` — Manual order creation

### Users
- `views/admin/users/index.ejs` — User list
- `views/admin/users/form.ejs` — Create/edit

### Auth
- `views/auth/login.ejs` — Login page
- `views/auth/register.ejs` — Register page

---

## Admin CSS

Keep datn-kien admin styles (black/dark theme). No pmfigure pink for admin.
Admin layout uses Bootstrap 5 default vars:

```css
:root {
  --bs-primary: #000000;
  --bs-body-bg: #ffffff;
}
```

---

## CSRF Protection

Use `csurf` middleware for admin forms:

```js
const csrf = require('csurf');
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

In EJS: `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`

---

## Method Override

Express doesn't natively handle `PUT` / `DELETE` from HTML forms.
Use `method-override` middleware:

```js
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
```

Form: `<form method="POST" action="/admin/hangs/5?_method=PUT">`
