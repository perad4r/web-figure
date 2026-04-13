# Chapter 1 — Tech Stack Selection

## Backend: Express.js

Express = most popular Node.js framework. Middleware ecosystem massive. 
datn-kien uses Laravel → Express closest equivalent.

```
express          — HTTP framework
knex             — Query builder + migrations (like Laravel's Schema::)  
objection        — ORM on top of Knex (like Eloquent)
mysql2           — MySQL driver
ejs              — Template engine (admin only, like Blade)
express-session  — Session management
connect-session-knex — Session store in DB
bcryptjs         — Password hashing (like Hash::make)
multer           — File upload (like request()->file())
dotenv           — Env vars (like Laravel .env)
cors             — CORS headers
helmet           — Security headers
morgan           — Request logging
```

## Runtime / Modules / Package Manager

- Node.js: **20.x LTS** (matches `node:20-alpine` in Docker plan)
- Module system: **CommonJS** (`require`/`module.exports`) for simplest Express + Knex examples
- Package manager: **npm** (default). If switching to pnpm later, keep lockfile consistent repo-wide.

## Frontend: Bootstrap 5 + jQuery

Same as datn-kien source. CSS: Bootstrap 5.3.3. JS: Vanilla + jQuery.
Admin pages rendered server-side via EJS.
Client pages = static HTML served from `frontend/`, themed after pmfigure.vn.

## Database: MySQL

Same as source. Knex supports MySQL natively.

## Why Knex over Sequelize / Prisma?

| Feature | Knex | Sequelize | Prisma |
|---------|------|-----------|--------|
| Migration system | ✅ Laravel-like up/down | ✅ Different syntax | ✅ Schema-based |
| Raw SQL friendly | ✅ | ⚠️ | ❌ |
| Query builder | ✅ Chainable | ✅ Methods | ❌ (Client API) |
| ORM layer | Objection.js addon | Built-in | Built-in |
| Learning curve | Low (Laravel devs) | Medium | Medium |
| Bundle size | Small | Large | Large |

**Winner**: Knex + Objection.js → closest to Laravel's Eloquent workflow.

## Project Init Commands

```bash
npm init -y
npm install express knex objection mysql2 ejs express-session connect-session-knex bcryptjs multer dotenv cors helmet morgan
npm install --save-dev nodemon
```

## Folder Structure

```
backend/
├── src/
│   ├── app.js              # Entry point, middleware setup
│   ├── config/
│   │   ├── database.js     # Knex instance
│   │   └── session.js      # Session config
│   ├── migrations/         # Knex migration files
│   ├── seeds/              # Knex seed files
│   ├── models/             # Objection.js model classes
│   ├── routes/
│   │   ├── auth.js         # Login/register/logout
│   │   ├── client.js       # Public product routes
│   │   ├── cart.js         # Cart routes
│   │   ├── orders.js       # Order history
│   │   ├── profile.js      # Profile management
│   │   ├── admin/          # Admin route group
│   │   │   ├── dashboard.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── colors.js
│   │   │   ├── sizes.js
│   │   │   ├── orders.js
│   │   │   ├── users.js
│   │   │   └── reviews.js
│   │   └── payment.js      # PayOS routes
│   ├── controllers/        # Handler functions
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── profileController.js
│   │   ├── reviewController.js
│   │   ├── admin/
│   │   │   ├── dashboardController.js
│   │   │   ├── productAdminController.js
│   │   │   ├── categoryController.js
│   │   │   ├── colorController.js
│   │   │   ├── sizeController.js
│   │   │   ├── orderAdminController.js
│   │   │   ├── userController.js
│   │   │   └── reviewAdminController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js         # isAuthenticated
│   │   └── admin.js        # isAdmin
│   ├── services/
│   │   └── payosService.js
│   └── views/              # EJS templates (admin)
│       ├── layouts/
│       │   └── admin.ejs
│       ├── auth/
│       ├── admin/
│       └── partials/
├── public/                 # Static files
│   └── uploads/            # User-uploaded images
├── knexfile.js
├── package.json
└── .env.example
```

## File Size Rule

Target: **≤160 lines avg, max 200 lines** per file. Split large controllers into focused handler files.
