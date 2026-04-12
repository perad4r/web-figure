exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('user_audit_logs');
  if (exists) return;

  await knex.schema.createTable('user_audit_logs', (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');

    table.string('action', 255).notNullable();
    table.text('details').nullable();
    table.string('ip_address', 45).nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('user_audit_logs');
};

