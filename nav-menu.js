// Elements
const root = document.documentElement;
const btn = document.querySelector('.nav-menu-button');
const curtain = document.querySelector('.nav-curtain'); // ← renamed
const topOpen = document.querySelector('#anim-menu-line-top-open');
const topClose = document.querySelector('#anim-menu-line-top-close');
const botOpen = document.querySelector('#anim-menu-line-bottom-open');
const botClose = document.querySelector('#anim-menu-line-bottom-close');

let state = 'closed';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// read CSS var (supports "250ms" or "0.25s") -> ms number
const cssms = (name) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (v.endsWith('ms')) return parseFloat(v);
  if (v.endsWith('s')) return parseFloat(v) * 1000;
  const n = parseFloat(v); return Number.isFinite(n) ? n : 0;
};

// timings from CSS (always fresh)
const timings = () => ({
  itemsOpen: cssms('--items-open'),
  itemsClose: cssms('--items-close'),
  itemsOpenDelay: cssms('--items-open-delay'),
});

const setState = (s) => { root.setAttribute('data-menu-state', s); state = s; };
const play = (open) => open
  ? (topOpen?.beginElement?.(), botOpen?.beginElement?.())
  : (topClose?.beginElement?.(), botClose?.beginElement?.());

function openMenu() {
  if (state === 'open' || state === 'opening') return;
  setState('opening'); play(true); btn?.setAttribute('aria-label','Close');
  const { itemsOpen, itemsOpenDelay } = timings();
  setTimeout(() => setState('open'), REDUCED ? 0 : (itemsOpen + itemsOpenDelay));
}

function closeMenu() {
  if (state === 'closed' || state === 'closing') return;
  setState('closing'); play(false); btn?.setAttribute('aria-label','Menu');
  const { itemsClose } = timings();
  setTimeout(() => setState('closed'), REDUCED ? 0 : itemsClose);
}

// Toggle via button
btn?.addEventListener('click', () => (state === 'open' ? closeMenu() : openMenu()));

// Curtain closes menu
curtain?.addEventListener('pointerdown', closeMenu);

// Close when tapping outside the menu/button (capture phase)
document.addEventListener('pointerdown', (e) => {
  if (state !== 'open') return;
  const t = e.target;
  if (!t.closest('.nav-menu-mobile') && !t.closest('.nav-menu-button')) closeMenu();
}, true);

// Close on scroll / touchmove
window.addEventListener('scroll', () => state === 'open' && closeMenu(), { passive: true });
window.addEventListener('touchmove', () => state === 'open' && closeMenu(), { passive: true });

// Nav item: close *after* click so navigation still happens on mobile
document.querySelectorAll('.nav-item-mobile').forEach((el) => {
  el.addEventListener('click', () => {
    // Defer close to after the browser processes the click (navigation/route)
    requestAnimationFrame(() => requestAnimationFrame(closeMenu));
  });
});
