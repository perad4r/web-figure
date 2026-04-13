const DanhGia = require('../models/DanhGia');

async function submitReview(req, res) {
  const hangId = Number(req.body.hang_id);
  const maDon = req.body.ma_don ? Number(req.body.ma_don) : null;
  const rating = req.body.rating ? Number(req.body.rating) : null;
  const content = String(req.body.danh_gia || '').trim();

  if (!hangId || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  await DanhGia.query().insert({
    ma: null,
    danh_gia: content,
    ma_don: maDon,
    user_id: req.user.id,
    hang_id: hangId,
    rating,
  });

  return res.json({ ok: true });
}

module.exports = { submitReview };

