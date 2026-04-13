function methodOverride(req, _res, next) {
  if (req.body && typeof req.body === 'object' && req.body._method) {
    req.method = String(req.body._method).toUpperCase();
    delete req.body._method;
  }
  next();
}

module.exports = methodOverride;

