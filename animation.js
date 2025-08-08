window.addEventListener("DOMContentLoaded", () => {
  const targetClasses = ["slideup", "dissolve"];
  let lastY = window.scrollY, dir = "down";

  // Track scroll direction
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    dir = y > lastY ? "down" : "up";
    lastY = y;
  });

  const animateOnce = (el) => {
    targetClasses.forEach((cls) => {
      el.querySelectorAll(`.${cls}`).forEach((child) => {
        if (!child.classList.contains("animated")) {
          child.classList.remove(cls);         // Reset
          void child.offsetWidth;              // Force reflow
          child.classList.add(cls, "animated"); // Add back + mark as animated
        }
      });
    });
  };

  // Adjust threshold and rootMargin here
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && dir === "down") {
        animateOnce(entry.target);
        observer.unobserve(entry.target); // Stop observing once triggered
      }
    });
  }, {
    threshold: 0.6,             // Trigger when 60% of the element is visible
    rootMargin: "0px 0px -10% 0px" // Push trigger point further into viewport
  });

  document.querySelectorAll("[data-scroll-trigger]").forEach((el) => observer.observe(el));
});
