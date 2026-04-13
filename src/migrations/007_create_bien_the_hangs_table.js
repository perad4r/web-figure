exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('bien_the_hangs');
  if (exists) return;

  await knex.schema.createTable('bien_the_hangs', (table) => {
    table.increments('id').primary();

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

    table.string('hinh_anh', 255).nullable();
    table.decimal('gia', 12, 2).notNullable();
    table.integer('ton_kho').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('bien_the_hangs');
};

