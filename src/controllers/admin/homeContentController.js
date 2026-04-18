const HomeSetting = require('../../models/HomeSetting');

const SECTIONS = ['hero_banner', 'promo_card', 'brand_logo', 'gallery_image', 'testimonial'];

function parseExtra(extraJson) {
  try {
    return JSON.parse(extraJson || '{}');
  } catch (_error) {
    return {};
  }
}

function normalizeForm(body, file, currentRow) {
  let imageUrl = String(body.image_url_manual || '').trim() || (currentRow?.image_url || null);
  if (file) imageUrl = `/uploads/home/${file.filename}`;

  return {
    section: SECTIONS.includes(body.section) ? body.section : 'hero_banner',
    label: String(body.label || '').trim() || null,
    subtitle: String(body.subtitle || '').trim() || null,
    image_url: imageUrl,
    link_url: String(body.link_url || '').trim() || null,
    extra_json:
      body.section === 'testimonial'
        ? JSON.stringify({ comment: String(body.comment || '').trim() })
        : null,
    position: Math.max(0, Number(body.position || 0)),
    is_active: body.is_active === '1' || body.is_active === 'on' ? 1 : 0,
  };
}

async function index(req, res) {
  const activeSection = SECTIONS.includes(req.query.section) ? req.query.section : null;
  let query = HomeSetting.query().orderBy([{ column: 'section' }, { column: 'position' }, { column: 'id' }]);
  if (activeSection) query = query.where('section', activeSection);

  const rows = await query;
  return res.render('admin/home-content/index', {
    title: 'Quản lý trang chủ',
    rows,
    sections: SECTIONS,
    activeSection,
  });
}

async function newForm(req, res) {
  const defaultSection = SECTIONS.includes(req.query.section) ? req.query.section : 'hero_banner';
  return res.render('admin/home-content/form', {
    title: 'Thêm nội dung trang chủ',
    row: null,
    sections: SECTIONS,
    defaultSection,
    error: null,
  });
}

async function create(req, res) {
  const payload = normalizeForm(req.body, req.file, null);
  await HomeSetting.query().insert(payload);
  req.flash('success', 'Đã thêm nội dung trang chủ');
  return res.redirect('/admin/home-content');
}

async function editForm(req, res) {
  const row = await HomeSetting.query().findById(Number(req.params.id));
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  row.extra = parseExtra(row.extra_json);
  return res.render('admin/home-content/form', {
    title: `Sửa #${row.id}`,
    row,
    sections: SECTIONS,
    defaultSection: row.section,
    error: null,
  });
}

async function update(req, res) {
  const row = await HomeSetting.query().findById(Number(req.params.id));
  if (!row) return res.status(404).render('client/errors/404', { title: 'Not Found' });

  const payload = normalizeForm(req.body, req.file, row);
  await row.$query().patch(payload);
  req.flash('success', 'Đã cập nhật');
  return res.redirect('/admin/home-content');
}

async function destroy(req, res) {
  await HomeSetting.query().deleteById(Number(req.params.id));
  req.flash('success', 'Đã xóa');
  return res.redirect('/admin/home-content');
}

async function toggle(req, res) {
  const row = await HomeSetting.query().findById(Number(req.params.id));
  if (!row) return res.status(404).json({ ok: false });

  const next = row.is_active ? 0 : 1;
  await row.$query().patch({ is_active: next });
  return res.json({ ok: true, is_active: next });
}

async function reorder(req, res) {
  const ids = Array.isArray(req.body.ids) ? req.body.ids.map(Number).filter(Boolean) : [];
  await Promise.all(ids.map((id, index) => HomeSetting.query().patchAndFetchById(id, { position: index })));
  return res.json({ ok: true });
}

module.exports = {
  index,
  newForm,
  create,
  editForm,
  update,
  destroy,
  toggle,
  reorder,
};
