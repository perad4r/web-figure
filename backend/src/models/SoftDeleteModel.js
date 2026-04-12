const BaseModel = require('./BaseModel');

class SoftDeleteModel extends BaseModel {
  static query(trx) {
    return super.query(trx).whereNull(`${this.tableName}.deleted_at`);
  }

  static queryWithDeleted(trx) {
    return super.query(trx);
  }
}

module.exports = SoftDeleteModel;

