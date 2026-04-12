const Hang = require('../models/Hang');
const BienTheHang = require('../models/BienTheHang');

async function home(req, res) {
  return res.redirect('/san-pham');
}

async function productListing(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize || 12)));
  const offset = (page - 1) * pageSize;

  const query = Hang.query()
    .withGraphFetched('theLoai')
    .orderBy('id', 'desc')
    .offset(offset)
    .limit(pageSize);

  if (req.query.q) {
    query.where('ten', 'like', `%${req.query.q}%`);
  }

  if (req.query.the_loai_id) {
    query.where('the_loai_id', Number(req.query.the_loai_id));
  }

  const products = await query;

  return res.render('client/products/index', {
    title: 'Sản phẩm',
    products,
    q: req.query.q || '',
    page,
    pageSize,
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
