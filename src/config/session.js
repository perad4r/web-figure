const session = require('express-session');
const { ConnectSessionKnexStore } = require('connect-session-knex');

function createSessionMiddleware(knex) {
  const secret =
    process.env.SESSION_SECRET ||
    (process.env.NODE_ENV === 'production' ? null : 'dev-session-secret-change-me');
  if (!secret) {
    throw new Error('SESSION_SECRET is required in production');
  }

  return session({
    store: new ConnectSessionKnexStore({
      knex,
      tableName: 'sessions',
      createTable: false,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

module.exports = { createSessionMiddleware };
