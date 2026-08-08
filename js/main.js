// CÉRULEA — Initialisation générale (menu mobile, années footer)
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".header-burger");
  const body = document.body;

  if (burger) {
    burger.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
