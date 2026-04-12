const session = require('express-session');
const { ConnectSessionKnexStore } = require('connect-session-knex');

function createSessionMiddleware(knex) {
  return session({
    store: new ConnectSessionKnexStore({
      knex,
      tableName: 'sessions',
      createTable: false,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

module.exports = { createSessionMiddleware };
