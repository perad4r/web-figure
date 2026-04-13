const BienTheHang = require('../models/BienTheHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');

/**
 * Trừ tồn kho cho tất cả biến thể trong đơn hàng.
 * Gọi khi đơn chuyển sang SHIPPING.
 * @param {number} orderId
 * @param {object} [trx] - Knex transaction (optional)
 */
async function deductStock(orderId, trx) {
  const details = await ChiTietDonHang.query(trx).where('don_hang_id', orderId);

  for (const d of details) {
    const variant = await BienTheHang.query(trx)
      .where({ hang_id: d.hang_id, mau_id: d.mau_id, kich_co_id: d.kich_co_id })
      .first();

    if (variant) {
      const newStock = Math.max(0, Number(variant.ton_kho) - Number(d.so_luong));
      await variant.$query(trx).patch({ ton_kho: newStock });
    }
  }
}

/**
 * Hoàn tồn kho (khi huỷ đơn đang shipping).
 * @param {number} orderId
 * @param {object} [trx] - Knex transaction (optional)
 */
async function restoreStock(orderId, trx) {
  const details = await ChiTietDonHang.query(trx).where('don_hang_id', orderId);

  for (const d of details) {
    const variant = await BienTheHang.query(trx)
      .where({ hang_id: d.hang_id, mau_id: d.mau_id, kich_co_id: d.kich_co_id })
      .first();

    if (variant) {
      const newStock = Number(variant.ton_kho) + Number(d.so_luong);
      await variant.$query(trx).patch({ ton_kho: newStock });
    }
  }
}

module.exports = { deductStock, restoreStock };

