const BaseModel = require('./BaseModel');

class ChiTietDonHang extends BaseModel {
  static get tableName() {
    return 'chi_tiet_don_hangs';
  }

  static get relationMappings() {
    const DonHang = require('./DonHang');
    const Hang = require('./Hang');
    const Mau = require('./Mau');
    const KichCo = require('./KichCo');

    return {
      order: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DonHang,
        join: { from: 'chi_tiet_don_hangs.don_hang_id', to: 'don_hangs.id' },
      },
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Hang,
        join: { from: 'chi_tiet_don_hangs.hang_id', to: 'hangs.id' },
      },
      color: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mau,
        join: { from: 'chi_tiet_don_hangs.mau_id', to: 'maus.id' },
      },
      size: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: KichCo,
        join: { from: 'chi_tiet_don_hangs.kich_co_id', to: 'kich_cos.id' },
      },
    };
  }
}

module.exports = ChiTietDonHang;

