const SoftDeleteModel = require('./SoftDeleteModel');

class User extends SoftDeleteModel {
  static get tableName() {
    return 'users';
  }

  static ROLE_ADMIN = 0;
  static ROLE_CUSTOMER = 1;
  static ROLE_STAFF = 2;

  static get relationMappings() {
    const DonHang = require('./DonHang');
    const GioHang = require('./GioHang');

    return {
      orders: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: DonHang,
        join: { from: 'users.id', to: 'don_hangs.user_id' },
      },
      cartItems: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: GioHang,
        join: { from: 'users.id', to: 'gio_hangs.user_id' },
      },
    };
  }

  isAdmin() {
    return this.role === User.ROLE_ADMIN;
  }

  isStaff() {
    return [User.ROLE_ADMIN, User.ROLE_STAFF].includes(this.role);
  }
}

module.exports = User;
