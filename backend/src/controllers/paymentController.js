const DonHang = require('../models/DonHang');
const { createPayOS, createPaymentLink } = require('../services/payosService');

function handlePayosError(res, error) {
  const status = error.statusCode || 500;
  return res.status(status).json({ error: error.message || 'PayOS error' });
}

async function checkout(req, res) {
  try {
    const orderId = Number(req.params.orderId);
    const order = await DonHang.query()
      .findById(orderId)
      .withGraphFetched('details.[product]');

    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.payos_checkout_url) {
      return res.redirect(order.payos_checkout_url);
    }

    const payos = createPayOS();
    const link = await createPaymentLink(payos, order);

    await order.$query().patch({
      payos_order_code: link.orderCode,
      payos_payment_link_id: link.paymentLinkId,
      payos_checkout_url: link.checkoutUrl,
      payos_status: 'CREATED',
    });

    return res.redirect(link.checkoutUrl);
  } catch (error) {
    return handlePayosError(res, error);
  }
}

async function handleReturn(req, res) {
  return res.json({ ok: true, note: 'TODO: verify signature + update order' });
}

async function handleCancel(req, res) {
  return res.json({ ok: true, note: 'TODO: update order cancelled' });
}

async function webhook(req, res) {
  try {
    const payos = createPayOS();
    if (!payos) return res.status(501).json({ error: 'PayOS not configured' });

    const raw = req.body;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const verified = payos.verifyPaymentWebhookData(data);
    return res.json({ ok: true, verified });
  } catch (error) {
    return handlePayosError(res, error);
  }
}

module.exports = { checkout, handleReturn, handleCancel, webhook };

