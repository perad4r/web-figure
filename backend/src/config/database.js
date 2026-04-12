const { knex } = require('knex');
const { Model } = require('objection');

function createKnex() {
  return knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: { min: 0, max: 10 },
  });
}

let knexInstance;

function initDatabase() {
  if (!knexInstance) {
    knexInstance = createKnex();
    Model.knex(knexInstance);
  }
  return knexInstance;
}

function getKnex() {
  if (!knexInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return knexInstance;
}

module.exports = { initDatabase, getKnex };
