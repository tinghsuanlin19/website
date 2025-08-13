(function () {
  var TARGETS = ['.slide-up', '.fade-in'];

  // 1) Stagger: get items inside each [data-stagger] group
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseFloat(group.getAttribute('data-stagger')) || 0;

    var items = [];
    TARGETS.forEach(function (sel) {
      items = items.concat(Array.from(group.querySelectorAll(sel)));
    });

    items.forEach(function (el, i) {
      if (!el.hasAttribute('data-delay')) {
        el.style.transitionDelay = (step * i) + 's';
      }
    });
  });

  // 2) Per-item delay overrides (works for ALL targets)
  var delaySelector = TARGETS.map(function (s) { return s + '[data-delay]'; }).join(', ');
  document.querySelectorAll(delaySelector).forEach(function (el) {
    var d = parseFloat(el.getAttribute('data-delay')) || 0;
    el.style.transitionDelay = d + 's';
  });

  // 3) Observe & trigger only once
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target); // stop watching this element
      }
    });
  }, { threshold: 0.1 });

  var targetSelector = TARGETS.join(', ');
  document.querySelectorAll(targetSelector).forEach(function (el) {
    observer.observe(el);
  });
})();
