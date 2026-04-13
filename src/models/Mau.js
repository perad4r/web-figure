const SoftDeleteModel = require('./SoftDeleteModel');

class Mau extends SoftDeleteModel {
  static get tableName() {
    return 'maus';
  }

  static get relationMappings() {
    const BienTheHang = require('./BienTheHang');

    return {
      variants: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: BienTheHang,
        join: { from: 'maus.id', to: 'bien_the_hangs.mau_id' },
      },
    };
  }
}

module.exports = Mau;

