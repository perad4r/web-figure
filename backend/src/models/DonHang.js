const BaseModel = require('./BaseModel');

class DonHang extends BaseModel {
  static get tableName() {
    return 'don_hangs';
  }

  static STATUS = {
    UNPAID: 0,
    PAID: 1,
    CANCELLED: 2,
    SHIPPING: 3,
    RECEIVED: 4,
  };

  static get relationMappings() {
    const User = require('./User');
    const ChiTietDonHang = require('./ChiTietDonHang');
    const PaymentStatusHistory = require('./PaymentStatusHistory');

    return {
      details: {
        relation: BaseModel.HasManyRelation,
        modelClass: ChiTietDonHang,
        join: { from: 'don_hangs.id', to: 'chi_tiet_don_hangs.don_hang_id' },
      },
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'don_hangs.user_id', to: 'users.id' },
      },
      histories: {
        relation: BaseModel.HasManyRelation,
        modelClass: PaymentStatusHistory,
        join: { from: 'don_hangs.id', to: 'payment_status_histories.don_hang_id' },
      },
    };
  }
}

module.exports = DonHang;

