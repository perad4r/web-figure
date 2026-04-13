const { getKnex } = require('../../config/database');

async function dashboard(req, res) {
  const knex = getKnex();

  const [
    users,
    categories,
    products,
    variants,
    orders,
    reviews,
  ] = await Promise.all([
    knex('users').count({ c: '*' }).first(),
    knex('the_loais').count({ c: '*' }).first(),
    knex('hangs').count({ c: '*' }).first(),
    knex('bien_the_hangs').count({ c: '*' }).first(),
    knex('don_hangs').count({ c: '*' }).first(),
    knex('danh_gias').count({ c: '*' }).first(),
  ]);

  const stats = {
    users: Number(users?.c || 0),
    categories: Number(categories?.c || 0),
    products: Number(products?.c || 0),
    variants: Number(variants?.c || 0),
    orders: Number(orders?.c || 0),
    reviews: Number(reviews?.c || 0),
  };

  return res.render('admin/dashboard', { title: 'Dashboard', stats });
}

module.exports = { dashboard };

