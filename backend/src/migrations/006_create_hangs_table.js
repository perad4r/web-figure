exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('hangs');
  if (exists) return;

  await knex.schema.createTable('hangs', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.decimal('gia', 12, 2).notNullable();
    table.integer('ton_kho').notNullable();
    table.string('hinh_anh', 255).nullable();
    table.text('mo_ta').nullable();

    table
      .integer('the_loai_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('the_loais');

    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('hangs');
};

