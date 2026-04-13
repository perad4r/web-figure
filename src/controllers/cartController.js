const GioHang = require('../models/GioHang');
const BienTheHang = require('../models/BienTheHang');
const DonHang = require('../models/DonHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');
const KhachHang = require('../models/KhachHang');
const { getKnex } = require('../config/database');

async function cartPage(req, res) {
  const items = await GioHang.query()
    .where('gio_hangs.user_id', req.user.id)
    .withGraphFetched('variant.[product, color, size]')
    .orderBy('gio_hangs.id', 'desc');

  const total = items.reduce((sum, item) => {
    const price = Number(item.variant?.gia || 0);
    const qty = Number(item.so_luong || 0);
    return sum + price * qty;
  }, 0);

  return res.render('client/cart/index', {
    title: 'Giỏ hàng',
    items,
    total,
    error: null,
  });
}

function prefersHtml(req) {
  const accept = String(req.headers.accept || '');
  return accept.includes('text/html') || accept.includes('*/*');
}

async function addToCart(req, res) {
  const variantId = Number(req.body.variant_id);
  const qty = Math.max(1, Number(req.body.so_luong || 1));

  const variant = await BienTheHang.query().findById(variantId);
  if (!variant) {
    return res.status(404).json({ error: 'Variant not found' });
  }

  const existing = await GioHang.query()
    .where({ user_id: req.user.id, chi_tiet_don_hang_id: variantId })
    .first();

  if (existing) {
    const newQty = Number(existing.so_luong) + qty;
    await existing.$query().patch({ so_luong: newQty });
    if (prefersHtml(req)) return res.redirect('/giohangs');
    return res.json({ ok: true, id: existing.id, so_luong: newQty });
  }

  const row = await GioHang.query().insert({
    user_id: req.user.id,
    chi_tiet_don_hang_id: variantId,
    so_luong: qty,
  });

  if (prefersHtml(req)) return res.redirect('/giohangs');
  return res.json({ ok: true, id: row.id, so_luong: row.so_luong });
}

async function updateQty(req, res) {
  const id = Number(req.params.id);
  const qty = Math.max(1, Number(req.body.so_luong || 1));

  const item = await GioHang.query().findById(id);
  if (!item || item.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  await item.$query().patch({ so_luong: qty });
  if (prefersHtml(req)) return res.redirect('/giohangs');
  return res.json({ ok: true });
}

async function removeItem(req, res) {
  const id = Number(req.params.id);
  const item = await GioHang.query().findById(id);
  if (!item || item.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  await GioHang.query().deleteById(id);
  if (prefersHtml(req)) return res.redirect('/giohangs');
  return res.json({ ok: true });
}

async function checkout(req, res) {
  const knex = getKnex();

  const { ten_khach_hang, dia_chi, phone, email, ghi_chu } = req.body || {};
  if (!ten_khach_hang || !dia_chi || !phone) {
    const items = await GioHang.query()
      .where('gio_hangs.user_id', req.user.id)
      .withGraphFetched('variant.[product, color, size]')
      .orderBy('gio_hangs.id', 'desc');

    const total = items.reduce((sum, item) => {
      const price = Number(item.variant?.gia || 0);
      const qty = Number(item.so_luong || 0);
      return sum + price * qty;
    }, 0);

    return res.status(400).render('client/cart/index', {
      title: 'Giỏ hàng',
      items,
      total,
      error: 'Thiếu thông tin checkout (tên/địa chỉ/sđt).',
    });
  }

  const cartItems = await GioHang.query()
    .where('gio_hangs.user_id', req.user.id)
    .withGraphFetched('variant.[product, color, size]');

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart empty' });
  }

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.variant?.gia || 0);
    const qty = Number(item.so_luong || 0);
    return sum + price * qty;
  }, 0);

  const order = await knex.transaction(async (trx) => {
    const created = await DonHang.query(trx).insert({
      user_id: req.user.id,
      ten_khach_hang,
      dia_chi,
      phone,
      email: email || null,
      gia: total,
      status: DonHang.STATUS.UNPAID,
      ghi_chu: ghi_chu || null,
    });

    const details = cartItems.map((item) => ({
      don_hang_id: created.id,
      hang_id: item.variant.hang_id,
      mau_id: item.variant.mau_id,
      kich_co_id: item.variant.kich_co_id,
      so_luong: item.so_luong,
      gia: item.variant.gia,
      created_at: trx.fn.now(),
      updated_at: trx.fn.now(),
    }));

    await ChiTietDonHang.query(trx).insert(details);

    const customer = await KhachHang.query(trx)
      .where('ma_user', req.user.id)
      .first();
    if (!customer) {
      await KhachHang.query(trx).insert({
        ten: ten_khach_hang,
        sdt: phone,
        email: email || null,
        dia_chi,
        ma_user: req.user.id,
      });
    } else {
      await customer.$query(trx).patch({
        ten: ten_khach_hang,
        sdt: phone,
        email: email || null,
        dia_chi,
      });
    }

    await GioHang.query(trx).delete().where('user_id', req.user.id);

    return created;
  });

  return res.redirect(`/lich-su-don-hang/${order.id}`);
}

module.exports = {
  cartPage,
  addToCart,
  updateQty,
  removeItem,
  checkout,
};
