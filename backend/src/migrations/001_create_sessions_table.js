/**
 * connect-session-knex compatible sessions table.
 */

exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('sessions');
  if (exists) return;

  await knex.schema.createTable('sessions', (table) => {
    table.string('sid', 255).primary();
    table.text('sess', 'longtext').notNullable();
    table.dateTime('expired').notNullable().index();
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('sessions');
};
