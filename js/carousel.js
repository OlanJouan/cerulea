// CÉRULEA — Navigation des carrousels de produits/avis via boutons flèches
document.addEventListener("DOMContentLoaded", () => {
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
  });
});
