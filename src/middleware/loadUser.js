const User = require('../models/User');
const GioHang = require('../models/GioHang');

async function loadUser(req, res, next) {
  res.locals.user = null;
  res.locals.cartCount = 0;

  if (!req.session?.userId) {
    return next();
  }

  try {
    req.user = await User.query().findById(req.session.userId);
    res.locals.user = req.user || null;
    if (req.user) {
      const row = await GioHang.query()
        .where('user_id', req.user.id)
        .count({ c: '*' })
        .first();
      res.locals.cartCount = Number(row?.c || 0);
    }
  } catch (error) {
    req.user = null;
    res.locals.user = null;
  }

  return next();
}

module.exports = loadUser;
