const DonHang = require('../models/DonHang');

async function orderHistory(req, res) {
  const orders = await DonHang.query()
    .where('user_id', req.user.id)
    .orderBy('id', 'desc')
    .limit(50);

  return res.render('client/orders/index', {
    title: 'Lịch sử đơn hàng',
    orders,
    statusLabel: (s) => {
      const map = {
        [DonHang.STATUS.UNPAID]: 'unpaid',
        [DonHang.STATUS.PAID]: 'paid',
        [DonHang.STATUS.CANCELLED]: 'cancelled',
        [DonHang.STATUS.SHIPPING]: 'shipping',
        [DonHang.STATUS.RECEIVED]: 'received',
      };
      return map[s] || String(s);
    },
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

  return res.render('client/orders/show', {
    title: `Đơn hàng #${order.id}`,
    order,
    statusLabel: (s) => {
      const map = {
        [DonHang.STATUS.UNPAID]: 'unpaid',
        [DonHang.STATUS.PAID]: 'paid',
        [DonHang.STATUS.CANCELLED]: 'cancelled',
        [DonHang.STATUS.SHIPPING]: 'shipping',
        [DonHang.STATUS.RECEIVED]: 'received',
      };
      return map[s] || String(s);
    },
  });
}

async function cancelOrder(req, res) {
  const id = Number(req.params.id);
  const order = await DonHang.query().findById(id);
  if (!order || order.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if ([DonHang.STATUS.CANCELLED, DonHang.STATUS.RECEIVED].includes(order.status)) {
    return res.status(400).json({ error: 'Cannot cancel' });
  }

  await order.$query().patch({ status: DonHang.STATUS.CANCELLED });
  return res.json({ ok: true });
}

async function markReceived(req, res) {
  const id = Number(req.params.id);
  const order = await DonHang.query().findById(id);
  if (!order || order.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== DonHang.STATUS.SHIPPING) {
    return res.status(400).json({ error: 'Not in shipping status' });
  }

  await order.$query().patch({ status: DonHang.STATUS.RECEIVED });
  return res.json({ ok: true });
}

module.exports = {
  orderHistory,
  orderDetail,
  cancelOrder,
  markReceived,
};
