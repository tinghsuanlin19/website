document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r=document) => r.querySelector(s);
  const button      = $("#nav-menu-button");
  const navMenu     = $(".nav-menu-mobile");
  const navItemsBox = $(".nav-menu-items-mobile");
  const navOverlay  = $(".nav-overlay");
  if (!button || !navMenu || !navItemsBox || !navOverlay) return;

  // --- Input modality (for focus restore) ---
  let lastWasKeyboard = false;
  document.addEventListener("keydown", e => { if (e.key === "Tab") lastWasKeyboard = true; });
  document.addEventListener("pointerdown", () => { lastWasKeyboard = false; }, { passive: true });

  // --- Config / State ---
  const getDurationMs = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--nav-duration-ms").trim();
    const n = Number(v || "500");
    return Number.isFinite(n) ? n : 500;
  };
  let isOpen = false, animating = false;
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Helpers ---
  const setExpanded = (x) => {
    isOpen = x;
    button.setAttribute("aria-expanded", String(x));
    document.body.classList.toggle("no-scroll", x);
    document.documentElement.classList.toggle("nav-open", x);
    navMenu.classList.toggle("is-open", x);
    navOverlay.classList.toggle("is-open", x);
  };
  const afterAnim = (cb) => prefersReduced ? cb?.() : setTimeout(() => cb?.(), getDurationMs() + 60);

  const openMenu = () => {
    if (isOpen || animating) return;
    animating = true;
    button.setAttribute("aria-label", "Close");
    setExpanded(true);
    $("#anim-menu-line-top-open")?.beginElement();
    $("#anim-menu-line-bottom-open")?.beginElement();
    afterAnim(() => {
      animating = false;
      navMenu.querySelector(".nav-item-mobile a, .nav-item-mobile button")?.focus({ preventScroll: true });
    });
  };

  const closeMenu = () => {
    if (!isOpen || animating) return;
    animating = true;
    button.setAttribute("aria-label", "Menu");
    setExpanded(false);
    $("#anim-menu-line-top-close")?.beginElement();
    $("#anim-menu-line-bottom-close")?.beginElement();
    afterAnim(() => {
      animating = false;
      if (lastWasKeyboard) button.focus({ preventScroll: true });
    });
  };

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  // --- Bindings ---
  button.setAttribute("aria-controls", navMenu.id || "nav-menu-mobile");
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", (e) => { e.stopPropagation(); if (!animating) toggleMenu(); });
  button.addEventListener("pointerdown", (e) => e.stopPropagation(), { passive: true }); // don’t trigger outside handler

  // Close when a nav item is clicked
  navItemsBox.addEventListener("click", (e) => { if (e.target.closest(".nav-item-mobile")) closeMenu(); });

  // One outside handler (overlay + anywhere outside)
  document.addEventListener("pointerdown", (e) => {
    if (!isOpen || animating) return;
    if (!e.target.closest(".nav-menu-mobile, #nav-menu-button")) closeMenu();
  }, { passive: true });

  // ESC to close
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Close on scroll / wheel
  const closeIfOpen = () => { if (isOpen && !animating) closeMenu(); };
  ["scroll", "wheel"].forEach(ev => addEventListener(ev, closeIfOpen, { passive: true }));

  // Close on vertical drag (touch)
  let touchStartY = null;
  document.addEventListener("touchstart", (e) => { touchStartY = e.touches?.[0]?.clientY ?? null; }, { passive: true });
  document.addEventListener("touchmove", (e) => {
    if (!isOpen || animating || touchStartY == null) return;
    const y = e.touches?.[0]?.clientY ?? touchStartY;
    if (Math.abs(y - touchStartY) > 12) { closeMenu(); touchStartY = null; }
  }, { passive: true });

  // Reduced motion hint
  if (prefersReduced) document.documentElement.classList.add("reduced-motion");
});
