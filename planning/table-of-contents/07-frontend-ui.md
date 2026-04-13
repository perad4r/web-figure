# Chapter 7 — Frontend UI Plan

## Design Source

UI theme = **pmfigure.vn** (pink/red figure store).
Already cloned base pages in `frontend/`:
- `index.html` — Home
- `category.html` — Category listing
- `product.html` — Product detail
- `cart.html` — Cart
- `orders.html` — Order tracking

## CSS Stack

- **Bootstrap 5.3.3** (CDN)
- **Bootstrap Icons** (CDN)
- **Custom CSS** (`assets/css/styles.css`) — pmfigure theme colors
- **Google Fonts**: Roboto (current), consider matching Manrope from datn-kien

## Key Theme Variables

```css
:root {
  --pm-red: #ed5d82;      /* Primary pink/red */
  --pm-bg: #f5f5f5;       /* Page background */
  --pm-gray: #666;        /* Muted text */
}
```

## JS Stack

- **jQuery 3.6** (CDN) — matching datn-kien's approach
- **Bootstrap 5 JS Bundle** (CDN) — modals, dropdowns, carousels

---

## Page-by-Page Adaptation

### Home (`index.html`)

Current: Static hero + placeholder products.
Needed:
- [ ] Dynamic product grid via AJAX `GET /api/products/featured`
- [ ] Category carousel/circles linking to `/san-pham?category=X`
- [ ] Quick-add modal (port from datn-kien's `app.blade.php`)
- [ ] Search bar → `/san-pham?search=query`

### Category / Product Listing (`category.html` → `san-pham.html`)

Current: Static 3-product grid.
Needed:
- [ ] Filter sidebar: category dropdown, sort order
- [ ] Pagination controls
- [x] Server-rendered EJS (SSR) for `/san-pham` and `/san-pham/:id`
- [ ] AJAX enhancements (quick-add modal, cart interactions) on top of SSR
- [ ] Quick-add button per product card

### Product Detail (`product.html`)

Current: Static Gawr Gura product.
Needed:
- [ ] Variant selector (color × size dropdown or chips)
- [ ] Stock display per variant
- [ ] Image gallery (variant images)
- [ ] Add to cart form → `POST /gio-hang`
- [ ] Reviews section at bottom
- [ ] Related products row

### Cart (`cart.html`)

Current: Static table.
Needed:
- [ ] Dynamic cart items via AJAX or EJS
- [ ] Quantity update (AJAX `PUT /gio-hang/:id`)
- [ ] Remove item (AJAX `DELETE /gio-hang/:id`)
- [ ] Real-time total recalculation
- [ ] Checkout form (name, address, phone, email, notes)
- [ ] Checkout submit → `POST /gio-hang/checkout`

### Orders (`orders.html`)

Current: Simple search input.
Needed:
- [ ] Order list table with status badges
- [ ] Status color coding (unpaid=yellow, paid=green, shipping=blue, etc.)
- [ ] Cancel / Mark received buttons
- [ ] Order detail view (line items, totals)

---

## Quick-Add Modal (Port from datn-kien)

The datn-kien `app.blade.php` contains a `#quickAddModal` for adding products to cart without navigating to detail page. Port this:

1. Click "Chọn mua" on product card
2. Modal opens → fetch variants via `GET /san-pham/:id/variants`
3. Populate dropdown with color/size combos
4. Select variant → show stock + price
5. Submit → `POST /gio-hang` via AJAX
6. Update cart badge count

---

## Auth Pages

- `/dang-nhap` — Login form (email + password)
- `/dang-ky` — Register form (name, email, password, phone, address)

Both served as EJS or static HTML with form POST to backend.

---

## Responsive Design

Bootstrap 5 breakpoints. Mobile-first. Test:
- Desktop (1200px+)
- Tablet (768px)
- Mobile (375px)

Navigation: hamburger menu on mobile (Bootstrap offcanvas, same as datn-kien).
