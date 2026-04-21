exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable('bien_the_hangs');
  if (!exists) return;

  const hasColumn = await knex.schema.hasColumn('bien_the_hangs', 'ten');
  if (!hasColumn) {
    await knex.schema.alterTable('bien_the_hangs', (table) => {
      table.string('ten', 255).nullable().after('kich_co_id');
    });
  }

  const rows = await knex('bien_the_hangs').select('id', 'ten');
  for (const row of rows) {
    if (!row.ten || !String(row.ten).trim()) {
      await knex('bien_the_hangs').where({ id: row.id }).update({
        ten: `Tuy chon ${row.id}`,
        updated_at: knex.fn.now(),
      });
    }
  }
};

exports.down = async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('bien_the_hangs', 'ten');
  if (!hasColumn) return;

  await knex.schema.alterTable('bien_the_hangs', (table) => {
    table.dropColumn('ten');
  });
};
