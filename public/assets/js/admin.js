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
})();

