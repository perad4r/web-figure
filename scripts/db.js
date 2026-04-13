#!/usr/bin/env node
const {
  createDb,
  ping,
  listTables,
  countRows,
  runSql,
  resetDatabase,
} = require('./db-tool');

function usage() {
  // eslint-disable-next-line no-console
  console.log(`Usage:
  npm run db -- ping
  npm run db -- tables
  npm run db -- count <table>
  npm run db -- sql "<SQL>"
  npm run db -- reset --yes
`);
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  if (!cmd) {
    usage();
    process.exit(2);
  }

  const db = createDb();
  try {
    if (cmd === 'ping') {
      await ping(db);
      // eslint-disable-next-line no-console
      console.log('ok');
      return;
    }

    if (cmd === 'tables') {
      const tables = await listTables(db);
      // eslint-disable-next-line no-console
      console.log(tables.join('\n'));
      return;
    }

    if (cmd === 'count') {
      const table = argv[1];
      if (!table) {
        usage();
        process.exit(2);
      }
      const n = await countRows(db, table);
      // eslint-disable-next-line no-console
      console.log(String(n));
      return;
    }

    if (cmd === 'sql') {
      const sql = argv.slice(1).join(' ').trim();
      if (!sql) {
        usage();
        process.exit(2);
      }
      const result = await runSql(db, sql);
      // eslint-disable-next-line no-console
      console.dir(result, { depth: 5 });
      return;
    }

    if (cmd === 'reset') {
      await resetDatabase(db, { yes: hasFlag(argv, '--yes') });
      // eslint-disable-next-line no-console
      console.log('reset done');
      return;
    }

    usage();
    process.exit(2);
  } finally {
    await db.destroy();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err?.stack || err);
  process.exit(1);
});

