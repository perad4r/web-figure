const DonHang = require('../models/DonHang');

const STATUS_LABEL = {
  [DonHang.STATUS.UNPAID]: 'Chưa thanh toán',
  [DonHang.STATUS.PAID]: 'Đã thanh toán',
  [DonHang.STATUS.CANCELLED]: 'Đã huỷ',
  [DonHang.STATUS.SHIPPING]: 'Đang giao hàng',
  [DonHang.STATUS.RECEIVED]: 'Đã nhận hàng',
};

const STATUS_BADGE = {
  [DonHang.STATUS.UNPAID]: 'bg-warning text-dark',
  [DonHang.STATUS.PAID]: 'bg-info text-white',
  [DonHang.STATUS.CANCELLED]: 'bg-secondary',
  [DonHang.STATUS.SHIPPING]: 'bg-primary',
  [DonHang.STATUS.RECEIVED]: 'bg-success',
};

function statusLabel(s) {
  return STATUS_LABEL[s] || `Không xác định (${s})`;
}

function statusBadge(s) {
  return STATUS_BADGE[s] || 'bg-dark';
}

module.exports = { STATUS_LABEL, STATUS_BADGE, statusLabel, statusBadge };

