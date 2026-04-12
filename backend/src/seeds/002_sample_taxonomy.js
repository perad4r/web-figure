exports.seed = async function seed(knex) {
  const now = knex.fn.now();

  const [hasCategory, hasColor, hasSize] = await Promise.all([
    knex('the_loais').first(),
    knex('maus').first(),
    knex('kich_cos').first(),
  ]);

  if (!hasCategory) {
    await knex('the_loais').insert([
      { ten: 'Áo', mo_ta: null, trang_thai: true, created_at: now, updated_at: now },
      { ten: 'Quần', mo_ta: null, trang_thai: true, created_at: now, updated_at: now },
    ]);
  }

  if (!hasColor) {
    await knex('maus').insert([
      { ten: 'Đỏ', hex_code: '#FF0000', created_at: now, updated_at: now },
      { ten: 'Đen', hex_code: '#000000', created_at: now, updated_at: now },
    ]);
  }

  if (!hasSize) {
    await knex('kich_cos').insert([
      { ten: 'S', created_at: now, updated_at: now },
      { ten: 'M', created_at: now, updated_at: now },
      { ten: 'L', created_at: now, updated_at: now },
    ]);
  }
};

