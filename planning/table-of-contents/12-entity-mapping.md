# Chapter 12 — Entity Mapping (Vietnamese → English)

## Purpose

The datn-kien project uses Vietnamese column/table names. This reference maps every entity for quick lookup during development.

---

## Table Names

| Vietnamese | English | Model File |
|------------|---------|------------|
| users | users | User.js |
| the_loais | categories | TheLoai.js |
| hangs | products | Hang.js |
| bien_the_hangs | product_variants | BienTheHang.js |
| maus | colors | Mau.js |
| kich_cos | sizes | KichCo.js |
| gio_hangs | cart_items | GioHang.js |
| don_hangs | orders | DonHang.js |
| chi_tiet_don_hangs | order_details | ChiTietDonHang.js |
| khach_hangs | customers | KhachHang.js |
| danh_gias | reviews | DanhGia.js |
| payment_status_histories | payment_status_histories | PaymentStatusHistory.js |
| user_audit_logs | user_audit_logs | UserAuditLog.js |

---

## Common Column Names

| Vietnamese | English | Used In |
|------------|---------|---------|
| ten | name | users, hangs, the_loais, maus, kich_cos, khach_hangs |
| gia | price | hangs, bien_the_hangs, chi_tiet_don_hangs, don_hangs |
| hinh_anh | image | hangs, bien_the_hangs |
| mo_ta | description | hangs, the_loais |
| ton_kho | stock | hangs, bien_the_hangs |
| so_luong | quantity | gio_hangs, chi_tiet_don_hangs |
| dia_chi | address | don_hangs, khach_hangs, users |
| trang_thai | status | the_loais |
| danh_gia | review_text | danh_gias |
| ghi_chu | notes | don_hangs |
| sdt | phone | khach_hangs |
| ma_user | user_id | khach_hangs |
| ma_don | order_id | danh_gias |
| ma | code | danh_gias |

---

## Foreign Key Mapping

| FK Column | References | Relationship |
|-----------|------------|-------------|
| the_loai_id | the_loais.id | Product → Category |
| hang_id | hangs.id | Variant/Detail/Review → Product |
| mau_id | maus.id | Variant/Detail → Color |
| kich_co_id | kich_cos.id | Variant/Detail → Size |
| user_id | users.id | Order/Cart/Review → User |
| don_hang_id | don_hangs.id | Detail/PayHistory → Order |
| chi_tiet_don_hang_id | bien_the_hangs.id | Cart → Variant |

---

## Route Translations

| Vietnamese URL | English Meaning |
|----------------|-----------------|
| /san-pham | /products |
| /kham-pha | /explore |
| /gio-hang | /cart |
| /dang-nhap | /login |
| /dang-ky | /register |
| /dang-xuat | /logout |
| /lich-su-don-hang | /order-history |
| /ho-so | /profile |
| /thanh-toan | /payment |
| /danh-gia | /reviews |

---

## Order Status Codes

| Code | Vietnamese | English |
|------|-----------|---------|
| 0 | Chưa thanh toán | Unpaid |
| 1 | Đã thanh toán | Paid |
| 2 | Đã hủy | Cancelled |
| 3 | Đang giao hàng | Shipping |
| 4 | Đã nhận hàng | Received |

## User Roles

| Code | Vietnamese | English |
|------|-----------|---------|
| 0 | Admin | Admin |
| 1 | Khách hàng | Customer |
| 2 | Nhân viên | Staff |
