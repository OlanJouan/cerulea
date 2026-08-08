// CÉRULEA — Liste de souhaits persistée en localStorage (démo front uniquement)
(() => {
  const STORAGE_KEY = "cerulea-wishlist";

  const getWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveWishlist = (ids) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const updateBadge = () => {
    const count = getWishlist().length;
    document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
      el.textContent = String(count);
      el.style.display = count > 0 ? "flex" : "none";
    });
  };

  const syncButtons = () => {
    const wishlist = getWishlist();
    document.querySelectorAll(".wishlist-btn[data-product-id]").forEach((btn) => {
      const id = btn.getAttribute("data-product-id");
      btn.classList.toggle("is-active", wishlist.includes(id));
      btn.setAttribute("aria-pressed", wishlist.includes(id) ? "true" : "false");
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    syncButtons();
    updateBadge();

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".wishlist-btn[data-product-id]");
      if (!btn) return;

      const id = btn.getAttribute("data-product-id");
      let wishlist = getWishlist();

      if (wishlist.includes(id)) {
        wishlist = wishlist.filter((item) => item !== id);
      } else {
        wishlist.push(id);
      }

      saveWishlist(wishlist);
      syncButtons();
      updateBadge();
    });
  });
})();
