# Chapter 2 — Database Schema

## Overview

13 tables total. Mapping from Laravel migrations → Knex migrations.
All tables use `id` (auto-increment PK), `created_at`, `updated_at` timestamps.

## Connection Details

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=figurevn        # starts empty; migrations create tables
DB_USERNAME=app
DB_PASSWORD=change-me
```

> Note: If using a remote MySQL over Tailscale, set `DB_HOST` to your Tailscale IP/DNS name.

---

## Table: `users`

Source: `0001_01_01_000000_create_users_table.php` + amendments

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | Name |
| email | string(255) | Unique |
| password | string(255) | bcrypt |
| phone | string(20) | nullable |
| address | text | nullable |
| role | integer | 0=admin, 1=customer, 2=staff |
| status | boolean | default true |
| email_verified_at | timestamp | nullable |
| remember_token | string(100) | nullable |
| deleted_at | timestamp | nullable (soft delete) |
| created_at / updated_at | timestamps | |

---

## Table: `the_loais` (Categories)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | Category name |
| mo_ta | text | Description, nullable |
| trang_thai | boolean | Active status, default true |
| created_at / updated_at | timestamps | |

---

## Table: `maus` (Colors)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | Color name |
| hex_code | string(7) | nullable, e.g. #FF0000 |
| deleted_at | timestamp | nullable (soft delete) |
| created_at / updated_at | timestamps | |

---

## Table: `kich_cos` (Sizes)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | Size name (S, M, L, XL...) |
| deleted_at | timestamp | nullable (soft delete) |
| created_at / updated_at | timestamps | |

---

## Table: `hangs` (Products)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | Product name |
| gia | decimal(12,2) | Base price |
| ton_kho | integer | Stock (synced from variants) |
| hinh_anh | string(255) | nullable, image path |
| mo_ta | text | nullable, description |
| the_loai_id | integer (FK) | → the_loais.id |
| deleted_at | timestamp | nullable (soft delete) |
| created_at / updated_at | timestamps | |

---

## Table: `bien_the_hangs` (Variants)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| hang_id | integer (FK) | → hangs.id |
| mau_id | integer (FK) | → maus.id |
| kich_co_id | integer (FK) | → kich_cos.id |
| hinh_anh | string(255) | nullable |
| gia | decimal(12,2) | Variant price |
| ton_kho | integer | default 0 |
| created_at / updated_at | timestamps | |

---

## Table: `khach_hangs` (Customers)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ten | string(255) | |
| sdt | string(20) | Phone |
| email | string(255) | nullable |
| dia_chi | text | Address |
| ma_user | integer (FK) | nullable → users.id |
| created_at / updated_at | timestamps | |

---

## Table: `don_hangs` (Orders)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| user_id | integer (FK) | nullable → users.id |
| ten_khach_hang | string(255) | |
| dia_chi | text | |
| phone | string(20) | |
| email | string(255) | nullable |
| gia | decimal(12,2) | Total price |
| status | integer | 0=unpaid, 1=paid, 2=cancelled, 3=shipping, 4=received |
| ghi_chu | text | nullable, notes |
| payos_order_code | bigInteger | nullable |
| payos_payment_link_id | string | nullable |
| payos_checkout_url | text | nullable |
| payos_status | string | nullable |
| created_at / updated_at | timestamps | |

---

## Table: `chi_tiet_don_hangs` (Order Details)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| don_hang_id | integer (FK) | → don_hangs.id |
| hang_id | integer (FK) | → hangs.id |
| mau_id | integer (FK) | → maus.id |
| kich_co_id | integer (FK) | → kich_cos.id |
| so_luong | integer | Quantity |
| gia | decimal(12,2) | Line item price |
| created_at / updated_at | timestamps | |

---

## Table: `gio_hangs` (Carts)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| user_id | integer (FK) | → users.id |
| chi_tiet_don_hang_id | integer (FK) | → bien_the_hangs.id |
| so_luong | integer | Quantity |
| created_at / updated_at | timestamps | |

---

## Table: `danh_gias` (Reviews)

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| ma | string | nullable, review code |
| danh_gia | text | Review content |
| ma_don | integer (FK) | nullable → don_hangs.id |
| user_id | integer (FK) | nullable → users.id |
| hang_id | integer (FK) | nullable → hangs.id |
| rating | integer | 1-5, nullable |
| created_at / updated_at | timestamps | |

---

## Table: `payment_status_histories`

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| don_hang_id | integer (FK) | → don_hangs.id |
| payment_status | string | Status label |
| note | text | nullable |
| changed_by | integer (FK) | nullable → users.id |
| created_at / updated_at | timestamps | |

---

## Table: `user_audit_logs`

| Column | Type | Notes |
|--------|------|-------|
| id | increments | PK |
| user_id | integer (FK) | → users.id |
| action | string | |
| details | text | nullable |
| ip_address | string(45) | nullable |
| created_at / updated_at | timestamps | |

---

## Knex Migration File Naming

```
YYYYMMDDHHMMSS_create_users.js
YYYYMMDDHHMMSS_create_the_loais.js
YYYYMMDDHHMMSS_create_maus.js
...
```

Use `knex migrate:make <name>` to generate timestamps automatically.
