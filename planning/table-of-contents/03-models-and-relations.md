# Chapter 3 — Models & Relations

## Objection.js Model Pattern

Each model extends `objection.Model`, defines:
- `tableName` — maps to DB table
- `jsonSchema` — validation (optional)
- `relationMappings` — eager loading / joins

Laravel Eloquent → Objection.js mapping:

| Eloquent | Objection.js |
|----------|-------------|
| `belongsTo` | `BelongsToOneRelation` |
| `hasMany` | `HasManyRelation` |
| `hasOne` | `HasOneRelation` |
| `belongsToMany` | `ManyToManyRelation` |
| `$fillable` | `jsonSchema.properties` |
| `SoftDeletes` | Custom query filter |

---

## Model: User (`models/User.js`)

```js
class User extends Model {
  static tableName = 'users';
  
  static ROLE_ADMIN = 0;
  static ROLE_CUSTOMER = 1;
  static ROLE_STAFF = 2;

  static relationMappings = {
    orders: { relation: Model.HasManyRelation, modelClass: DonHang, join: { from: 'users.id', to: 'don_hangs.user_id' } },
    cartItems: { relation: Model.HasManyRelation, modelClass: GioHang, join: { from: 'users.id', to: 'gio_hangs.user_id' } },
  };

  isAdmin() { return this.role === User.ROLE_ADMIN; }
  isStaff() { return [User.ROLE_ADMIN, User.ROLE_STAFF].includes(this.role); }
}
```

---

## Model: TheLoai / Category (`models/TheLoai.js`)

```js
class TheLoai extends Model {
  static tableName = 'the_loais';
  static relationMappings = {
    products: { relation: Model.HasManyRelation, modelClass: Hang, join: { from: 'the_loais.id', to: 'hangs.the_loai_id' } },
  };
}
```

---

## Model: Hang / Product (`models/Hang.js`)

```js
class Hang extends Model {
  static tableName = 'hangs';
  static relationMappings = {
    theLoai:  { relation: Model.BelongsToOneRelation, modelClass: TheLoai, join: { from: 'hangs.the_loai_id', to: 'the_loais.id' } },
    variants: { relation: Model.HasManyRelation, modelClass: BienTheHang, join: { from: 'hangs.id', to: 'bien_the_hangs.hang_id' } },
    reviews:  { relation: Model.HasManyRelation, modelClass: DanhGia, join: { from: 'hangs.id', to: 'danh_gias.hang_id' } },
  };

  async syncStockFromVariants() {
    const total = await BienTheHang.query().where('hang_id', this.id).sum('ton_kho as total').first();
    await this.$query().patch({ ton_kho: total?.total || 0 });
  }
}
```

---

## Model: BienTheHang / Variant (`models/BienTheHang.js`)

```js
class BienTheHang extends Model {
  static tableName = 'bien_the_hangs';
  static relationMappings = {
    product: { BelongsToOneRelation → Hang via hang_id },
    color:   { BelongsToOneRelation → Mau via mau_id },
    size:    { BelongsToOneRelation → KichCo via kich_co_id },
  };
}
```

---

## Model: DonHang / Order (`models/DonHang.js`)

```js
class DonHang extends Model {
  static tableName = 'don_hangs';
  
  static STATUS = { UNPAID: 0, PAID: 1, CANCELLED: 2, SHIPPING: 3, RECEIVED: 4 };

  static relationMappings = {
    details:    { HasManyRelation → ChiTietDonHang via don_hang_id },
    user:       { BelongsToOneRelation → User via user_id },
    histories:  { HasManyRelation → PaymentStatusHistory via don_hang_id },
  };

  async markAsPaidWithInventory(changedBy, note) {
    // Transaction: lock, decrement variant stock, update status, record history
  }
}
```

---

## Remaining Models (simpler)

- **Mau** (Color): tableName `maus`, has `bienTheHangs` relation
- **KichCo** (Size): tableName `kich_cos`, has `bienTheHangs` relation
- **GioHang** (Cart): tableName `gio_hangs`, belongsTo `User` + `BienTheHang`
- **ChiTietDonHang** (OrderDetail): tableName `chi_tiet_don_hangs`, belongsTo `DonHang`, `Hang`, `Mau`, `KichCo`
- **KhachHang** (Customer): tableName `khach_hangs`, belongsTo `User`
- **DanhGia** (Review): tableName `danh_gias`, belongsTo `User`, `Hang`, `DonHang`
- **PaymentStatusHistory**: tableName `payment_status_histories`, belongsTo `DonHang`
- **UserAuditLog**: tableName `user_audit_logs`, belongsTo `User`

---

## Soft Delete Strategy

Knex doesn't have built-in soft deletes. Options:
1. **Custom modifier** — add `.whereNull('deleted_at')` to default queries
2. **Objection.js QueryBuilder override** — create `SoftDeleteModel` base class

Recommended: Option 2 — create `models/base/SoftDeleteModel.js` that overrides `query()`.
