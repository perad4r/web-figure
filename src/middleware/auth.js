function isAuthenticated(req, res, next) {
  if (req.session?.userId) return next();

  if (req.path.startsWith('/api')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.redirect('/dang-nhap');
}

module.exports = isAuthenticated;

