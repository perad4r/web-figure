#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');
const { favicons } = require('favicons');

async function main() {
  const root = path.join(__dirname, '..');
  const source = path.join(root, 'public', 'assets', 'img', 'logo.png');
  const outputDir = path.join(root, 'public', 'favicons');

  await fs.mkdir(outputDir, { recursive: true });

  const response = await favicons(source, {
    path: '/favicons/',
    appName: 'PMFigure',
    appShortName: 'PMFigure',
    appDescription: 'PMFigure - figure anime chính hãng',
    background: '#ffffff',
    theme_color: '#ed5d82',
    display: 'standalone',
    orientation: 'portrait',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      favicons: true,
      windows: true,
      yandex: false,
    },
  });

  await Promise.all(
    response.images.map((image) => fs.writeFile(path.join(outputDir, image.name), image.contents)),
  );
  await Promise.all(
    response.files.map((file) => fs.writeFile(path.join(outputDir, file.name), file.contents)),
  );

  console.log(`Generated ${response.images.length + response.files.length} favicon assets in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
