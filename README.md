# Warning: Hiện không dùng để kinh doanh

# web-figure (PMFigure Node.js)

Web bán figure. SSR Express + EJS. MySQL + Knex + Objection.

## Yêu cầu

- Node.js `>=20`
- MySQL 8.x (hoặc MySQL compatible)

## Chạy project (không dùng Docker)

1. Cài dependency:

```bash
npm install
```

2. Tạo `.env` (copy `.env.example`, rồi sửa DB):

```bash
copy .env.example .env
```

3. Migrate + seed:

```bash
npm run migrate
npm run seed
```

4. Chạy dev:

```bash
npm run dev
```

Mở:

- Client: `http://127.0.0.1:3000/san-pham`
- Admin: `http://127.0.0.1:3000/admin`

Admin seed (nếu không set env):

- Email: `admin@example.com`
- Password: `admin123`

## Migrate database

```bash
npm run migrate
```

```bash
npm run migrate:make
```

```bash
npm run seed
```

## Đổi kết nối database

Sửa trong `.env`:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

Knex đọc env trong `knexfile.js`.

## Thêm dữ liệu mẫu (sản phẩm ví dụ)

Seed có sẵn:

- `src/seeds/001_admin_user.js` (admin)
- `src/seeds/002_sample_taxonomy.js` (category/color/size)
- `src/seeds/003_sample_products.js` (sample product + variants)

```bash
npm run seed
```

## Tooling cho dev

DB CLI (có lệnh reset, cẩn thận):

```bash
npm run db -- ping
npm run db -- tables
npm run db -- count users
npm run db -- sql "select 1"
npm run db -- reset --yes
```

API smoke (tự login + test CRUD chính):

```bash
npm run api-smoke
npm run api-smoke -- --reset --yes
```

## Chạy bằng Docker Compose

```bash
docker compose up -d --build
```

- App: `http://127.0.0.1:3000`
- MySQL host port: `3406` (container port vẫn `3306`)

Đổi port host (nếu máy bị trùng port):

```bash
APP_HOST_PORT=8089 DB_HOST_PORT=3406 docker compose up -d --build
```

```bash
docker compose down -v
```
