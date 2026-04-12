exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('khach_hangs');
  if (exists) return;

  await knex.schema.createTable('khach_hangs', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.string('sdt', 20).notNullable();
    table.string('email', 255).nullable();
    table.text('dia_chi').notNullable();

    table
      .integer('ma_user')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('khach_hangs');
};

