function isAdmin(req, res, next) {
  if (req.user && (req.user.role === 0 || req.user.role === 2)) {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(403).render('errors/403');
}

module.exports = isAdmin;

