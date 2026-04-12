exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('danh_gias');
  if (exists) return;

  await knex.schema.createTable('danh_gias', (table) => {
    table.increments('id').primary();
    table.string('ma', 255).nullable();
    table.text('danh_gia').notNullable();

    table
      .integer('ma_don')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('don_hangs')
      .onDelete('SET NULL');

    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table
      .integer('hang_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('hangs')
      .onDelete('SET NULL');

    table.integer('rating').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('danh_gias');
};

