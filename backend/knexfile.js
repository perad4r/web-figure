require('dotenv').config();

const baseConfig = {
  client: 'mysql2',
  pool: { min: 0, max: 10 },
  migrations: {
    directory: './src/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/seeds',
  },
};

function connectionFromEnv() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
}

module.exports = {
  development: { ...baseConfig, connection: connectionFromEnv() },
  production: { ...baseConfig, connection: connectionFromEnv() },
};
