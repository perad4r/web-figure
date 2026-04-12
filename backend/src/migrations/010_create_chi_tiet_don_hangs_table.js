exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('chi_tiet_don_hangs');
  if (exists) return;

  await knex.schema.createTable('chi_tiet_don_hangs', (table) => {
    table.increments('id').primary();

    table
      .integer('don_hang_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('don_hangs');

    table
      .integer('hang_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('hangs');

    table
      .integer('mau_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('maus');

    table
      .integer('kich_co_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('kich_cos');

    table.integer('so_luong').notNullable();
    table.decimal('gia', 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('chi_tiet_don_hangs');
};

