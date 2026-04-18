require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { initDatabase } = require('./config/database');
const { createSessionMiddleware } = require('./config/session');
const loadUser = require('./middleware/loadUser');
const loadCategories = require('./middleware/loadCategories');
const routes = require('./routes');

const app = express();

['products', 'variants', 'home'].forEach((subdir) => {
  fs.mkdirSync(path.join(__dirname, '..', 'public', 'uploads', subdir), { recursive: true });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  helmet({
    // We apply CSP separately (strict vs Cloudflare) to avoid breaking
    // Cloudflare-injected scripts when serving via a tunnel/proxy.
    contentSecurityPolicy: false,
  }),
);

const baseCspDirectives = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'self'"],
  'script-src': [
    "'self'",
    'https://cdn.jsdelivr.net',
    'https://code.jquery.com',
    'https://static.cloudflareinsights.com',
  ],
  'script-src-elem': [
    "'self'",
    'https://cdn.jsdelivr.net',
    'https://code.jquery.com',
    'https://static.cloudflareinsights.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net', 'data:', 'https://cdnjs.cloudflare.com'],
  'img-src': ["'self'", 'data:', 'https:', 'http:'],
  'connect-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://cloudflareinsights.com'],
  'worker-src': ["'self'", 'blob:'],
  // Some older browsers treat workers as child-src.
  'child-src': ["'self'", 'blob:'],
};

const strictCsp = helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: baseCspDirectives,
});

const cloudflareCsp = helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    ...baseCspDirectives,
    // Cloudflare (Insights/Zaraz/etc.) may inject inline scripts; allow them only when behind CF.
    'script-src': [...baseCspDirectives['script-src'], "'unsafe-inline'"],
    'script-src-elem': [...baseCspDirectives['script-src-elem'], "'unsafe-inline'"],
  },
});

app.use((req, res, next) => {
  const isCloudflare = Boolean(req.headers['cf-ray'] || req.headers['cf-connecting-ip']);
  return (isCloudflare ? cloudflareCsp : strictCsp)(req, res, next);
});
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const methodOverride = require('./middleware/methodOverride');
app.use(methodOverride);

const knex = initDatabase();
app.use(createSessionMiddleware(knex));
const flash = require('./middleware/flash');
app.use(flash);
app.use(loadUser);
app.use(loadCategories);

app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use('/favicons', express.static(path.join(__dirname, '..', 'public', 'favicons')));
app.get('/favicon.ico', (req, res) => res.redirect(302, '/favicons/favicon.ico'));

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
app.use('/assets', express.static(assetsDir));
app.use('/vendor/swiper', express.static(path.join(__dirname, '..', 'node_modules', 'swiper')));

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = { app, knex };
