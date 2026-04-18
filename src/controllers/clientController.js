const Hang = require('../models/Hang');
const BienTheHang = require('../models/BienTheHang');
const TheLoai = require('../models/TheLoai');
const DonHang = require('../models/DonHang');
const DanhGia = require('../models/DanhGia');
const HomeSetting = require('../models/HomeSetting');

async function home(req, res) {
  const [categories, featuredProducts, homeSettings] = await Promise.all([
    TheLoai.query().orderBy('id', 'desc').limit(5),
    Hang.query().withGraphFetched('theLoai').orderBy('id', 'desc').limit(8),
    HomeSetting.query().where('is_active', 1).orderBy([{ column: 'section' }, { column: 'position' }]),
  ]);

  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await Hang.query()
        .where('the_loai_id', category.id)
        .withGraphFetched('variants.[color, size]')
        .orderBy('id', 'desc')
        .limit(5);

      return { ...category, products };
    })
  );

  const grouped = {};
  for (const row of homeSettings) {
    if (!grouped[row.section]) grouped[row.section] = [];
    grouped[row.section].push(row);
  }

  const heroBanners = (grouped.hero_banner || []).map((row) => row.image_url).filter(Boolean);
  const promoCards = (grouped.promo_card || []).map((row) => ({
    href: row.link_url || '/san-pham',
    title: row.label || '',
    subtitle: row.subtitle || '',
    image: row.image_url || '',
  }));
  const brandLogos = (grouped.brand_logo || []).map((row) => ({
    alt: row.label || '',
    src: row.image_url || '',
  }));
  const testimonials = (grouped.testimonial || []).map((row) => {
    let extra = {};
    try {
      extra = JSON.parse(row.extra_json || '{}');
    } catch (_error) {
      extra = {};
    }

    return {
      user: row.label || 'Khách hàng',
      avatar: row.image_url || '',
      comment: extra.comment || '',
    };
  });
  const galleryImages = (grouped.gallery_image || []).map((row) => row.image_url).filter(Boolean);

  return res.render('client/home', {
    title: 'PMFigure - Figure anime chính hãng',
    categoriesWithProducts,
    featuredProducts,
    heroBanners,
    promoCards,
    brandLogos,
    testimonials,
    galleryImages,
    seo: {
      title: 'PMFigure - Figure anime chính hãng',
      description:
        'PMFigure cung cấp figure anime, mô hình nhân vật và đồ sưu tầm chính hãng với giá rõ ràng, mẫu mã đa dạng và hỗ trợ giao hàng toàn quốc.',
      keywords:
        'figure anime, mô hình anime, figure chính hãng, mô hình sưu tầm, đồ chơi figure, figure Việt Nam',
      canonicalUrl: `${process.env.APP_URL || `${req.protocol}://${req.get('host')}`}/`,
      ogType: 'website',
      ogLocale: 'vi_VN',
    },
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

  if (q) query.where('ten', 'like', `%${q}%`);
  if (categoryId) query.where('the_loai_id', categoryId);

  const productsPlus = await query;
  const hasNext = productsPlus.length > pageSize;
  const products = hasNext ? productsPlus.slice(0, pageSize) : productsPlus;

  const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const canonicalUrl = new URL(options.canonicalPath, origin);

  if (options.canonicalPath !== '/' && categoryId) canonicalUrl.searchParams.set('the_loai_id', String(categoryId));
  if (q) canonicalUrl.searchParams.set('q', q);
  if (page > 1) canonicalUrl.searchParams.set('page', String(page));
  if (pageSize !== 12) canonicalUrl.searchParams.set('pageSize', String(pageSize));

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
    pageHeading: category ? category.ten : q ? 'Kết quả tìm kiếm' : options.heading,
    pageLead: category ? `Danh mục: ${category.ten}` : q ? `Từ khóa: ${q}` : options.lead,
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

  const reviews = await DanhGia.query()
    .where('hang_id', id)
    .whereNull('deleted_at')
    .withGraphFetched('user')
    .orderBy('id', 'desc');

  const hasPurchased = req.user
    ? Boolean(
        await DonHang.query()
          .joinRelated('details')
          .where('don_hangs.user_id', req.user.id)
          .where('don_hangs.status', DonHang.STATUS.RECEIVED)
          .where('details.hang_id', id)
          .first()
      )
    : false;

  return res.render('client/products/show', {
    title: product.ten,
    product,
    reviews,
    canReview: hasPurchased,
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
