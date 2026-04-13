#!/usr/bin/env node
const http = require('http');
const querystring = require('querystring');

const { createDb, resetDatabase } = require('./db-tool');

function parseArgs(argv) {
  return {
    reset: argv.includes('--reset'),
    yes: argv.includes('--yes'),
  };
}

function joinCookies(setCookieHeaders) {
  if (!setCookieHeaders) return '';
  const arr = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  return arr
    .map((c) => String(c).split(';')[0])
    .filter(Boolean)
    .join('; ');
}

function request({ port, method, path, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        method,
        path,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      },
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function expectStatus(step, res, expected) {
  if (!expected.includes(res.status)) {
    throw new Error(`${step}: expected ${expected.join('/')} got ${res.status}`);
  }
}

async function main() {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  const args = parseArgs(process.argv.slice(2));

  const db = createDb();
  try {
    if (args.reset) {
      // eslint-disable-next-line no-console
      console.log('db: reset...');
      await resetDatabase(db, { yes: args.yes });
    }
    // Ensure schema is up to date even when not resetting.
    await db.migrate.latest();
    await db.seed.run();

    // eslint-disable-next-line global-require
    const { app } = require('../src/app');
    const server = http.createServer(app);

    const port = await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve(server.address().port));
    });

    let cookie = '';
    try {
      // login
      const email = process.env.ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.ADMIN_PASSWORD || 'admin123';

      const loginBody = querystring.stringify({ email, password });
      const loginRes = await request({
        port,
        method: 'POST',
        path: '/dang-nhap',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(loginBody),
        },
        body: loginBody,
      });
      await expectStatus('login', loginRes, [302, 303]);
      cookie = joinCookies(loginRes.headers['set-cookie']);
      if (!cookie) throw new Error('login: missing set-cookie');

      // simple authenticated checks
      const adminDashboard = await request({
        port,
        method: 'GET',
        path: '/admin/dashboard',
        headers: { cookie },
      });
      await expectStatus('admin dashboard', adminDashboard, [200]);
      const adminRoot = await request({
        port,
        method: 'GET',
        path: '/admin',
        headers: { cookie },
      });
      await expectStatus('admin root', adminRoot, [302, 303]);
      if (!String(adminRoot.headers.location || '').startsWith('/admin/dashboard')) {
        throw new Error(`admin root: expected redirect to /admin/dashboard got "${adminRoot.headers.location || ''}"`);
      }

      // create category
      const catName = `Smoke Cat ${Date.now()}`;
      const catBody = querystring.stringify({ ten: catName, mo_ta: 'smoke', trang_thai: '1' });
      const catCreate = await request({
        port,
        method: 'POST',
        path: '/admin/categories',
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(catBody),
        },
        body: catBody,
      });
      await expectStatus('create category', catCreate, [302, 303]);
      const catRow = await db('the_loais').where({ ten: catName }).orderBy('id', 'desc').first();
      if (!catRow) throw new Error('create category: row missing');

      // soft delete + restore category
      const catDelBody = querystring.stringify({ _method: 'DELETE' });
      const catDel = await request({
        port,
        method: 'POST',
        path: `/admin/categories/${catRow.id}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(catDelBody),
        },
        body: catDelBody,
      });
      await expectStatus('delete category', catDel, [302, 303]);
      const catRestoreBody = querystring.stringify({ _method: 'PATCH' });
      const catRestore = await request({
        port,
        method: 'POST',
        path: `/admin/categories/${catRow.id}/restore`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(catRestoreBody),
        },
        body: catRestoreBody,
      });
      await expectStatus('restore category', catRestore, [302, 303]);

      // users CRUD
      const userEmail = `smoke+${Date.now()}@example.com`;
      const userCreateBody = querystring.stringify({
        ten: 'Smoke User',
        email: userEmail,
        password: 'pass12345',
        role: '2',
        status: '1',
      });
      const userCreate = await request({
        port,
        method: 'POST',
        path: '/admin/users',
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(userCreateBody),
        },
        body: userCreateBody,
      });
      await expectStatus('create user', userCreate, [302, 303]);
      const userRow = await db('users').where({ email: userEmail }).first();
      if (!userRow) throw new Error('create user: row missing');

      const userToggleBody = querystring.stringify({ _method: 'PATCH' });
      const userToggle = await request({
        port,
        method: 'POST',
        path: `/admin/users/${userRow.id}/toggle`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(userToggleBody),
        },
        body: userToggleBody,
      });
      await expectStatus('toggle user', userToggle, [302, 303]);

      const userDelBody = querystring.stringify({ _method: 'DELETE' });
      const userDel = await request({
        port,
        method: 'POST',
        path: `/admin/users/${userRow.id}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(userDelBody),
        },
        body: userDelBody,
      });
      await expectStatus('delete user', userDel, [302, 303]);

      const userRestoreBody = querystring.stringify({ _method: 'PATCH' });
      const userRestore = await request({
        port,
        method: 'POST',
        path: `/admin/users/${userRow.id}/restore`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(userRestoreBody),
        },
        body: userRestoreBody,
      });
      await expectStatus('restore user', userRestore, [302, 303]);

      // customers CRUD
      const customerName = `Smoke Customer ${Date.now()}`;
      const custCreateBody = querystring.stringify({
        ten: customerName,
        sdt: '0900000000',
        dia_chi: 'smoke addr',
        email: `smoke-cust-${Date.now()}@example.com`,
        ma_user: String(userRow.id),
      });
      const custCreate = await request({
        port,
        method: 'POST',
        path: '/admin/customers',
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(custCreateBody),
        },
        body: custCreateBody,
      });
      await expectStatus('create customer', custCreate, [302, 303]);
      const custRow = await db('khach_hangs').where({ ten: customerName }).orderBy('id', 'desc').first();
      if (!custRow) throw new Error('create customer: row missing');

      const custDelBody = querystring.stringify({ _method: 'DELETE' });
      const custDel = await request({
        port,
        method: 'POST',
        path: `/admin/customers/${custRow.id}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(custDelBody),
        },
        body: custDelBody,
      });
      await expectStatus('delete customer', custDel, [302, 303]);

      const custRestoreBody = querystring.stringify({ _method: 'PATCH' });
      const custRestore = await request({
        port,
        method: 'POST',
        path: `/admin/customers/${custRow.id}/restore`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(custRestoreBody),
        },
        body: custRestoreBody,
      });
      await expectStatus('restore customer', custRestore, [302, 303]);

      // ensure we have product/color/size for variant
      let product = await db('hangs').whereNull('deleted_at').orderBy('id', 'desc').first();
      if (!product) {
        // create minimal product using existing category
        const category = await db('the_loais').whereNull('deleted_at').orderBy('id', 'desc').first();
        if (!category) throw new Error('variant setup: missing category');
        const prodBody = querystring.stringify({
          ten: `Smoke Product ${Date.now()}`,
          gia: '1000',
          ton_kho: '1',
          the_loai_id: String(category.id),
        });
        const prodCreate = await request({
          port,
          method: 'POST',
          path: '/admin/products',
          headers: {
            cookie,
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(prodBody),
          },
          body: prodBody,
        });
        await expectStatus('create product', prodCreate, [302, 303]);
        product = await db('hangs').whereNull('deleted_at').orderBy('id', 'desc').first();
      }

      let color = await db('maus').whereNull('deleted_at').orderBy('id', 'desc').first();
      if (!color) {
        const cBody = querystring.stringify({ ten: `Smoke Color ${Date.now()}`, hex_code: '#ffffff' });
        const cCreate = await request({
          port,
          method: 'POST',
          path: '/admin/colors',
          headers: {
            cookie,
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(cBody),
          },
          body: cBody,
        });
        await expectStatus('create color', cCreate, [302, 303]);
        color = await db('maus').whereNull('deleted_at').orderBy('id', 'desc').first();
      }

      let size = await db('kich_cos').whereNull('deleted_at').orderBy('id', 'desc').first();
      if (!size) {
        const sBody = querystring.stringify({ ten: `Smoke Size ${Date.now()}` });
        const sCreate = await request({
          port,
          method: 'POST',
          path: '/admin/sizes',
          headers: {
            cookie,
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(sBody),
          },
          body: sBody,
        });
        await expectStatus('create size', sCreate, [302, 303]);
        size = await db('kich_cos').whereNull('deleted_at').orderBy('id', 'desc').first();
      }

      // variants CRUD (soft delete + restore)
      const vBody = querystring.stringify({
        hang_id: String(product.id),
        mau_id: String(color.id),
        kich_co_id: String(size.id),
        gia: '1000',
        ton_kho: '1',
      });
      const vCreate = await request({
        port,
        method: 'POST',
        path: '/admin/variants',
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(vBody),
        },
        body: vBody,
      });
      await expectStatus('create variant', vCreate, [302, 303]);
      const variant = await db('bien_the_hangs')
        .where({ hang_id: product.id, mau_id: color.id, kich_co_id: size.id })
        .orderBy('id', 'desc')
        .first();
      if (!variant) throw new Error('create variant: row missing');

      const vDelBody = querystring.stringify({ _method: 'DELETE' });
      const vDel = await request({
        port,
        method: 'POST',
        path: `/admin/variants/${variant.id}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(vDelBody),
        },
        body: vDelBody,
      });
      await expectStatus('delete variant', vDel, [302, 303]);

      const vRestoreBody = querystring.stringify({ _method: 'PATCH' });
      const vRestore = await request({
        port,
        method: 'POST',
        path: `/admin/variants/${variant.id}/restore`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(vRestoreBody),
        },
        body: vRestoreBody,
      });
      await expectStatus('restore variant', vRestore, [302, 303]);

      // reviews edit + soft delete + restore (create via DB insert)
      const reviewInsert = await db('danh_gias').insert({
        ma: null,
        danh_gia: 'smoke review',
        ma_don: null,
        user_id: userRow.id,
        hang_id: product.id,
        rating: 5,
        deleted_at: null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });
      const rid = Number(Array.isArray(reviewInsert) ? reviewInsert[0] : reviewInsert);
      if (!rid) throw new Error('create review: id missing');

      const reviewUpdateBody = querystring.stringify({ _method: 'PUT', danh_gia: 'smoke review updated', rating: '4' });
      const reviewUpdate = await request({
        port,
        method: 'POST',
        path: `/admin/reviews/${rid}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(reviewUpdateBody),
        },
        body: reviewUpdateBody,
      });
      await expectStatus('update review', reviewUpdate, [302, 303]);

      const reviewDelBody = querystring.stringify({ _method: 'DELETE' });
      const reviewDel = await request({
        port,
        method: 'POST',
        path: `/admin/reviews/${rid}`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(reviewDelBody),
        },
        body: reviewDelBody,
      });
      await expectStatus('delete review', reviewDel, [302, 303]);

      const reviewRestoreBody = querystring.stringify({ _method: 'PATCH' });
      const reviewRestore = await request({
        port,
        method: 'POST',
        path: `/admin/reviews/${rid}/restore`,
        headers: {
          cookie,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(reviewRestoreBody),
        },
        body: reviewRestoreBody,
      });
      await expectStatus('restore review', reviewRestore, [302, 303]);

      // eslint-disable-next-line no-console
      console.log('smoke ok');
    } finally {
      server.close();
    }
  } finally {
    await db.destroy();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err?.stack || err);
  process.exit(1);
});
