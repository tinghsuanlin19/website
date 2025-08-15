(function () {
  const SEL = '.slide-up, .fade-in';

  // Build stagger map: el -> {stagger, index}
  function buildMeta() {
    const meta = new Map();
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const step = parseFloat(container.getAttribute('data-stagger')) || 0;
      const items = container.querySelectorAll(SEL);
      items.forEach((el, i) => meta.set(el, { stagger: step, index: i }));
    });
    document.querySelectorAll(SEL).forEach(el => {
      if (!meta.has(el)) meta.set(el, { stagger: 0, index: 0 });
    });
    return meta;
  }

  // Per-item delay (data-delay > stagger)
  function setDelay(el, meta) {
    if (el.hasAttribute('data-delay')) {
      el.style.transitionDelay = (parseFloat(el.getAttribute('data-delay')) || 0) + 's';
    } else {
      const m = meta.get(el) || { stagger: 0, index: 0 };
      el.style.transitionDelay = Math.max(0, m.index * m.stagger) + 's';
    }
  }

  // Show instantly (no animation)
  function showInstant(el) {
    el.style.transition = 'none';
    el.style.transitionDelay = '0s';
    el.classList.add('is-inview');
    requestAnimationFrame(() => { el.style.transition = ''; });
  }

  // Normal behavior: observe all targets (hero animates too)
  function observeAll(meta) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setDelay(entry.target, meta);
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(SEL).forEach(el => io.observe(el));
    return io;
  }

  // Hash landing behavior: a) in view & b) above => instant; c) below => observe
  function bootstrapForHash(meta) {
    const els = Array.from(document.querySelectorAll(SEL));
    const vh = window.innerHeight;
    const toObserve = [];

    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const above = r.bottom <= 0;
      const inView = r.top < vh && r.bottom > 0;
      if (above || inView) showInstant(el); else toObserve.push(el);
    });

    if (!toObserve.length) return null;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setDelay(entry.target, meta);
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    toObserve.forEach(el => io.observe(el));
    return io;
  }

  function init() {
    const meta = buildMeta();
    const hasHash = !!location.hash;

    // Wait for layout (and for the browser to perform the anchor jump if present)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (hasHash) {
        bootstrapForHash(meta);          // only skip animations when coming to #section
      } else {
        observeAll(meta);                // normal load: hero animates
      }
    }));
  }

  window.addEventListener('load', init);
  window.addEventListener('hashchange', init);
  window.addEventListener('pageshow', e => { if (e.persisted) init(); });
})();
