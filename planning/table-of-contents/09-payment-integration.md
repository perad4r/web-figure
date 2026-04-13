# Chapter 9 — Payment Integration (PayOS)

## Source Reference

- `PayOsService.php` — PayOS API wrapper
- `PayOsPaymentController.php` — Checkout, return, cancel handlers
- `PayOsWebhookController.php` — Webhook receiver

## PayOS Node.js SDK

PayOS provides an official Node.js SDK: `@payos/node`

```bash
npm install @payos/node
```

---

## Environment Variables

```env
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx
PAYOS_RETURN_URL=https://domain.com/thanh-toan/payos/return
PAYOS_CANCEL_URL=https://domain.com/thanh-toan/payos/cancel
```

---

## Service: `services/payosService.js`

```js
const PayOS = require('@payos/node');

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

async function createPaymentLink(order) {
  const orderCode = Date.now(); // or order.id
  const body = {
    orderCode,
    amount: Math.round(order.gia),
    description: `DH #${order.id}`,
    returnUrl: process.env.PAYOS_RETURN_URL,
    cancelUrl: `${process.env.PAYOS_CANCEL_URL}/${order.id}`,
    items: order.details.map(d => ({
      name: d.hang?.ten || 'SP',
      quantity: d.so_luong,
      price: Math.round(d.gia),
    })),
  };
  return payos.createPaymentLink(body);
}

module.exports = { payos, createPaymentLink };
```

---

## Routes (`routes/payment.js`)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/thanh-toan/payos/:orderId` | `paymentController.checkout` |
| GET | `/thanh-toan/payos/return` | `paymentController.handleReturn` |
| GET | `/thanh-toan/payos/cancel/:orderId?` | `paymentController.handleCancel` |
| POST | `/thanh-toan/payos/webhook` | `paymentController.webhook` |

---

## Controller: `controllers/paymentController.js`

### `checkout(req, res)`

1. Find order by ID, verify user owns it
2. If already has `payos_checkout_url` → redirect there
3. Else → call `createPaymentLink(order)`
4. Save `payos_order_code`, `payos_payment_link_id`, `payos_checkout_url` to order
5. Redirect user to PayOS checkout URL

### `handleReturn(req, res)`

1. Verify signature from query params
2. Find order by `payos_order_code`
3. If paid → `order.markAsPaidWithInventory()`
4. Redirect to order detail with success flash

### `handleCancel(req, res)`

1. Find order
2. Optionally update PayOS status
3. Redirect to order detail

### `webhook(req, res)`

1. Verify webhook signature
2. Parse payment result
3. Update order status accordingly
4. Return 200 OK

---

## Webhook Security

Must verify PayOS signature on every webhook call.
PayOS SDK provides `payos.verifyPaymentWebhookData(webhookData)`.

Use raw body parser for webhook route:

```js
app.post('/thanh-toan/payos/webhook', 
  express.raw({ type: 'application/json' }),
  paymentController.webhook
);
```
