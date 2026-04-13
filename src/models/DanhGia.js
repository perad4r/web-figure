const SoftDeleteModel = require('./SoftDeleteModel');

class DanhGia extends SoftDeleteModel {
  static get tableName() {
    return 'danh_gias';
  }

  static get relationMappings() {
    const DonHang = require('./DonHang');
    const User = require('./User');
    const Hang = require('./Hang');

    return {
      order: {
        relation: SoftDeleteModel.BelongsToOneRelation,
        modelClass: DonHang,
        join: { from: 'danh_gias.ma_don', to: 'don_hangs.id' },
      },
      user: {
        relation: SoftDeleteModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'danh_gias.user_id', to: 'users.id' },
      },
      product: {
        relation: SoftDeleteModel.BelongsToOneRelation,
        modelClass: Hang,
        join: { from: 'danh_gias.hang_id', to: 'hangs.id' },
      },
    };
  }
}

module.exports = DanhGia;
