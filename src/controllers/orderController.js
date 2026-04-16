const DonHang = require('../models/DonHang');
const { statusLabel, statusBadge } = require('../helpers/statusHelper');
const { getKnex } = require('../config/database');

async function orderHistory(req, res) {
  const orders = await DonHang.query()
    .where('user_id', req.user.id)
    .orderBy('id', 'desc')
    .limit(50);

  return res.render('client/orders/index', {
    title: 'Lịch sử đơn hàng',
    orders,
    statusLabel,
    statusBadge,
  });
}

async function orderDetail(req, res) {
  const id = Number(req.params.id);
  const order = await DonHang.query()
    .findById(id)
    .withGraphFetched('details.[product, color, size]');

  if (!order || order.user_id !== req.user.id) {
    return res.status(404).render('client/errors/404', { title: 'Not Found' });
  }

  const payosEnabled = String(process.env.PAYOS_ENABLED || '').toLowerCase() === 'true';

  return res.render('client/orders/show', {
    title: `Đơn hàng #${order.id}`,
    order,
    statusLabel,
    statusBadge,
    payosEnabled,
  });
}

async function cancelOrder(req, res) {
  const id = Number(req.params.id);
  const order = await DonHang.query().findById(id);
  if (!order || order.user_id !== req.user.id) {
    req.flash('danger', 'Không tìm thấy đơn hàng.');
    return res.redirect('/lich-su-don-hang');
  }

  if ([DonHang.STATUS.CANCELLED, DonHang.STATUS.RECEIVED, DonHang.STATUS.SHIPPING].includes(order.status)) {
    req.flash('danger', 'Không thể huỷ đơn hàng này vì đơn đã được xử lý hoặc đang giao.');
    return res.redirect(`/lich-su-don-hang/${id}`);
  }

  const knex = getKnex();
  await knex.transaction(async (trx) => {
    await order.$query(trx).patch({ status: DonHang.STATUS.CANCELLED });
  });

  req.flash('success', 'Đã huỷ đơn hàng thành công.');
  return res.redirect(`/lich-su-don-hang/${id}`);
}

async function markReceived(req, res) {
  const id = Number(req.params.id);
  const order = await DonHang.query().findById(id);
  if (!order || order.user_id !== req.user.id) {
    req.flash('danger', 'Không tìm thấy đơn hàng.');
    return res.redirect('/lich-su-don-hang');
  }

  if (order.status !== DonHang.STATUS.SHIPPING) {
    req.flash('danger', 'Chỉ có thể xác nhận đã nhận cho đơn đang giao.');
    return res.redirect(`/lich-su-don-hang/${id}`);
  }

  await order.$query().patch({ status: DonHang.STATUS.RECEIVED });
  req.flash('success', 'Đã xác nhận nhận hàng.');
  return res.redirect(`/lich-su-don-hang/${id}`);
}

module.exports = {
  orderHistory,
  orderDetail,
  cancelOrder,
  markReceived,
};
