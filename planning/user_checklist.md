# User Checklist (Remaining Manual Checks)

## Run / Smoke
- [ ] Confirm `.env` DB env matches the MySQL you want to use locally.
- [x] Run: `npm run dev`
- [x] Run automated smoke: `npm run api-smoke -- --reset --yes`
- [x] Verify pages load in browser:
  - [x] `/san-pham` listing
  - [x] `/san-pham/1` detail (seeded product)
  - [x] `/dang-ky`, `/dang-nhap`, logout works

## Client Flow (Phase 5)
- [x] Add-to-cart via API (until UI button exists):
  - [x] `GET /san-pham/1/variants` returns variants
  - [x] `POST /giohangs` adds item (needs login)
  - [x] `/giohangs` shows items + checkout form
- [x] Checkout creates order and redirects to `/lich-su-don-hang/:id`
- [x] Cancel order: `PATCH /lich-su-don-hang/:id/huy`
- [x] Mark received only when status=shipping: `PATCH /lich-su-don-hang/:id/da-nhan`
- [x] Profile update works: `/ho-so` (PUT via `_method=PUT`)
- [x] Review submit: `POST /danhgia/client`

## Admin (Phase 6)
- [x] Login as seeded admin:
  - [x] `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env` OR default `admin@example.com` / `admin123`
- [x] `/admin/dashboard` loads
- [x] Categories CRUD (+ soft delete/restore):
  - [x] `/admin/categories` list
- [x] Variants CRUD (+ soft delete/restore): `/admin/variants`
- [x] Users CRUD (+ soft delete/restore + toggle): `/admin/users`
- [x] Customers CRUD (+ soft delete/restore): `/admin/customers`
- [x] Reviews edit + soft delete/restore: `/admin/reviews`
- [x] Uploads (Phase 10 done, admin-only endpoints):
  - [x] `POST /admin/uploads/products` (field `image`) returns JSON path
  - [x] `POST /admin/uploads/variants` (field `image`) returns JSON path

## Not Implemented Yet (Next Work)
- [ ] Theme polish (spacing, components, assets under `public/assets/`)
- [ ] Admin CRUD polish (confirm dialogs, better validation/messages, bulk actions)
- [ ] Payment (PayOS) end-to-end test: set `PAYOS_ENABLED=true`, confirm return/webhook in real PayOS flow
- [x] Deployment: Dockerfile, docker-compose, PM2 config, env docs (files created)

## Security / Hygiene
- [ ] Confirm `.env` is untracked and rotate PayOS keys if this repo ever public/shared.
