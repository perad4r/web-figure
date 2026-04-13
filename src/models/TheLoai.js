const SoftDeleteModel = require('./SoftDeleteModel');

class TheLoai extends SoftDeleteModel {
  static get tableName() {
    return 'the_loais';
  }

  static get relationMappings() {
    const Hang = require('./Hang');

    return {
      products: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: Hang,
        join: { from: 'the_loais.id', to: 'hangs.the_loai_id' },
      },
    };
  }
}

module.exports = TheLoai;
