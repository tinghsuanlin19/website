(function () {
  const root = document.documentElement;
  const btn = document.querySelector('.nav-menu-button');
  const tray = document.querySelector('.nav-menu-tray');
  const curtain = document.querySelector('.nav-curtain');
  const links = document.querySelectorAll('.nav-menu-link');

  // SVG animate elements to trigger (if present)
  const lineTopOpen = document.getElementById('anim-menu-line-top-open');
  const lineBottomOpen = document.getElementById('anim-menu-line-bottom-open');
  const lineTopClose = document.getElementById('anim-menu-line-top-close');
  const lineBottomClose = document.getElementById('anim-menu-line-bottom-close');

  const trigger = (el) => el && typeof el.beginElement === 'function' && el.beginElement();
  const isOpen = () => root.getAttribute('data-menu-state') === 'open';

  function openMenu() {
    root.setAttribute('data-menu-state', 'open');
    if (btn) btn.setAttribute('aria-label', 'Close');
    // hamburger → X
    trigger(lineTopOpen);
    trigger(lineBottomOpen);
  }

  function closeMenu() {
    root.setAttribute('data-menu-state', 'closed');
    if (btn) btn.setAttribute('aria-label', 'Menu');
    // X → hamburger
    trigger(lineTopClose);
    trigger(lineBottomClose);
  }

  // Toggle
  btn?.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

  // 1) Close when a nav link is tapped (defer so the click can navigate)
  links.forEach((el) => {
    el.addEventListener('click', () => {
      requestAnimationFrame(() => requestAnimationFrame(() => isOpen() && closeMenu()));
    });
  });

  // 2) Close when tapping outside the tray or button (capture phase)
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!isOpen()) return;
      const t = e.target;
      if (!t.closest('.nav-menu-tray') && !t.closest('.nav-menu-button')) closeMenu();
    },
    true
  );

  // Also let the curtain itself close the menu
  curtain?.addEventListener('pointerdown', () => isOpen() && closeMenu());

  // 3) Close on scroll or touchmove
  const closeIfOpen = () => isOpen() && closeMenu();
  window.addEventListener('scroll', closeIfOpen, { passive: true });
  window.addEventListener('touchmove', closeIfOpen, { passive: true });

  // Initial state WITHOUT firing SVG animations
  if (!root.hasAttribute('data-menu-state')) {
    root.setAttribute('data-menu-state', 'closed');
    btn?.setAttribute('aria-label', 'Menu');
  }
})();