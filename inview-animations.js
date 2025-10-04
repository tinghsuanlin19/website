const ratio = 0.1;
const options = {
  root: null,
  rootMargin: '0px',
  threshold: ratio
};

function handleIntersect(entries, observer) {
  entries.forEach(function(entry) {
    if (entry.intersectionRatio > ratio) {
      if (entry.target.classList.contains('slideup')) {
        entry.target.classList.add('slideup-inview');
      }
      if (entry.target.classList.contains('movein')) {
        entry.target.classList.add('movein-inview');
      }
      observer.unobserve(entry.target);
    }
  });
}

const observer = new IntersectionObserver(handleIntersect, options);

document.querySelectorAll('[data-stagger]').forEach(function(container) {
  const step = parseFloat(container.getAttribute('data-stagger')) || 0;
  const items = container.querySelectorAll('.slideup, .movein');
  items.forEach(function(el, i) {
    el.style.transitionDelay = `${i * step}s`;
  });
});

document.querySelectorAll('.slideup, .movein').forEach(function(r) {
  observer.observe(r);
});
