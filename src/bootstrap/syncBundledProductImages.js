const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'MIKUSHOP');
const TARGET_DIR = path.join(ROOT_DIR, 'public', 'uploads', 'products');

function isBundledProductImage(fileName) {
  return /^A\d{3}\.(jpg|jpeg|png)$/i.test(fileName);
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function copyIfMissing(sourcePath, targetPath) {
  try {
    await fs.promises.access(targetPath, fs.constants.F_OK);
    return false;
  } catch (_error) {
    await fs.promises.copyFile(sourcePath, targetPath);
    return true;
  }
}

async function syncBundledProductImages() {
  await ensureDir(TARGET_DIR);

  let entries = [];
  try {
    entries = await fs.promises.readdir(SOURCE_DIR, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') return { copied: 0, total: 0, skipped: true };
    throw error;
  }

  const imageNames = entries
    .filter((entry) => entry.isFile() && isBundledProductImage(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  let copied = 0;
  for (const imageName of imageNames) {
    const sourcePath = path.join(SOURCE_DIR, imageName);
    const targetPath = path.join(TARGET_DIR, imageName);
    if (await copyIfMissing(sourcePath, targetPath)) copied += 1;
  }

  return { copied, total: imageNames.length, skipped: false };
}

module.exports = { syncBundledProductImages };
