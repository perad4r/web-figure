const SoftDeleteModel = require('./SoftDeleteModel');

class KichCo extends SoftDeleteModel {
  static get tableName() {
    return 'kich_cos';
  }

  static get relationMappings() {
    const BienTheHang = require('./BienTheHang');

    return {
      variants: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: BienTheHang,
        join: { from: 'kich_cos.id', to: 'bien_the_hangs.kich_co_id' },
      },
    };
  }
}

module.exports = KichCo;

