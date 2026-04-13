# Master Checklist — PMFigure Node.js Conversion

## Phase 1: Project Setup
- [x] Create `.gitignore` (ignore `.env`, uploads, node_modules)
- [x] Create `.env.example` (no real secrets)
- [x] Init Node.js project in `backend/` (`npm init`)
- [x] Install deps: express, knex, objection, mysql2, ejs, express-session, connect-session-knex, bcryptjs, multer, dotenv, cors, helmet, morgan
- [x] Install dev deps: nodemon
- [x] Create `backend/knexfile.js` config
- [x] Create `backend/src/app.js` entry point
- [x] Setup `.env` (copy from `.env.example`, fill values)
- [x] Create folder structure (`src/config`, `routes`, `controllers`, `models`, `middleware`, `services`, `views`)

## Phase 2: Database
- [x] Migration: `users` table
- [x] Migration: `the_loais` (categories) table
- [x] Migration: `maus` (colors) table
- [x] Migration: `kich_cos` (sizes) table
- [x] Migration: `hangs` (products) table
- [x] Migration: `bien_the_hangs` (variants) table
- [x] Migration: `khach_hangs` (customers) table
- [x] Migration: `don_hangs` (orders) table
- [x] Migration: `chi_tiet_don_hangs` (order_details) table
- [x] Migration: `gio_hangs` (carts) table
- [x] Migration: `danh_gias` (reviews) table
- [x] Migration: `payment_status_histories` table
- [x] Migration: `user_audit_logs` table
- [x] Migration: `sessions` table (connect-session-knex)
- [x] Seed: admin user
- [x] Seed: sample categories, colors, sizes

## Phase 3: Models
- [x] Model: User
- [x] Model: TheLoai (Category)
- [x] Model: Hang (Product)
- [x] Model: BienTheHang (Variant)
- [x] Model: Mau (Color)
- [x] Model: KichCo (Size)
- [x] Model: GioHang (Cart)
- [x] Model: DonHang (Order)
- [x] Model: ChiTietDonHang (OrderDetail)
- [x] Model: KhachHang (Customer)
- [x] Model: DanhGia (Review)
- [x] Model: PaymentStatusHistory
- [x] Model: UserAuditLog

## Phase 4: Auth & Middleware
- [x] Session config
- [x] Auth controller (login, register, logout)
- [x] `isAuthenticated` middleware
- [x] `isAdmin` middleware
- [x] Login page (EJS or static HTML)
- [x] Register page

## Phase 5: Client Routes & Controllers
- [x] `GET /` — Home page
- [x] `GET /san-pham` — Product listing
- [x] `GET /san-pham/:id` — Product detail
- [x] `GET /san-pham/:id/variants` — Variants JSON API
- [x] `GET /giohangs` — Cart page
- [x] `POST /giohangs` — Add to cart
- [x] `PUT /giohangs/:id` — Update qty
- [x] `DELETE /giohangs/:id` — Remove from cart
- [x] `POST /giohangs/checkout` — Checkout
- [x] `GET /lich-su-don-hang` — Order history
- [x] `GET /lich-su-don-hang/:id` — Order detail
- [x] `PATCH /lich-su-don-hang/:id/huy` — Cancel order
- [x] `PATCH /lich-su-don-hang/:id/da-nhan` — Mark received
- [x] `GET /ho-so` — Profile edit
- [x] `PUT /ho-so` — Profile update
- [x] `POST /danhgia/client` — Submit review

## Phase 6: Admin Routes & Controllers
- [x] `GET /admin/dashboard` — Dashboard
- [x] CRUD: Products (hangs)
- [x] CRUD: Categories (theloais)
- [x] CRUD: Colors (maus) + restore
- [x] CRUD: Sizes (kichcos) + restore
- [x] CRUD: Orders (donhang) + status filter + payment
- [x] CRUD: Users + toggle status
- [x] CRUD: Customers (khachhangs)
- [x] CRUD: Reviews (danhgia)
- [x] CRUD: Variants (bienthehangs)

## Phase 7: Frontend UI
- [x] Adapt pmfigure.vn UI → product data templates (base theme applied to SSR)
- [x] Wire AJAX calls (jQuery) → Node.js API
- [x] Quick-add modal
- [x] Cart interactive update (SSR forms for update/remove)
- [x] Order history view (SSR list/detail + cancel/received actions)

## Phase 8: Admin UI (EJS)
- [x] Admin layout template
- [x] Dashboard page
- [x] Products CRUD forms
- [x] Categories CRUD forms
- [x] Colors CRUD forms
- [x] Sizes CRUD forms
- [x] Orders management
- [x] Users management

## Phase 9: Payment
- [x] PayOS service (guarded by `PAYOS_ENABLED=true`)
- [x] Install PayOS SDK (`@payos/node`)
- [x] Checkout controller
- [x] Webhook handler (verify + update order)
- [x] Return/cancel handlers

## Phase 10: File Uploads
- [x] Multer config
- [x] Product image upload (admin + wired into product forms)
- [x] Variant image upload (admin + wired into variant forms)
- [x] Serve uploaded files

## Phase 11: Deployment
- [x] Dockerfile
- [x] docker-compose.yml
- [x] PM2 ecosystem config
- [x] Environment variables doc
