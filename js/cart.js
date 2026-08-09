// CÉRULEA — Panier persisté en localStorage (démo front uniquement)
(() => {
  const STORAGE_KEY = "cerulea-cart";

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  };

  const cartCount = (cart) => Object.values(cart).reduce((total, qty) => total + qty, 0);

  const updateBadge = () => {
    const count = cartCount(getCart());
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.style.display = count > 0 ? "flex" : "none";
    });
  };

  const addToCart = (id) => {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    updateBadge();
  };

  const showFeedback = (btn) => {
    const original = btn.textContent;
    btn.textContent = "Ajouté ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateBadge();

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".product-card-add[data-product-id]");
      if (!btn) return;

      addToCart(btn.getAttribute("data-product-id"));
      showFeedback(btn);
    });
  });
})();
