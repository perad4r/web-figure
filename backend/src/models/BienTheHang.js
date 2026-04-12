const BaseModel = require('./BaseModel');

class BienTheHang extends BaseModel {
  static get tableName() {
    return 'bien_the_hangs';
  }

  static get relationMappings() {
    const Hang = require('./Hang');
    const Mau = require('./Mau');
    const KichCo = require('./KichCo');

    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Hang,
        join: { from: 'bien_the_hangs.hang_id', to: 'hangs.id' },
      },
      color: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mau,
        join: { from: 'bien_the_hangs.mau_id', to: 'maus.id' },
      },
      size: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: KichCo,
        join: { from: 'bien_the_hangs.kich_co_id', to: 'kich_cos.id' },
      },
    };
  }
}

module.exports = BienTheHang;
