const BienTheHang = require('../../models/BienTheHang');
const Hang = require('../../models/Hang');
const Mau = require('../../models/Mau');
const KichCo = require('../../models/KichCo');
const { getKnex } = require('../../config/database');

async function withSelectedOption(options, id, loader, labelKey = 'ten') {
  if (!id) return options;
  const exists = options.some((o) => Number(o.id) === Number(id));
  if (exists) return options;
  const row = await loader(Number(id));
  if (!row) return options;
  return [{ ...row, _softDeleted: true, [labelKey]: `[DELETED] ${row[labelKey]}` }, ...options];
}

async function syncParentStock(hangId) {
  if (!hangId) return;
  const parent = await Hang.queryWithDeleted().findById(hangId);
  if (parent) {
    await parent.syncStockFromVariants();
  }
}

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const hangId = req.query.hang_id ? Number(req.query.hang_id) : null;
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const offset = (page - 1) * pageSize;

  const products = await Hang.query().orderBy('id', 'desc');

  const query = showDeleted ? BienTheHang.queryWithDeleted() : BienTheHang.query();
  if (showDeleted) query.whereNotNull('deleted_at');

  query
    .withGraphFetched('[product, color, size]')
    .orderBy('id', 'desc')
    .offset(offset)
    .limit(pageSize + 1);
  if (hangId) query.where('hang_id', hangId);

  const rowsPlus = await query;
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/variants/index', {
    title: 'Variants',
    rows,
    products,
    showDeleted,
    hangId,
    page,
    pageSize,
    hasNext,
  });
}

async function newForm(req, res) {
  const [products, colors, sizes] = await Promise.all([
    Hang.query().orderBy('id', 'desc'),
    Mau.query().orderBy('id', 'desc'),
    KichCo.query().orderBy('id', 'desc'),
  ]);

  return res.render('admin/variants/new', {
    title: 'New Variant',
    products,
    colors,
    sizes,
    error: null,
  });
}

async function create(req, res) {
  const hang_id = Number(req.body.hang_id || 0);
  const mau_id = Number(req.body.mau_id || 0);
  const kich_co_id = Number(req.body.kich_co_id || 0);
  const gia = Number(req.body.gia || 0);
  const ton_kho = Number(req.body.ton_kho || 0);

  const [products, colors, sizes] = await Promise.all([
    Hang.query().orderBy('id', 'desc'),
    Mau.query().orderBy('id', 'desc'),
    KichCo.query().orderBy('id', 'desc'),
  ]);

  if (!hang_id || !mau_id || !kich_co_id) {
    return res.status(400).render('admin/variants/new', {
      title: 'New Variant',
      products,
      colors,
      sizes,
      error: 'Missing product/color/size',
    });
  }

  const hinh_anh = req.file ? `variants/${req.file.filename}` : null;

  await BienTheHang.query().insert({
    hang_id,
    mau_id,
    kich_co_id,
    hinh_anh,
    gia,
    ton_kho,
  });

  await syncParentStock(hang_id);

  req.flash('success', 'Variant created');
  return res.redirect(`/admin/variants?hang_id=${hang_id}`);
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await BienTheHang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  let [products, colors, sizes] = await Promise.all([
    Hang.query().orderBy('id', 'desc'),
    Mau.query().orderBy('id', 'desc'),
    KichCo.query().orderBy('id', 'desc'),
  ]);

  products = await withSelectedOption(products, row.hang_id, (rid) => Hang.queryWithDeleted().findById(rid));
  colors = await withSelectedOption(colors, row.mau_id, (rid) => Mau.queryWithDeleted().findById(rid));
  sizes = await withSelectedOption(sizes, row.kich_co_id, (rid) => KichCo.queryWithDeleted().findById(rid));

  return res.render('admin/variants/edit', {
    title: 'Edit Variant',
    row,
    products,
    colors,
    sizes,
    error: null,
  });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await BienTheHang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const hang_id = Number(req.body.hang_id || 0);
  const mau_id = Number(req.body.mau_id || 0);
  const kich_co_id = Number(req.body.kich_co_id || 0);
  const gia = Number(req.body.gia || 0);
  const ton_kho = Number(req.body.ton_kho || 0);

  const [products, colors, sizes] = await Promise.all([
    Hang.query().orderBy('id', 'desc'),
    Mau.query().orderBy('id', 'desc'),
    KichCo.query().orderBy('id', 'desc'),
  ]);

  if (!hang_id || !mau_id || !kich_co_id) {
    return res.status(400).render('admin/variants/edit', {
      title: 'Edit Variant',
      row,
      products,
      colors,
      sizes,
      error: 'Missing product/color/size',
    });
  }

  const patch = { hang_id, mau_id, kich_co_id, gia, ton_kho };
  if (req.file) patch.hinh_anh = `variants/${req.file.filename}`;

  await row.$query().patch(patch);
  if (row.hang_id !== hang_id) {
    await syncParentStock(row.hang_id);
  }
  await syncParentStock(hang_id);
  req.flash('success', 'Variant updated');
  return res.redirect(`/admin/variants?hang_id=${hang_id}`);
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const row = await BienTheHang.queryWithDeleted().findById(id);
  if (!row) return res.redirect('/admin/variants');

  const knex = getKnex();
  await knex('bien_the_hangs').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  await syncParentStock(row.hang_id);
  req.flash('success', 'Variant deleted');
  return res.redirect(`/admin/variants?hang_id=${row.hang_id}`);
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const row = await BienTheHang.queryWithDeleted().findById(id);
  if (!row) return res.redirect('/admin/variants?deleted=1');

  const knex = getKnex();
  await knex('bien_the_hangs').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  await syncParentStock(row.hang_id);
  req.flash('success', 'Variant restored');
  return res.redirect('/admin/variants?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
