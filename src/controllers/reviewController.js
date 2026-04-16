const DanhGia = require('../models/DanhGia');
const DonHang = require('../models/DonHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');

function getSafeReturnPath(hangId, returnUrl) {
  const fallback = hangId ? `/san-pham/${hangId}` : '/';
  if (!returnUrl || typeof returnUrl !== 'string') return fallback;
  if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) return fallback;
  return returnUrl;
}

async function submitReview(req, res) {
  const hangId = Number(req.body.hang_id);
  const maDon = req.body.ma_don ? Number(req.body.ma_don) : null;
  const rating = req.body.rating !== undefined && req.body.rating !== '' ? Number(req.body.rating) : null;
  const content = String(req.body.danh_gia || '').trim();
  const returnUrl = getSafeReturnPath(hangId, req.body.return_url);

  if (!hangId || !content) {
    req.flash('danger', 'Thiếu thông tin đánh giá.');
    return res.redirect(returnUrl);
  }

  if (rating !== null && (Number.isNaN(rating) || rating < 1 || rating > 5)) {
    req.flash('danger', 'Điểm đánh giá phải từ 1 đến 5.');
    return res.redirect(returnUrl);
  }

  const purchased = await ChiTietDonHang.query()
    .joinRelated('order')
    .where('order.user_id', req.user.id)
    .where('order.status', DonHang.STATUS.RECEIVED)
    .where('chi_tiet_don_hangs.hang_id', hangId)
    .first();

  if (!purchased) {
    req.flash('danger', 'Bạn chỉ có thể đánh giá sản phẩm đã mua và đã nhận hàng.');
    return res.redirect(returnUrl);
  }

  await DanhGia.query().insert({
    danh_gia: content,
    ma_don: maDon,
    user_id: req.user.id,
    hang_id: hangId,
    rating,
  });

  req.flash('success', 'Đã gửi đánh giá.');
  return res.redirect(returnUrl);
}

module.exports = { submitReview };
