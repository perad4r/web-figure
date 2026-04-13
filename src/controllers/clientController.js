const Hang = require('../models/Hang');
const BienTheHang = require('../models/BienTheHang');
const TheLoai = require('../models/TheLoai');

async function home(req, res) {
  return renderProductListing(req, res, {
    canonicalPath: '/',
    heading: 'PMFigure',
    lead: 'Cửa hàng figure anime, mô hình sưu tầm và quà tặng dành cho người yêu thích nhân vật.',
    defaultTitle: 'PMFigure - Figure anime chính hãng',
    defaultDescription:
      'PMFigure cung cấp figure anime, mô hình nhân vật và đồ sưu tầm chính hãng với giá rõ ràng, mẫu mã đa dạng và hỗ trợ giao hàng toàn quốc.',
    keywords:
      'figure anime, mô hình anime, figure chính hãng, mô hình sưu tầm, đồ chơi figure, figure Việt Nam',
  });
}

async function productListing(req, res) {
  return renderProductListing(req, res, {
    canonicalPath: '/san-pham',
    heading: 'Tất cả sản phẩm',
    lead: 'Xem danh sách figure anime, mô hình sưu tầm và các sản phẩm đang có tại PMFigure.',
    defaultTitle: 'Sản phẩm figure anime và mô hình sưu tầm',
    defaultDescription:
      'Danh sách sản phẩm figure anime, mô hình nhân vật và đồ sưu tầm đang có tại PMFigure.',
    keywords: 'sản phẩm figure, figure anime, mô hình sưu tầm, figure đẹp',
  });
}

async function renderProductListing(req, res, options) {
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

  const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const canonicalUrl = new URL(options.canonicalPath, origin);

  if (options.canonicalPath !== '/' && categoryId) {
    canonicalUrl.searchParams.set('the_loai_id', String(categoryId));
  }

  if (q) {
    canonicalUrl.searchParams.set('q', q);
  }

  if (page > 1) {
    canonicalUrl.searchParams.set('page', String(page));
  }

  if (pageSize !== 12) {
    canonicalUrl.searchParams.set('pageSize', String(pageSize));
  }

  const title = category
    ? `Figure ${category.ten} chính hãng`
    : q
      ? `Kết quả tìm kiếm cho "${q}"`
      : options.defaultTitle;

  const description = category
    ? `Khám phá các mẫu figure và mô hình thuộc danh mục ${category.ten}, cập nhật giá bán và tình trạng còn hàng tại PMFigure.`
    : q
      ? `Kết quả tìm kiếm sản phẩm cho từ khóa ${q} tại PMFigure.`
      : options.defaultDescription;

  return res.render('client/products/index', {
    title,
    products,
    q,
    categoryId: categoryId || '',
    category,
    page,
    pageSize,
    hasNext,
    basePath: options.canonicalPath,
    pageHeading: category
      ? category.ten
      : q
        ? 'Kết quả tìm kiếm'
        : options.heading,
    pageLead: category
      ? `Danh mục: ${category.ten}`
      : q
        ? `Từ khóa: ${q}`
        : options.lead,
    seo: {
      title,
      description,
      keywords: options.keywords,
      canonicalUrl: canonicalUrl.toString(),
      ogType: 'website',
      ogLocale: 'vi_VN',
    },
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
    seo: {
      title: product.ten,
      description: product.mo_ta || `Xem chi tiết ${product.ten} tại PMFigure.`,
      ogType: 'product',
      ogLocale: 'vi_VN',
    },
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
