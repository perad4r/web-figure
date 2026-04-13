exports.up = async function up(knex) {
  async function addDeletedAt(tableName) {
    const hasTable = await knex.schema.hasTable(tableName);
    if (!hasTable) return;

    const hasDeletedAt = await knex.schema.hasColumn(tableName, 'deleted_at');
    if (!hasDeletedAt) {
      await knex.schema.alterTable(tableName, (table) => {
        table.timestamp('deleted_at').nullable();
      });
    }

    // Index for filtered queries
    const indexName = `${tableName}_deleted_at_index`;
    const existingIndexes = await knex
      .raw(
        `
        SELECT INDEX_NAME
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND INDEX_NAME = ?
        `,
        [tableName, indexName],
      )
      .then((r) => r[0] || r);

    const hasIndex = Array.isArray(existingIndexes) && existingIndexes.length > 0;
    if (!hasIndex) {
      await knex.schema.alterTable(tableName, (table) => {
        table.index(['deleted_at'], indexName);
      });
    }
  }

  await addDeletedAt('the_loais');
  await addDeletedAt('bien_the_hangs');
  await addDeletedAt('khach_hangs');
  await addDeletedAt('danh_gias');
};

exports.down = async function down(knex) {
  async function dropDeletedAt(tableName) {
    const hasTable = await knex.schema.hasTable(tableName);
    if (!hasTable) return;
    const hasDeletedAt = await knex.schema.hasColumn(tableName, 'deleted_at');
    if (!hasDeletedAt) return;

    const indexName = `${tableName}_deleted_at_index`;
    await knex.schema.alterTable(tableName, (table) => {
      table.dropIndex(['deleted_at'], indexName);
      table.dropColumn('deleted_at');
    });
  }

  await dropDeletedAt('danh_gias');
  await dropDeletedAt('khach_hangs');
  await dropDeletedAt('bien_the_hangs');
  await dropDeletedAt('the_loais');
};

