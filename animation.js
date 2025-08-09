window.addEventListener("DOMContentLoaded", () => {
  const targetClasses = ["slideup", "dissolve"];
  let lastY = window.scrollY, dir = "down";

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    dir = y > lastY ? "down" : "up";
    lastY = y;
  });

  const animate = (el) =>
    targetClasses.forEach((cls) =>
      el.querySelectorAll(`.${cls}`).forEach((child) => {
        child.classList.remove(cls);
        void child.offsetWidth;
        child.classList.add(cls);
      })
    );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && dir === "down") animate(entry.target);
    });
  });

  document.querySelectorAll("[data-scroll-trigger]").forEach((el) => observer.observe(el));
});

