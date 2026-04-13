const path = require('path');
const { knex } = require('knex');

function loadEnv() {
  // Load .env explicitly so running from other CWDs works too.
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

function getKnexConfig() {
  loadEnv();
  // eslint-disable-next-line global-require
  const knexfile = require('../knexfile');
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return knexfile[env];
}

function createDb() {
  const config = getKnexConfig();
  return knex(config);
}

async function ping(db) {
  await db.raw('SELECT 1 as ok');
  return true;
}

async function listTables(db) {
  const rows = await db
    .raw(
      `
      SELECT TABLE_NAME as name
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
      `,
    )
    .then((r) => r[0] || r);

  return rows.map((r) => r.name);
}

async function countRows(db, table) {
  const row = await db(table).count({ c: '*' }).first();
  return Number(row?.c || 0);
}

async function runSql(db, sql) {
  return db.raw(sql);
}

async function resetDatabase(db, { yes = false } = {}) {
  const dbName = String(process.env.DB_DATABASE || '');
  if (dbName !== 'figurevn') {
    throw new Error(`Refusing reset: DB_DATABASE must be "figurevn" (got "${dbName}")`);
  }
  if (!yes) throw new Error('Refusing reset: pass --yes');

  const tables = await listTables(db);

  await db.raw('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    await db.raw(`DROP TABLE IF EXISTS \`${t}\``);
  }
  await db.raw('SET FOREIGN_KEY_CHECKS = 1');

  await db.migrate.latest();
  await db.seed.run();
}

module.exports = {
  createDb,
  ping,
  listTables,
  countRows,
  runSql,
  resetDatabase,
};
