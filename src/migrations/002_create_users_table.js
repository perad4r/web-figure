exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('users');
  if (exists) return;

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('ten', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('phone', 20).nullable();
    table.text('address').nullable();
    table.integer('role').notNullable();
    table.boolean('status').notNullable().defaultTo(true);
    table.timestamp('email_verified_at').nullable();
    table.string('remember_token', 100).nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('users');
};

