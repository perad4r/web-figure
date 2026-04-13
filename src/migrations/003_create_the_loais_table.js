exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('the_loais');
  if (exists) return;

  await knex.schema.createTable('the_loais', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.text('mo_ta').nullable();
    table.boolean('trang_thai').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('the_loais');
};

