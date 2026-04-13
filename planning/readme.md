# PMFigure — Laravel → Node.js Conversion Plan

> **Source**: `G:\Code\datn-kien` (Laravel/Blade e-commerce — clothes shop)
> **Target**: `G:\Code\Github\web-figure` (Node.js backend + Bootstrap 5 / jQuery frontend)
> **UI Reference**: https://pmfigure.vn (pink/red figure store theme)

---

## Architecture Overview

```
web-figure/
├── frontend/              # Static HTML/CSS/JS (Bootstrap 5, jQuery) — pmfigure UI
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   ├── index.html         # Home
│   ├── category.html      # Category listing
│   ├── product.html       # Product detail
│   ├── cart.html           # Shopping cart
│   └── orders.html        # Order tracking
│
├── backend/               # Node.js (Express + Knex + EJS)
│   ├── src/
│   │   ├── config/        # DB, env, app config
│   │   ├── migrations/    # Knex migrations
│   │   ├── seeds/         # Knex seeders
│   │   ├── models/        # Objection.js models (or Knex raw)
│   │   ├── routes/        # Express route files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, admin guard
│   │   ├── services/      # Business logic (PayOS, etc.)
│   │   ├── views/         # EJS templates (admin side)
│   │   └── app.js         # Express entry point
│   ├── public/            # Static assets served by Express
│   ├── package.json
│   └── knexfile.js
│
└── planning/              # This folder — detailed conversion plan
    ├── readme.md           # ← You are here
    ├── checklist.md        # Master checklist
    └── table-of-contents/  # Individual chapter files
```

---

## Table of Contents

Each file below is a self-contained chapter. Read in order.

| # | File | Description |
|---|------|-------------|
| 1 | [01-tech-stack.md](table-of-contents/01-tech-stack.md) | Tech stack selection: Express, Knex, EJS, Objection.js. Why each was chosen. |
| 2 | [02-database-schema.md](table-of-contents/02-database-schema.md) | Full DB schema mapping from Laravel migrations → Knex migrations. All 13 tables. |
| 3 | [03-models-and-relations.md](table-of-contents/03-models-and-relations.md) | Objection.js model definitions mirroring Laravel Eloquent relationships. |
| 4 | [04-auth-and-middleware.md](table-of-contents/04-auth-and-middleware.md) | Session-based auth, bcrypt, admin guard middleware. Login/Register/Logout. |
| 5 | [05-client-routes.md](table-of-contents/05-client-routes.md) | Public-facing routes: Home, Products, Product Detail, Cart, Checkout, Orders. |
| 6 | [06-admin-routes.md](table-of-contents/06-admin-routes.md) | Admin panel routes: Dashboard, CRUD for Products/Categories/Colors/Sizes/Orders/Users. |
| 7 | [07-frontend-ui.md](table-of-contents/07-frontend-ui.md) | Frontend HTML/CSS/JS plan. pmfigure.vn theme adaptation. Bootstrap 5 + jQuery. |
| 8 | [08-admin-ui.md](table-of-contents/08-admin-ui.md) | Admin panel EJS templates. Sidebar nav, CRUD forms, dashboard charts. |
| 9 | [09-payment-integration.md](table-of-contents/09-payment-integration.md) | PayOS integration: checkout flow, webhook handling, return/cancel URLs. |
| 10 | [10-file-uploads.md](table-of-contents/10-file-uploads.md) | Multer-based image upload for products/variants. Storage strategy. |
| 11 | [11-deployment.md](table-of-contents/11-deployment.md) | Docker, env config, production build, PM2 process management. |
| 12 | [12-entity-mapping.md](table-of-contents/12-entity-mapping.md) | Vietnamese → English field name mapping table for all entities. |

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | **Express.js** | Most mature, best ecosystem, middleware-rich |
| Query builder | **Knex.js** | Laravel-like migrations, seeds, query builder |
| ORM (optional) | **Objection.js** | Built on Knex, JSON schema, eager loading |
| Template engine | **EJS** | Admin pages only, closest to Blade syntax |
| Client frontend | **Bootstrap 5 + jQuery** | Match datn-kien stack, reuse pmfigure clone |
| Database | **MySQL** | Same as datn-kien source project |
| Auth | **express-session + bcryptjs** | Simple session auth, no JWT needed for SSR |
| File upload | **Multer** | Standard Express file upload middleware |
| Payment | **PayOS SDK (Node)** | Direct port from Laravel PayOS integration |

---

## Source Project Summary (datn-kien)

### Models (13 total)
`User` · `TheLoai` (Category) · `Hang` (Product) · `BienTheHang` (Variant) ·
`Mau` (Color) · `KichCo` (Size) · `GioHang` (Cart) · `DonHang` (Order) ·
`ChiTietDonHang` (OrderDetail) · `KhachHang` (Customer) · `DanhGia` (Review) ·
`PaymentStatusHistory` · `UserAuditLog`

### Route Groups
- **Public**: Home, Product browse, Product detail, Variants API
- **Guest-only**: Login, Register
- **Auth-required**: Logout, Cart, Checkout, Order history, Profile, Reviews
- **Admin**: Dashboard, CRUD (Products, Categories, Colors, Sizes, Orders, Users, Customers, Reviews, Variants)
- **Payment**: PayOS checkout, webhook, return, cancel

---

## Next Actions (Implementation Order)

1. Follow `planning/checklist.md` Phase 1 to scaffold `backend/` (Express + Knex). And check [x] a task in the checklist after it is done.
2. Use Chapter 2 to generate Knex migrations + seeds.
3. Use Chapter 3 to implement Objection models and relations.
4. Use Chapter 4 to implement session auth + middleware.
5. Port routes/controllers in Chapter 5–10.
6. Package + deploy using Chapter 11.

## Security Note

- Never commit real secrets. Keep local secrets in `.env` (gitignored) and commit only `.env.example`.

## SSR Choice (Client)

- Client pages run SSR via Express + EJS now (`/san-pham`, `/san-pham/:id`), with JSON APIs for dynamic pieces (e.g. `/san-pham/:id/variants`).
