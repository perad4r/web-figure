exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('home_settings');
  if (exists) return;

  await knex.schema.createTable('home_settings', (table) => {
    table.increments('id').primary();
    table.string('section', 50).notNullable();
    table.integer('position').unsigned().notNullable().defaultTo(0);
    table.string('label', 255).nullable();
    table.string('subtitle', 255).nullable();
    table.text('image_url').nullable();
    table.string('link_url', 500).nullable();
    table.text('extra_json').nullable();
    table.boolean('is_active').notNullable().defaultTo(1);
    table.timestamps(true, true);
    table.index(['section', 'is_active', 'position']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('home_settings');
};
