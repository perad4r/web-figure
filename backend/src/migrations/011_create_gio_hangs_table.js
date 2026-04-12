exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('gio_hangs');
  if (exists) return;

  await knex.schema.createTable('gio_hangs', (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');

    table
      .integer('chi_tiet_don_hang_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('bien_the_hangs');

    table.integer('so_luong').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('gio_hangs');
};

