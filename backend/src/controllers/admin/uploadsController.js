function uploadResult(subdir, file) {
  const relative = `${subdir}/${file.filename}`;
  return { ok: true, path: `/uploads/${relative}`, storedAs: relative };
}

async function uploadProductImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Missing file' });
  return res.json(uploadResult('products', req.file));
}

async function uploadVariantImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Missing file' });
  return res.json(uploadResult('variants', req.file));
}

module.exports = { uploadProductImage, uploadVariantImage };

