exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('kich_cos');
  if (exists) return;

  await knex.schema.createTable('kich_cos', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('kich_cos');
};

