# Chapter 5 — Client Routes

## Route Mapping: Laravel → Express

All client-facing routes. Served as HTML pages (static or EJS).

---

### Home & Product Browse

| Laravel Route | Express Route | Controller |
|---------------|---------------|------------|
| `GET /` | `GET /` | `productController.home` |
| `GET /kham-pha` | `GET /kham-pha` | `productController.index` |
| `GET /san-pham` | `GET /san-pham` | `productController.index` |
| `GET /san-pham/{hang}` | `GET /san-pham/:id` | `productController.show` |
| `GET /san-pham/{hang}/variants` | `GET /san-pham/:id/variants` | `productController.getVariants` (JSON) |

**`productController.home`**: 
- Fetch featured products (latest 8), categories
- Render home page with hero carousel

**`productController.index`**: 
- Query hangs with filters (category, search, sort)
- Pagination (Knex `.limit().offset()`)
- Eager load `theLoai`, `bienTheHangs`

**`productController.show`**: 
- Fetch single hang by ID
- Eager load variants with color/size, reviews with user
- Related products from same category

**`productController.getVariants`**: 
- JSON API for quick-add modal
- Return `{ product, variants }` with color/size names

---

### Cart

| Laravel Route | Express Route | Middleware |
|---------------|---------------|------------|
| `GET /giohangs` (resource index) | `GET /gio-hang` | — |
| `POST /giohangs` (resource store) | `POST /gio-hang` | auth |
| `PUT /giohangs/{id}` (resource update) | `PUT /gio-hang/:id` | auth |
| `DELETE /giohangs/{id}` (resource destroy) | `DELETE /gio-hang/:id` | auth |
| `POST /giohangs/checkout` | `POST /gio-hang/checkout` | auth |

**`cartController.index`**: 
- Fetch user's cart items with variant → product → color → size eager loading
- Calculate totals
- Render cart page

**`cartController.store`**: 
- Validate: hang_id, mau_id, kich_co_id, so_luong
- Find variant → check stock
- Upsert cart item (add to existing or create new)
- Return JSON `{ message, cart_count }`

**`cartController.checkout`**: 
- Transaction: create `don_hang` + `chi_tiet_don_hang` rows
- Clear user's cart
- Redirect to order detail or PayOS

---

### Order History

| Laravel Route | Express Route | Middleware |
|---------------|---------------|------------|
| `GET /lich-su-don-hang` | `GET /lich-su-don-hang` | auth |
| `GET /lich-su-don-hang/{id}` | `GET /lich-su-don-hang/:id` | auth |
| `PATCH /lich-su-don-hang/{id}/huy` | `PATCH /lich-su-don-hang/:id/huy` | auth |
| `PATCH /lich-su-don-hang/{id}/da-nhan` | `PATCH /lich-su-don-hang/:id/da-nhan` | auth |

**`orderController.index`**: User's orders, newest first.
**`orderController.show`**: Order details with line items.
**`orderController.cancel`**: Set status=2 if currently unpaid.
**`orderController.markReceived`**: Set status=4 if currently shipping.

---

### Profile

| Laravel Route | Express Route | Middleware |
|---------------|---------------|------------|
| `GET /ho-so` | `GET /ho-so` | auth |
| `PUT /ho-so` | `PUT /ho-so` | auth |

---

### Reviews

| Laravel Route | Express Route | Middleware |
|---------------|---------------|------------|
| `POST /danhgia/client` | `POST /danh-gia` | auth |

**`reviewController.storeClient`**: Submit review for a product the user has ordered.

---

## Frontend Serving Strategy

Client HTML files in `frontend/` served as static files.
Dynamic data injected via:
1. EJS for server-rendered pages, OR
2. jQuery AJAX calls to JSON API endpoints

Recommended hybrid: EJS for initial page load, AJAX for interactive features (cart, quick-add).
