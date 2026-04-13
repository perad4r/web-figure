const Hang = require('../models/Hang');
const BienTheHang = require('../models/BienTheHang');
const TheLoai = require('../models/TheLoai');

async function home(req, res) {
  return res.redirect('/san-pham');
}

async function productListing(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize || 12)));
  const offset = (page - 1) * pageSize;

  const q = String(req.query.q || '').trim();
  const categoryId = req.query.the_loai_id ? Number(req.query.the_loai_id) : null;
  const category = categoryId ? await TheLoai.query().findById(categoryId) : null;

  const query = Hang.query()
    .withGraphFetched('theLoai')
    .orderBy('id', 'desc')
    .offset(offset)
    .limit(pageSize + 1);

  if (q) {
    query.where('ten', 'like', `%${q}%`);
  }

  if (categoryId) {
    query.where('the_loai_id', categoryId);
  }

  const productsPlus = await query;
  const hasNext = productsPlus.length > pageSize;
  const products = hasNext ? productsPlus.slice(0, pageSize) : productsPlus;

  return res.render('client/products/index', {
    title: category ? `Sản phẩm - ${category.ten}` : 'Sản phẩm',
    products,
    q,
    categoryId: categoryId || '',
    category,
    page,
    pageSize,
    hasNext,
  });
}

async function productDetail(req, res) {
  const id = Number(req.params.id);
  const product = await Hang.query()
    .findById(id)
    .withGraphFetched('[theLoai, variants.[color, size]]');

  if (!product) {
    return res.status(404).render('client/errors/404', { title: 'Not Found' });
  }

  return res.render('client/products/show', {
    title: product.ten,
    product,
  });
}

async function productVariantsJson(req, res) {
  const id = Number(req.params.id);
  const variants = await BienTheHang.query()
    .where('hang_id', id)
    .withGraphFetched('[color, size]')
    .orderBy('id', 'asc');

  return res.json({ variants });
}

module.exports = {
  home,
  productListing,
  productDetail,
  productVariantsJson,
};

