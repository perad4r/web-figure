exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('don_hangs');
  if (exists) return;

  await knex.schema.createTable('don_hangs', (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('ten_khach_hang', 255).notNullable();
    table.text('dia_chi').notNullable();
    table.string('phone', 20).notNullable();
    table.string('email', 255).nullable();
    table.decimal('gia', 12, 2).notNullable();
    table.integer('status').notNullable();
    table.text('ghi_chu').nullable();

    table.bigInteger('payos_order_code').nullable();
    table.string('payos_payment_link_id', 255).nullable();
    table.text('payos_checkout_url').nullable();
    table.string('payos_status', 255).nullable();

    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('don_hangs');
};

