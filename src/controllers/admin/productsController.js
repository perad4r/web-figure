const Hang = require('../../models/Hang');
const TheLoai = require('../../models/TheLoai');
const { getKnex } = require('../../config/database');

async function index(req, res) {
  const showDeleted = String(req.query.deleted || '') === '1';
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const offset = (page - 1) * pageSize;
  const q = String(req.query.q || '').trim();

  const query = showDeleted ? Hang.queryWithDeleted() : Hang.query();

  if (showDeleted) query.whereNotNull('deleted_at');
  if (q) query.where('ten', 'like', `%${q}%`);

  const rowsPlus = await query
    .withGraphFetched('theLoai')
    .orderBy('id', 'desc')
    .offset(offset)
    .limit(pageSize + 1);
  const hasNext = rowsPlus.length > pageSize;
  const rows = hasNext ? rowsPlus.slice(0, pageSize) : rowsPlus;

  return res.render('admin/products/index', { title: 'Products', rows, showDeleted, q, page, pageSize, hasNext });
}

async function newForm(req, res) {
  const categories = await TheLoai.query().orderBy('id', 'desc');
  return res.render('admin/products/new', { title: 'New Product', categories, error: null });
}

async function create(req, res) {
  const ten = String(req.body.ten || '').trim();
  const gia = Number(req.body.gia || 0);
  const ton_kho = Number(req.body.ton_kho || 0);
  const mo_ta = req.body.mo_ta ? String(req.body.mo_ta).trim() : null;
  const the_loai_id = Number(req.body.the_loai_id || 0);

  const categories = await TheLoai.query().orderBy('id', 'desc');

  if (!ten || !the_loai_id) {
    return res.status(400).render('admin/products/new', {
      title: 'New Product',
      categories,
      error: 'Missing name/category',
    });
  }

  const imagePath = req.file ? `products/${req.file.filename}` : (req.body.hinh_anh || null);

  await Hang.queryWithDeleted().insert({
    ten,
    gia,
    ton_kho,
    hinh_anh: imagePath,
    mo_ta,
    the_loai_id,
    deleted_at: null,
  });

  req.flash('success', 'Product created');
  return res.redirect('/admin/products');
}

async function editForm(req, res) {
  const id = Number(req.params.id);
  const row = await Hang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const categories = await TheLoai.query().orderBy('id', 'desc');
  return res.render('admin/products/edit', { title: 'Edit Product', row, categories, error: null });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const row = await Hang.queryWithDeleted().findById(id);
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const ten = String(req.body.ten || '').trim();
  const gia = Number(req.body.gia || 0);
  const ton_kho = Number(req.body.ton_kho || 0);
  const mo_ta = req.body.mo_ta ? String(req.body.mo_ta).trim() : null;
  const the_loai_id = Number(req.body.the_loai_id || 0);

  const categories = await TheLoai.query().orderBy('id', 'desc');
  if (!ten || !the_loai_id) {
    return res.status(400).render('admin/products/edit', {
      title: 'Edit Product',
      row,
      categories,
      error: 'Missing name/category',
    });
  }

  const patch = { ten, gia, ton_kho, mo_ta, the_loai_id };
  if (req.file) patch.hinh_anh = `products/${req.file.filename}`;
  if (req.body.hinh_anh !== undefined && req.body.hinh_anh !== '') patch.hinh_anh = req.body.hinh_anh;

  await row.$query().patch(patch);
  req.flash('success', 'Product updated');
  return res.redirect('/admin/products');
}

async function destroy(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('hangs').where({ id }).update({ deleted_at: knex.fn.now(), updated_at: knex.fn.now() });
  req.flash('success', 'Product deleted');
  return res.redirect('/admin/products');
}

async function restore(req, res) {
  const id = Number(req.params.id);
  const knex = getKnex();
  await knex('hangs').where({ id }).update({ deleted_at: null, updated_at: knex.fn.now() });
  req.flash('success', 'Product restored');
  return res.redirect('/admin/products?deleted=1');
}

module.exports = { index, newForm, create, editForm, update, destroy, restore };
