function flash(req, res, next) {
  const current = req.session?.flash || null;
  if (req.session) req.session.flash = null;

  res.locals.flash = current;

  req.flash = (type, message) => {
    if (!req.session) return;
    req.session.flash = { type, message };
  };

  next();
}

module.exports = flash;

