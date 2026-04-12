const BaseModel = require('./BaseModel');

class GioHang extends BaseModel {
  static get tableName() {
    return 'gio_hangs';
  }

  static get relationMappings() {
    const User = require('./User');
    const BienTheHang = require('./BienTheHang');

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'gio_hangs.user_id', to: 'users.id' },
      },
      variant: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: BienTheHang,
        join: { from: 'gio_hangs.chi_tiet_don_hang_id', to: 'bien_the_hangs.id' },
      },
    };
  }
}

module.exports = GioHang;

