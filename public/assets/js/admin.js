(function () {
  if (typeof window === 'undefined') return;

  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const method = form.querySelector('input[name="_method"]')?.value;
    if (!method) return;
    const m = String(method).toUpperCase();
    if (m === 'DELETE') {
      if (!window.confirm('Xóa mục này?')) {
        e.preventDefault();
      }
    }
  });

  async function patchOrderStatus(orderId, status) {
    const res = await window.fetch(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ status: String(status) }).toString(),
    });
    return res;
  }

  document.addEventListener('click', async function (e) {
    const btn = e.target instanceof HTMLElement ? e.target.closest('button') : null;
    if (!btn) return;

    const orderId = btn.getAttribute('data-id');
    if (!orderId) return;

    if (btn.classList.contains('js-cancel-order')) {
      if (!window.confirm(`Bạn có chắc muốn huỷ đơn #${orderId}?`)) return;
      const res = await patchOrderStatus(orderId, 2);
      if (res.ok) return window.location.reload();
      return window.alert('Không thể cập nhật trạng thái.');
    }

    if (btn.classList.contains('js-ship-order')) {
      if (!window.confirm(`Xác nhận chuyển đơn #${orderId} sang giao hàng? Tồn kho sẽ bị trừ.`)) return;
      const res = await patchOrderStatus(orderId, 3);
      if (res.ok) return window.location.reload();
      return window.alert('Không thể cập nhật trạng thái.');
    }

    if (btn.classList.contains('js-complete-order')) {
      if (!window.confirm(`Xác nhận đơn #${orderId} đã giao thành công?`)) return;
      const res = await patchOrderStatus(orderId, 4);
      if (res.ok) return window.location.reload();
      return window.alert('Không thể cập nhật trạng thái.');
    }

    if (btn.classList.contains('js-order-detail')) {
      const body = document.getElementById('orderDetailBody');
      const modalEl = document.getElementById('orderDetailModal');
      if (!body || !modalEl) return;

      body.innerHTML = '<div class="text-center py-4">Đang tải...</div>';

      const res = await window.fetch(`/admin/orders/${orderId}/partial`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: { Accept: 'text/html' },
      });

      if (!res.ok) {
        body.innerHTML = '<div class="alert alert-danger mb-0">Không tải được dữ liệu.</div>';
      } else {
        body.innerHTML = await res.text();

        const modalForm = body.querySelector('#modalStatusForm');
        if (modalForm instanceof HTMLFormElement) {
          modalForm.addEventListener('submit', async function (ev) {
            ev.preventDefault();
            const select = modalForm.querySelector('#modalStatusSelect');
            const nextStatus = select instanceof HTMLSelectElement ? select.value : null;
            if (!nextStatus) return;
            const patchRes = await patchOrderStatus(orderId, nextStatus);
            if (patchRes.ok) return window.location.reload();
            return window.alert('Không thể cập nhật trạng thái.');
          });
        }
      }

      if (window.bootstrap?.Modal) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    }
  });
})();
