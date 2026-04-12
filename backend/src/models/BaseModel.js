const { Model } = require('objection');

class BaseModel extends Model {
  static get idColumn() {
    return 'id';
  }
}

module.exports = BaseModel;
