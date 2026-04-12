exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('maus');
  if (exists) return;

  await knex.schema.createTable('maus', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.string('hex_code', 7).nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('maus');
};

