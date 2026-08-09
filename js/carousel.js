// CÉRULEA — Navigation des carrousels de produits/avis via boutons flèches
document.addEventListener("DOMContentLoaded", () => {
  const FADE = 110; // doit correspondre au mask-image défini dans css/layout.css

  const updateFade = (track) => {
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 2) {
      // Tout tient déjà à l'écran : aucune carte coupée, pas besoin de fondu
      track.style.maskImage = "none";
      track.style.webkitMaskImage = "none";
      return;
    }

    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= maxScroll - 2;
    let mask;

    if (atStart) {
      mask = `linear-gradient(to right, black calc(100% - ${FADE}px), transparent 100%)`;
    } else if (atEnd) {
      mask = `linear-gradient(to left, black calc(100% - ${FADE}px), transparent 100%)`;
    } else {
      mask = `linear-gradient(to right, transparent 0, black ${FADE}px, black calc(100% - ${FADE}px), transparent 100%)`;
    }

    track.style.maskImage = mask;
    track.style.webkitMaskImage = mask;
  };

  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    if (!track) return;

    const scrollAmount = () => track.clientWidth * 0.8;

    prevBtn?.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    nextBtn?.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });

    updateFade(track);
    track.addEventListener("scroll", () => updateFade(track));
    window.addEventListener("resize", () => updateFade(track));
  });
});
