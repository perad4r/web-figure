const User = require('../models/User');

async function loadUser(req, res, next) {
  res.locals.user = null;

  if (!req.session?.userId) {
    return next();
  }

  try {
    req.user = await User.query().findById(req.session.userId);
    res.locals.user = req.user || null;
  } catch (error) {
    req.user = null;
    res.locals.user = null;
  }

  return next();
}

module.exports = loadUser;
