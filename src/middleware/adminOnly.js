/**
 * Chỉ cho phép admin (role=0) truy cập.
 * Khác với isAdmin (cho phép cả staff).
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 0) {
    return next();
  }

  if (req.path.startsWith('/api') || req.xhr) {
    return res.status(403).json({ error: 'Chỉ admin mới có quyền thực hiện' });
  }

  return res.status(403).render('errors/403');
}

module.exports = adminOnly;

