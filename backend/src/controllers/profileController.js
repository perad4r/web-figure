const User = require('../models/User');

async function editProfile(req, res) {
  return res.render('client/profile/edit', {
    title: 'Hồ sơ',
    user: req.user,
    error: null,
  });
}

async function updateProfile(req, res) {
  const { ten, phone, address } = req.body || {};
  if (!ten) {
    return res.status(400).render('client/profile/edit', {
      title: 'Hồ sơ',
      user: req.user,
      error: 'Thiếu tên.',
    });
  }

  const updated = await User.query().patchAndFetchById(req.user.id, {
    ten,
    phone: phone || null,
    address: address || null,
  });

  req.user = updated;
  res.locals.user = updated;

  return res.redirect('/ho-so');
}

module.exports = { editProfile, updateProfile };

