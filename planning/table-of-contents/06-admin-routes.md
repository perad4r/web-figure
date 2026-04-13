# Chapter 6 — Admin Routes

## Route Group: `/admin`

All admin routes require `isAuthenticated` + `isAdmin` middleware.
Admin pages rendered via EJS (server-side), matching datn-kien admin layout.

---

### Dashboard

| Express Route | Controller | Laravel Equivalent |
|---------------|------------|--------------------|
| `GET /admin/dashboard` | `dashboardController.index` | `AdminDashboardController@index` |

Stats: total orders, revenue, recent orders, product count, user count.

---

### Products (Hàng)

| Express Route | Controller | Laravel |
|---------------|------------|---------|
| `GET /admin/hangs` | `productAdmin.index` | `HangController@index` |
| `GET /admin/hangs/create` | `productAdmin.create` | `HangController@create` |
| `POST /admin/hangs` | `productAdmin.store` | `HangController@store` |
| `GET /admin/hangs/:id/edit` | `productAdmin.edit` | `HangController@edit` |
| `PUT /admin/hangs/:id` | `productAdmin.update` | `HangController@update` |
| `DELETE /admin/hangs/:id` | `productAdmin.destroy` | `HangController@destroy` |
| `POST /admin/hangs/:id/restore` | `productAdmin.restore` | `HangController@restore` |

Product CRUD with image upload (multer), category dropdown, variant management.

---

### Categories (Thể Loại)

| Express Route | Controller |
|---------------|------------|
| `GET /admin/theloais` | `categoryAdmin.index` |
| `GET /admin/theloais/create` | `categoryAdmin.create` |
| `POST /admin/theloais` | `categoryAdmin.store` |
| `GET /admin/theloais/:id/edit` | `categoryAdmin.edit` |
| `PUT /admin/theloais/:id` | `categoryAdmin.update` |
| `DELETE /admin/theloais/:id` | `categoryAdmin.destroy` |

---

### Colors (Màu)

| Express Route | Controller |
|---------------|------------|
| `GET /admin/maus` | `colorAdmin.index` |
| `GET /admin/maus/create` | `colorAdmin.create` |
| `POST /admin/maus` | `colorAdmin.store` |
| `GET /admin/maus/:id/edit` | `colorAdmin.edit` |
| `PUT /admin/maus/:id` | `colorAdmin.update` |
| `DELETE /admin/maus/:id` | `colorAdmin.destroy` |
| `POST /admin/maus/:id/restore` | `colorAdmin.restore` |

---

### Sizes (Kích Cỡ)

Same CRUD pattern as Colors: index, create, store, edit, update, destroy, restore.

---

### Orders (Đơn Hàng)

| Express Route | Controller |
|---------------|------------|
| `GET /admin/donhang` | `orderAdmin.index` |
| `GET /admin/donhang/create` | `orderAdmin.create` |
| `POST /admin/donhang` | `orderAdmin.store` |
| `GET /admin/donhang/:id/edit` | `orderAdmin.edit` |
| `PUT /admin/donhang/:id` | `orderAdmin.update` |
| `DELETE /admin/donhang/:id` | `orderAdmin.destroy` |
| `GET /admin/donhang/trang-thai/:status` | `orderAdmin.filterByStatus` |
| `GET /admin/donhang/:id/da-thanh-toan` | `orderAdmin.markAsPaid` |
| `PATCH /admin/donhang/:id/payment-status` | `orderAdmin.updatePaymentStatus` |
| `GET /admin/donhang/tim-kiem` | `orderAdmin.search` |

---

### Users

| Express Route | Controller |
|---------------|------------|
| `GET /admin/users` | `userAdmin.index` |
| `GET /admin/users/create` | `userAdmin.create` |
| `POST /admin/users` | `userAdmin.store` |
| `GET /admin/users/:id/edit` | `userAdmin.edit` |
| `PUT /admin/users/:id` | `userAdmin.update` |
| `PATCH /admin/users/:id/toggle-status` | `userAdmin.toggleStatus` |
| `DELETE /admin/users/:id` | `userAdmin.destroy` |

---

### Customers, Reviews, Variants

Same CRUD pattern. Full resource routes with eager-loaded relations.

---

## Admin Router Setup (`routes/admin/index.js`)

```js
const router = require('express').Router();
const { isAuthenticated, isAdmin } = require('../../middleware');

router.use(isAuthenticated, isAdmin);

router.use('/dashboard', require('./dashboard'));
router.use('/hangs', require('./products'));
router.use('/theloais', require('./categories'));
router.use('/maus', require('./colors'));
router.use('/kichcos', require('./sizes'));
router.use('/donhang', require('./orders'));
router.use('/users', require('./users'));
router.use('/khachhangs', require('./customers'));
router.use('/danhgia', require('./reviews'));
router.use('/bienthehangs', require('./variants'));

module.exports = router;
```
