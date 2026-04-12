const BaseModel = require('./BaseModel');

class UserAuditLog extends BaseModel {
  static get tableName() {
    return 'user_audit_logs';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'user_audit_logs.user_id', to: 'users.id' },
      },
    };
  }
}

module.exports = UserAuditLog;

