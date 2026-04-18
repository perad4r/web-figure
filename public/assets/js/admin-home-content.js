document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-home-content-toggle').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      if (!id) return;

      await fetch(`/admin/home-content/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      window.location.reload();
    });
  });

  document.querySelectorAll('.js-home-content-delete').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (!window.confirm('Xóa?')) event.preventDefault();
    });
  });
});
