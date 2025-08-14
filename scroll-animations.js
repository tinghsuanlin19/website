(function () {
  // ----- config -----
  const TRIGGER_RATIO = 0.9;
  const TARGETS_ONCE = ['.slide-up', '.fade-in']; // trigger once
  const TARGETS_TOGGLE = ['.reveal'];             // reversible

  // Parse "120ms", "0.12s", or numeric -> seconds
  function parseTimeToSeconds(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v; // assume seconds
    const s = String(v).trim().toLowerCase();
    if (s.endsWith('ms')) return parseFloat(s) / 1000 || 0;
    if (s.endsWith('s'))  return parseFloat(s) || 0;
    return parseFloat(s) || 0; // bare number => seconds
  }

  // ----- helpers: build stagger metadata -----
  // meta: el -> { stagger (s), index, total, group: 'once'|'toggle' }
  const meta = new Map();

  document.querySelectorAll('[data-stagger]').forEach(container => {
    const step = parseTimeToSeconds(container.getAttribute('data-stagger')) || 0;

    let onceItems = [];
    TARGETS_ONCE.forEach(sel => {
      onceItems = onceItems.concat(Array.from(container.querySelectorAll(sel)));
    });
    onceItems.forEach((el, i) => meta.set(el, { stagger: step, index: i, total: onceItems.length, group: 'once' }));

    let toggleItems = [];
    TARGETS_TOGGLE.forEach(sel => {
      toggleItems = toggleItems.concat(Array.from(container.querySelectorAll(sel)));
    });
    toggleItems.forEach((el, i) => meta.set(el, { stagger: step, index: i, total: toggleItems.length, group: 'toggle' }));
  });

  const allSelectors = TARGETS_ONCE.concat(TARGETS_TOGGLE).join(', ');
  document.querySelectorAll(allSelectors).forEach(el => {
    if (!meta.has(el)) meta.set(el, { stagger: 0, index: 0, total: 1, group: TARGETS_TOGGLE.some(s => el.matches(s)) ? 'toggle' : 'once' });
  });

  // ----- delay setter (shared) -----
  function setTransitionDelay(el, direction /* 'down'|'up' */) {
    if (el.hasAttribute('data-delay')) {
      const d = parseTimeToSeconds(el.getAttribute('data-delay'));
      el.style.transitionDelay = d + 's';
      return;
    }

    const m = meta.get(el);
    if (!m) { el.style.transitionDelay = '0s'; return; }

    let orderIndex = m.index;
    if (m.group === 'toggle' && direction === 'up') {
      orderIndex = (m.total - 1 - m.index);
    }

    const delay = Math.max(0, orderIndex * m.stagger); // already seconds
    el.style.transitionDelay = delay + 's';
  }

  // ===============================
  // Part 1: Once-only animations
  // ===============================
  const onceSelector = TARGETS_ONCE.join(', ');
  if (onceSelector) {
    const onceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTransitionDelay(entry.target, 'down');
          entry.target.classList.add('is-inview');
          onceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(onceSelector).forEach(el => onceObserver.observe(el));
  }

  // ===============================
  // Part 2: Reversible reveal
  // ===============================
  const toggleSelector = TARGETS_TOGGLE.join(', ');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    const scrollingDown = y > lastY;
    lastY = y;

    const triggerY = window.innerHeight * TRIGGER_RATIO;

    document.querySelectorAll(toggleSelector).forEach(el => {
      const top = el.getBoundingClientRect().top;

      if (scrollingDown) {
        if (top <= triggerY) {
          setTransitionDelay(el, 'down');
          el.classList.add('is-inview');
        }
      } else {
        if (top > triggerY && el.classList.contains('is-inview')) {
          setTransitionDelay(el, 'up');
          el.classList.remove('is-inview');
        }
      }
    });
  }

  if (toggleSelector) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
})();
