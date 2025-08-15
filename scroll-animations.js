(function () {
  // ----- config -----
  const TRIGGER_RATIO = 0.9;
  const TARGETS_ONCE = ['.slide-up', '.fade-in']; // trigger once
  const TARGETS_TOGGLE = ['.reveal'];             // reversible

  // ----- helpers: build stagger metadata -----
  // meta: el -> { stagger (s), index, total, group: 'once'|'toggle' }
  const meta = new Map();

  document.querySelectorAll('[data-stagger]').forEach(container => {
    const step = parseFloat(container.getAttribute('data-stagger')) || 0;

    let onceItems = [];
    TARGETS_ONCE.forEach(sel => {
      onceItems = onceItems.concat(Array.from(container.querySelectorAll(sel)));
    });
    onceItems.forEach((el, i) =>
      meta.set(el, { stagger: step, index: i, total: onceItems.length, group: 'once' })
    );

    let toggleItems = [];
    TARGETS_TOGGLE.forEach(sel => {
      toggleItems = toggleItems.concat(Array.from(container.querySelectorAll(sel)));
    });
    toggleItems.forEach((el, i) =>
      meta.set(el, { stagger: step, index: i, total: toggleItems.length, group: 'toggle' })
    );
  });

  const allSelectors = TARGETS_ONCE.concat(TARGETS_TOGGLE).join(', ');
  document.querySelectorAll(allSelectors).forEach(el => {
    if (!meta.has(el))
      meta.set(el, { stagger: 0, index: 0, total: 1, group: TARGETS_TOGGLE.some(s => el.matches(s)) ? 'toggle' : 'once' });
  });

  // ----- delay setter (shared) -----
  function setTransitionDelay(el, direction /* 'down'|'up' */) {
    if (el.hasAttribute('data-delay')) {
      const d = parseFloat(el.getAttribute('data-delay')) || 0;
      el.style.transitionDelay = d + 's';
      return;
    }

    const m = meta.get(el);
    if (!m) { el.style.transitionDelay = '0s'; return; }

    let orderIndex = m.index;
    if (m.group === 'toggle' && direction === 'up') {
      orderIndex = m.total - 1 - m.index;
    }

    const delay = Math.max(0, orderIndex * m.stagger);
    el.style.transitionDelay = delay + 's';
  }

  // ===============================
  // Part 1: Once-only animations
  // ===============================
  const onceSelector = TARGETS_ONCE.join(', ');
  let onceObserver = null;

  if (onceSelector) {
    onceObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTransitionDelay(entry.target, 'down'); // forward order
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

  // NEW: initial sync so items already past trigger show on first paint
  function initReveal() {
    const triggerY = window.innerHeight * TRIGGER_RATIO;
    document.querySelectorAll(toggleSelector).forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top <= triggerY) {
        setTransitionDelay(el, 'down'); // treat as entering from top on load
        el.classList.add('is-inview');
      } else {
        el.classList.remove('is-inview');
      }
    });
  }

  if (toggleSelector) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { initReveal(); onScroll(); });
    // run once immediately
    initReveal();
    onScroll();
  }

  // ===============================
  // Part 3: Hash-aware bootstrapping
  // ===============================
  function hashTargetElement() {
    const id = location.hash ? location.hash.slice(1) : '';
    if (!id) return null;
    return document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`);
  }

  function instantRevealOnLoad() {
    const target = hashTargetElement();
    if (!target) return;

    const viewportTop = 0;
    const viewportBottom = window.innerHeight;

    // Pre-mark once-only items ABOVE viewport
    if (onceSelector) {
      document.querySelectorAll(onceSelector).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= viewportTop) {
          el.classList.add('is-inview');
          el.style.transitionDelay = '0s';
          if (onceObserver) onceObserver.unobserve(el);
        }
      });
    }

    // Instantly reveal once-only items IN VIEW inside target
    if (onceSelector) {
      const inTarget = target.querySelectorAll(onceSelector);
      inTarget.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < viewportBottom && rect.bottom > viewportTop;
        if (inView) {
          el.classList.add('is-inview');
          el.style.transitionDelay = '0s';
          if (onceObserver) onceObserver.unobserve(el);
        }
      });
    }

    // Also resync .reveal after the hash jump
    initReveal();
    onScroll();
  }

  window.addEventListener('load', () => {
    requestAnimationFrame(() => requestAnimationFrame(instantRevealOnLoad));
  });
  window.addEventListener('hashchange', () => {
    requestAnimationFrame(() => requestAnimationFrame(instantRevealOnLoad));
  });
})();

