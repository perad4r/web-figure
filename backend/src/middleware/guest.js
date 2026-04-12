function isGuest(req, res, next) {
  if (req.session?.userId) {
    return res.redirect('/');
  }
  return next();
}

module.exports = isGuest;

