require('dotenv').config();

const { syncBundledProductImages } = require('./bootstrap/syncBundledProductImages');
const { app } = require('./app');

async function main() {
  const syncResult = await syncBundledProductImages();
  if (!syncResult.skipped) {
    // eslint-disable-next-line no-console
    console.log(`[startup] bundled product images ready: ${syncResult.total} total, ${syncResult.copied} copied`);
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`web-figure backend listening on :${port}`);
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[startup] failed to prepare bundled product images', error);
  process.exit(1);
});
