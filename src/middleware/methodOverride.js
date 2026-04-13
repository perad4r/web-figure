function methodOverride(req, _res, next) {
  if (req.method !== 'POST') {
    return next();
  }

  const override =
    req.query?._method ||
    req.body?._method ||
    req.headers['x-http-method-override'];

  if (override) {
    req.method = String(override).toUpperCase();

    if (req.body && typeof req.body === 'object' && req.body._method) {
      delete req.body._method;
    }
  }

  next();
}

module.exports = methodOverride;
