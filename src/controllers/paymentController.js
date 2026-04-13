const DonHang = require('../models/DonHang');
const PaymentStatusHistory = require('../models/PaymentStatusHistory');
const { createPayOS, createPaymentLink } = require('../services/payosService');
const { deductStock } = require('../services/inventoryService');
const { getKnex } = require('../config/database');

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
    if (!payos) return res.status(501).json({ error: 'PayOS not configured (set PAYOS_ENABLED=true)' });

    const link = await createPaymentLink(payos, order);

    await order.$query().patch({
      payos_order_code: link.orderCode,
      payos_payment_link_id: link.paymentLinkId,
      payos_checkout_url: link.checkoutUrl,
      payos_status: link.status || 'PENDING',
    });

    return res.redirect(link.checkoutUrl);
  } catch (error) {
    return handlePayosError(res, error);
  }
}

async function handleReturn(req, res) {
  try {
    const orderCode = req.query.orderCode ? Number(req.query.orderCode) : null;
    if (!orderCode) return res.status(400).json({ error: 'Missing orderCode' });

    const payos = createPayOS();
    if (!payos) return res.status(501).json({ error: 'PayOS not configured (set PAYOS_ENABLED=true)' });

    const link = await payos.paymentRequests.get(orderCode);
    const order = await DonHang.query().where('payos_order_code', orderCode).first();
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await order.$query().patch({ payos_status: link.status });

    // Option B (per plan): PAID -> SHIPPING (trừ kho), idempotent if already processed.
    if (link.status === 'PAID' && order.status === DonHang.STATUS.UNPAID) {
      const knex = getKnex();
      await knex.transaction(async (trx) => {
        await order.$query(trx).patch({ status: DonHang.STATUS.SHIPPING });
        await deductStock(order.id, trx);
        await PaymentStatusHistory.query(trx).insert({
          don_hang_id: order.id,
          payment_status: 'PAID',
          note: 'PayOS thanh toán thành công - tự động chuyển giao hàng',
          changed_by: null,
        });
      });
    }

    return res.redirect(`/lich-su-don-hang/${order.id}`);
  } catch (error) {
    return handlePayosError(res, error);
  }
}

async function handleCancel(req, res) {
  try {
    const orderId = req.params.orderId ? Number(req.params.orderId) : null;
    if (!orderId) return res.json({ ok: true });

    const order = await DonHang.query().findById(orderId);
    if (order && order.status === DonHang.STATUS.UNPAID) {
      await order.$query().patch({ status: DonHang.STATUS.CANCELLED, payos_status: 'CANCELLED' });
      await PaymentStatusHistory.query().insert({
        don_hang_id: order.id,
        payment_status: 'CANCELLED',
        note: 'PayOS cancel',
        changed_by: null,
      });
    }

    return res.redirect(`/lich-su-don-hang/${orderId}`);
  } catch (error) {
    return handlePayosError(res, error);
  }
}

async function webhook(req, res) {
  try {
    const payos = createPayOS();
    if (!payos) return res.status(501).json({ error: 'PayOS not configured' });

    const raw = req.body;
    const json = Buffer.isBuffer(raw) ? JSON.parse(raw.toString('utf8')) : raw;
    const data = await payos.webhooks.verify(json);

    const order = await DonHang.query().where('payos_order_code', data.orderCode).first();
    if (order) {
      await order.$query().patch({ payos_status: data.code === '00' ? 'PAID' : data.desc });

      // Option B (per plan): PAID -> SHIPPING (trừ kho), idempotent if already processed.
      if (data.code === '00' && order.status === DonHang.STATUS.UNPAID) {
        const knex = getKnex();
        await knex.transaction(async (trx) => {
          await order.$query(trx).patch({ status: DonHang.STATUS.SHIPPING });
          await deductStock(order.id, trx);
          await PaymentStatusHistory.query(trx).insert({
            don_hang_id: order.id,
            payment_status: 'PAID',
            note: 'PayOS thanh toán thành công - tự động chuyển giao hàng (webhook)',
            changed_by: null,
          });
        });
      }
    }

    return res.json({ ok: true });
  } catch (error) {
    return handlePayosError(res, error);
  }
}

module.exports = { checkout, handleReturn, handleCancel, webhook };
