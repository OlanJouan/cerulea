// CÉRULEA — Recherche produit en direct dans la barre du header
document.addEventListener("DOMContentLoaded", () => {
  if (typeof CERULEA_PRODUCTS === "undefined") return;

  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const productLink = (id) => (isInPagesFolder ? "" : "pages/") + "produit.html?id=" + id;
  const categorieLink = () => (isInPagesFolder ? "" : "pages/") + "categorie.html?cat=nouveautes";

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

  const entries = Object.entries(CERULEA_PRODUCTS).map(([id, p]) => ({
    id,
    ...p,
    searchText: normalize(p.name + " " + p.cat),
  }));

  document.querySelectorAll(".header-search").forEach((wrapper) => {
    const input = wrapper.querySelector("input");
    if (!input) return;

    const results = document.createElement("div");
    results.className = "search-results";
    results.hidden = true;
    wrapper.appendChild(results);

    const closeResults = () => {
      results.hidden = true;
      results.innerHTML = "";
    };

    const renderResults = (query) => {
      const q = normalize(query.trim());
      if (!q) {
        closeResults();
        return;
      }

      const matches = entries.filter((p) => p.searchText.includes(q)).slice(0, 6);

      if (matches.length === 0) {
        results.innerHTML = `
          <p class="search-results-empty">
            Aucun résultat pour « ${query.trim()} ».
            <a href="${categorieLink()}">Voir tous nos produits</a>
          </p>`;
        results.hidden = false;
        return;
      }

      results.innerHTML = matches
        .map(
          (p) => `
            <a class="search-result-item" href="${productLink(p.id)}">
              <img src="${p.img.replace("/700/700/", "/80/80/")}" alt="" loading="lazy" width="44" height="44">
              <span>
                <span class="search-result-name">${p.name}</span>
                <span class="search-result-meta">${p.cat} · ${p.price}</span>
              </span>
            </a>`
        )
        .join("");
      results.hidden = false;
    };

    input.addEventListener("input", () => renderResults(input.value));
    input.addEventListener("focus", () => {
      if (input.value.trim()) renderResults(input.value);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeResults();
        input.blur();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const first = results.querySelector(".search-result-item");
        if (first) window.location.href = first.getAttribute("href");
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) closeResults();
    });
  });
});
