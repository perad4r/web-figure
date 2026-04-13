const DonHang = require('../../models/DonHang');
const { createPayOS, createPaymentLink } = require('../../services/payosService');
const { statusLabel, statusBadge } = require('../../helpers/statusHelper');
const { deductStock, restoreStock } = require('../../services/inventoryService');
const { getKnex } = require('../../config/database');

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
    title: 'Đơn hàng',
    rows,
    status,
    q,
    page,
    pageSize,
    hasNext,
    statusLabel,
    statusBadge,
  });
}

async function show(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query()
    .findById(id)
    .withGraphFetched('[user, details.[product, color, size]]');

  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  return res.render('admin/orders/show', {
    title: `Đơn hàng #${row.id}`,
    row,
    statusOptions: DonHang.STATUS,
    payosEnabled: String(process.env.PAYOS_ENABLED || '').toLowerCase() === 'true',
    statusLabel,
    statusBadge,
  });
}

async function updateStatus(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Không tìm thấy' });

  const newStatus = Number(req.body.status);
  const oldStatus = row.status;
  const isStaffRole = req.user?.role === 2;

  if (isStaffRole) {
    const allowed = (oldStatus === DonHang.STATUS.SHIPPING && newStatus === DonHang.STATUS.RECEIVED);
    const allowCancel = (oldStatus === DonHang.STATUS.UNPAID && newStatus === DonHang.STATUS.CANCELLED);
    if (!allowed && !allowCancel) {
      req.flash('danger', 'Nhân viên không có quyền thực hiện thao tác này');
      return res.redirect(`/admin/orders/${row.id}`);
    }
  }

  const knex = getKnex();
  await knex.transaction(async (trx) => {
    if (
      newStatus === DonHang.STATUS.SHIPPING
      && (oldStatus === DonHang.STATUS.UNPAID || oldStatus === DonHang.STATUS.PAID)
    ) {
      await deductStock(id, trx);
    }

    if (newStatus === DonHang.STATUS.CANCELLED && oldStatus === DonHang.STATUS.SHIPPING) {
      await restoreStock(id, trx);
    }

    await row.$query(trx).patch({ status: newStatus });
  });

  req.flash('success', 'Đã cập nhật trạng thái đơn hàng');
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

async function detailPartial(req, res) {
  const id = Number(req.params.id);
  const row = await DonHang.query()
    .findById(id)
    .withGraphFetched('[user, details.[product, color, size]]');

  if (!row) return res.status(404).json({ error: 'Không tìm thấy' });

  return res.render('admin/orders/_detail_partial', {
    row,
    statusLabel,
    statusBadge,
    statusOptions: DonHang.STATUS,
    isAdminRole: req.user?.role === 0,
  });
}

module.exports = {
  index,
  show,
  updateStatus,
  payosCheckout,
  detailPartial,
};
