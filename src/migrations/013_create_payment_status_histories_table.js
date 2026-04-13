exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('payment_status_histories');
  if (exists) return;

  await knex.schema.createTable('payment_status_histories', (table) => {
    table.increments('id').primary();

    table
      .integer('don_hang_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('don_hangs');

    table.string('payment_status', 255).notNullable();
    table.text('note').nullable();

    table
      .integer('changed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('payment_status_histories');
};

