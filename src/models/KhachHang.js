const SoftDeleteModel = require('./SoftDeleteModel');

class KhachHang extends SoftDeleteModel {
  static get tableName() {
    return 'khach_hangs';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      user: {
        relation: SoftDeleteModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'khach_hangs.ma_user', to: 'users.id' },
      },
    };
  }
}

module.exports = KhachHang;
