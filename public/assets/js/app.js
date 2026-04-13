(function () {
  if (typeof window === 'undefined') return;

  function initCategoryMenu($) {
    const $menu = $('#category-menu');
    const $btn = $('#categoryComp');
    if (!$menu.length || !$btn.length) return;

    $btn.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $menu.toggle();
    });

    $menu.on('click', function (e) {
      e.stopPropagation();
    });

    $(document).on('click', function () {
      $menu.hide();
    });
  }

  function initQuickAdd($) {
    const modalEl = document.getElementById('quickAddModal');
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    const $variant = $('#qaVariant');
    const $qty = $('#qaQty');
    const $error = $('#qaError');
    const $submit = $('#qaSubmit');

    function setError(msg) {
      if (!msg) {
        $error.addClass('d-none').text('');
        return;
      }
      $error.removeClass('d-none').text(msg);
    }

    async function loadVariants(productId) {
      setError(null);
      $variant.empty();
      const res = await fetch(`/san-pham/${productId}/variants`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Failed to load variants');
      const json = await res.json();
      (json.variants || []).forEach(function (v) {
        const color = v.color ? v.color.ten : '?';
        const size = v.size ? v.size.ten : '?';
        const text = `${color} / ${size} — ${Number(v.gia || 0).toLocaleString('vi-VN')} đ (stock ${v.ton_kho})`;
        $variant.append($('<option>').attr('value', v.id).text(text));
      });
      if (!$variant.val()) throw new Error('No variants');
    }

    $(document).on('click', '.js-quickadd', async function () {
      const productId = $(this).data('product-id');
      $qty.val(1);
      try {
        await loadVariants(productId);
        modal.show();
      } catch (e) {
        setError(e.message || 'Error');
        modal.show();
      }
    });

    $submit.on('click', async function () {
      try {
        setError(null);
        const body = new URLSearchParams();
        body.set('variant_id', String($variant.val()));
        body.set('so_luong', String($qty.val() || 1));

        const res = await fetch('/giohangs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body,
        });

        if (!res.ok) throw new Error('Add to cart failed');
        modal.hide();
        window.location.href = '/giohangs';
      } catch (e) {
        setError(e.message || 'Error');
      }
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (window.jQuery) {
      initCategoryMenu(window.jQuery);
      initQuickAdd(window.jQuery);
    }
  });
})();
