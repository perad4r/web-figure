#!/bin/sh
set -e

echo "[entrypoint] waiting for mysql..."
node - <<'NODE'
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

if (!host || !user || !database) {
  console.error('[entrypoint] missing DB env vars (DB_HOST/DB_USERNAME/DB_DATABASE)');
  process.exit(1);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const maxAttempts = 60;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const conn = await mysql.createConnection({ host, port, user, password, database });
      await conn.query('SELECT 1');
      await conn.end();
      console.log('[entrypoint] mysql ok');
      return;
    } catch (err) {
      console.log(`[entrypoint] mysql not ready (${attempt}/${maxAttempts}): ${err.code || err.message}`);
      await sleep(1000);
    }
  }

  console.error('[entrypoint] mysql never became ready');
  process.exit(1);
}

main();
NODE

echo "[entrypoint] running migrations..."
npm run migrate

echo "[entrypoint] running seeds..."
npm run seed

echo "[entrypoint] starting app: $*"
exec "$@"
