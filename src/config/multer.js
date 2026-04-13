const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function createStorage(subdir) {
  const uploadRoot = path.join(__dirname, '..', '..', 'public', 'uploads', subdir);
  ensureDir(uploadRoot);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadRoot),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').slice(0, 10) || '';
      const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
      cb(null, name);
    },
  });
}

function imageFileFilter(_req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
  return cb(new Error('Only image uploads allowed'), false);
}

function uploaderFor(subdir) {
  return multer({
    storage: createStorage(subdir),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
  });
}

module.exports = { uploaderFor };

