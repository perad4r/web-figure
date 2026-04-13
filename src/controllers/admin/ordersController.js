const DonHang = require('../../models/DonHang');
const { createPayOS, createPaymentLink } = require('../../services/payosService');

async function index(req, res) {
  const status = req.query.status !== undefined && req.query.status !== '' ? Number(req.query.status) : null;
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(200, Math.max(1, Number(req.query.pageSize || 50)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = DonHang.query().withGraphFetched('user').orderBy('id', 'desc').offset(offset).limit(pageSize + 1);
  if (status !== null && !Number.isNaN(status)) query.where('status', status);
  if (q) query.where('id', Number(q) || -1);

  const rowsPlus = await query;
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/orders/index', {
    title: 'Orders',
    rows,
    status,
    q,
    page,
    pageSize,
    hasNext,
  });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query()
    .findById(id)
    .withGraphFetched('[user, details.[product, color, size]]');

  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/orders/show', {
    title: `Order #${row.id}`,
    row,
    statusOptions: DonHang.STATUS,
    payosEnabled: String(process.env.PAYOS_ENABLED || '').toLowerCase() === 'true',
  });
}

async function updateStatus(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const status = Number(req.body.status);
  await row.$query().patch({ status });
  req.flash('success', 'Order status updated');
  return res.redirect(`/admin/orders/${row.id}`);
}

async function payosCheckout(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query()
    .findById(id)
    .withGraphFetched('details.[product]');
  if (!row) return res.status(404).json({ error: 'Order not found' });

  if (row.payos_checkout_url) return res.redirect(row.payos_checkout_url);

  const payos = createPayOS();
  if (!payos) return res.status(501).json({ error: 'PayOS not configured (set PAYOS_ENABLED=true)' });
  const link = await createPaymentLink(payos, row);

  await row.$query().patch({
    payos_order_code: link.orderCode,
    payos_payment_link_id: link.paymentLinkId,
    payos_checkout_url: link.checkoutUrl,
    payos_status: link.status || 'CREATED',
  });

  return res.redirect(link.checkoutUrl);
}

module.exports = { index, show, updateStatus, payosCheckout };
