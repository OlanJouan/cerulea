// CÉRULEA — Ouverture/fermeture du mega-menu (desktop au survol/clic, mobile en accordéon)
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".main-nav-item");
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;

  items.forEach((item) => {
    const link = item.querySelector(".main-nav-link");
    if (!link) return;

    link.addEventListener("click", (e) => {
      if (!item.querySelector(".mega-menu")) return;
      if (isMobile()) {
        e.preventDefault();
        const willOpen = !item.classList.contains("is-open");
        items.forEach((other) => {
          other.classList.remove("is-open");
          other.querySelector(".main-nav-link")?.setAttribute("aria-expanded", "false");
        });
        item.classList.toggle("is-open", willOpen);
        link.setAttribute("aria-expanded", String(willOpen));
      }
    });

    item.addEventListener("mouseenter", () => {
      if (!isMobile()) item.classList.add("is-open");
    });

    item.addEventListener("mouseleave", () => {
      if (!isMobile()) item.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav-item") && !isMobile()) {
      items.forEach((item) => item.classList.remove("is-open"));
    }
  });
});
