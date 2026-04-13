const { PayOS } = require('@payos/node');

function createPayOS() {
  if (String(process.env.PAYOS_ENABLED || '').toLowerCase() !== 'true') return null;

  const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY } = process.env;
  if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) return null;

  return new PayOS({
    clientId: PAYOS_CLIENT_ID,
    apiKey: PAYOS_API_KEY,
    checksumKey: PAYOS_CHECKSUM_KEY,
  });
}

function requirePayOS(payos) {
  if (!payos) {
    const error = new Error('PayOS not configured');
    error.statusCode = 501;
    throw error;
  }
}

async function createPaymentLink(payos, order) {
  requirePayOS(payos);

  const orderCode = Number(order.payos_order_code || Date.now());

  const body = {
    orderCode,
    amount: Math.round(Number(order.gia || 0)),
    description: `DH #${order.id}`,
    returnUrl: process.env.PAYOS_RETURN_URL,
    cancelUrl: `${process.env.PAYOS_CANCEL_URL}/${order.id}`,
    items: (order.details || []).map((d) => ({
      name: d.product?.ten || 'SP',
      quantity: Number(d.so_luong || 1),
      price: Math.round(Number(d.gia || 0)),
    })),
  };

  return payos.paymentRequests.create(body);
}

module.exports = { createPayOS, createPaymentLink };
