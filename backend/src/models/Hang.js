const SoftDeleteModel = require('./SoftDeleteModel');

class Hang extends SoftDeleteModel {
  static get tableName() {
    return 'hangs';
  }

  static get relationMappings() {
    const TheLoai = require('./TheLoai');
    const BienTheHang = require('./BienTheHang');
    const DanhGia = require('./DanhGia');

    return {
      theLoai: {
        relation: SoftDeleteModel.BelongsToOneRelation,
        modelClass: TheLoai,
        join: { from: 'hangs.the_loai_id', to: 'the_loais.id' },
      },
      variants: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: BienTheHang,
        join: { from: 'hangs.id', to: 'bien_the_hangs.hang_id' },
      },
      reviews: {
        relation: SoftDeleteModel.HasManyRelation,
        modelClass: DanhGia,
        join: { from: 'hangs.id', to: 'danh_gias.hang_id' },
      },
    };
  }

  async syncStockFromVariants() {
    const BienTheHang = require('./BienTheHang');

    const row = await BienTheHang.query()
      .where('hang_id', this.id)
      .sum('ton_kho as total')
      .first();

    const total = Number(row?.total || 0);
    await this.$query().patch({ ton_kho: total });
  }
}

module.exports = Hang;

