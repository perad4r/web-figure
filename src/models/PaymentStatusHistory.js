const BaseModel = require('./BaseModel');

class PaymentStatusHistory extends BaseModel {
  static get tableName() {
    return 'payment_status_histories';
  }

  static get relationMappings() {
    const DonHang = require('./DonHang');
    const User = require('./User');

    return {
      order: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DonHang,
        join: { from: 'payment_status_histories.don_hang_id', to: 'don_hangs.id' },
      },
      changedByUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'payment_status_histories.changed_by', to: 'users.id' },
      },
    };
  }
}

module.exports = PaymentStatusHistory;

