const bcrypt = require('bcryptjs');

exports.seed = async function seed(knex) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await knex('users').where({ email: adminEmail }).first();
  if (existing) return;

  const password = await bcrypt.hash(adminPassword, 10);

  await knex('users').insert({
    ten: 'Admin',
    email: adminEmail,
    password,
    role: 0,
    status: true,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  });
};

