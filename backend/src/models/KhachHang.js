const BaseModel = require('./BaseModel');

class KhachHang extends BaseModel {
  static get tableName() {
    return 'khach_hangs';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'khach_hangs.ma_user', to: 'users.id' },
      },
    };
  }
}

module.exports = KhachHang;

