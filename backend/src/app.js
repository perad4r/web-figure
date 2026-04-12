require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { initDatabase } = require('./config/database');
const { createSessionMiddleware } = require('./config/session');
const loadUser = require('./middleware/loadUser');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const methodOverride = require('./middleware/methodOverride');
app.use(methodOverride);

const knex = initDatabase();
app.use(createSessionMiddleware(knex));
app.use(loadUser);

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`web-figure backend listening on :${port}`);
});
