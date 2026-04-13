exports.seed = async function seed(knex) {
  const hasProduct = await knex('hangs').first();
  if (hasProduct) return;

  const now = knex.fn.now();
  const category = await knex('the_loais').orderBy('id', 'asc').first();
  const colors = await knex('maus').orderBy('id', 'asc').limit(2);
  const sizes = await knex('kich_cos').orderBy('id', 'asc').limit(3);

  if (!category || colors.length === 0 || sizes.length === 0) return;

  const result = await knex('hangs').insert({
    ten: 'Sample Product',
    gia: 199000,
    ton_kho: 0,
    hinh_anh: null,
    mo_ta: 'Seeded product for SSR testing.',
    the_loai_id: category.id,
    deleted_at: null,
    created_at: now,
    updated_at: now,
  });

  const hangId = Array.isArray(result) ? result[0] : result;

  const variants = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        hang_id: hangId,
        mau_id: color.id,
        kich_co_id: size.id,
        hinh_anh: null,
        gia: 199000,
        ton_kho: 10,
        created_at: now,
        updated_at: now,
      });
    }
  }

  await knex('bien_the_hangs').insert(variants);
  await knex('hangs').where({ id: hangId }).update({ ton_kho: variants.length * 10, updated_at: now });
};
