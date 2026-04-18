const BaseModel = require('./BaseModel');

class HomeSetting extends BaseModel {
  static get tableName() {
    return 'home_settings';
  }

  static async forSection(section) {
    return this.query().where({ section, is_active: 1 }).orderBy('position', 'asc');
  }
}

module.exports = HomeSetting;
