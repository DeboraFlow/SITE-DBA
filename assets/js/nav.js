document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  var closeBtn = document.querySelector('.nav-close');
  if (!toggle || !nav) return;

  // Menu lateral (drawer) — abre pela esquerda com um overlay escuro atrás,
  // no lugar do antigo dropdown no topo (pedido dela, 2026-08-15).
  var overlay = document.createElement('div');
  overlay.className = 'site-drawer-overlay';
  document.body.appendChild(overlay);

  function openDrawer() {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });
});
