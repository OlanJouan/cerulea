// CÉRULEA — Panier persisté en localStorage (démo front uniquement)
(() => {
  const STORAGE_KEY = "cerulea-cart";
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const shopLink = () => (isInPagesFolder ? "" : "pages/") + "categorie.html?cat=nouveautes";

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

  const parsePrice = (str) =>
    parseFloat(String(str).replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;

  const formatPrice = (value) => value.toFixed(2).replace(".", ",") + " €";

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
    renderDrawer();
  };

  const setQty = (id, qty) => {
    const cart = getCart();
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = qty;
    }
    saveCart(cart);
    updateBadge();
    renderDrawer();
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

  const cartBody = document.querySelector("[data-cart-body]");
  const footer = document.querySelector("[data-cart-footer]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");

  const renderDrawer = () => {
    if (!cartBody) return;
    const cart = getCart();
    const ids = Object.keys(cart);
    const products = typeof CERULEA_PRODUCTS !== "undefined" ? CERULEA_PRODUCTS : {};

    if (ids.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <p>Votre panier est vide.</p>
          <a href="${shopLink()}" class="btn btn--outline-blue btn--sm">Découvrir nos produits</a>
        </div>`;
      if (footer) footer.hidden = true;
      return;
    }

    let subtotal = 0;
    cartBody.innerHTML = ids
      .map((id) => {
        const product = products[id];
        const qty = cart[id];
        if (!product) return "";
        const unitPrice = parsePrice(product.price);
        subtotal += unitPrice * qty;
        return `
          <div class="cart-item" data-cart-item="${id}">
            <img src="${product.img}" alt="" loading="lazy">
            <div>
              <span class="cart-item-name">${product.name}</span>
              <span class="cart-item-price">${product.price} l'unité</span>
              <div class="cart-item-qty">
                <button type="button" data-qty-decrease aria-label="Diminuer la quantité">−</button>
                <span>${qty}</span>
                <button type="button" data-qty-increase aria-label="Augmenter la quantité">+</button>
              </div>
            </div>
            <button type="button" class="cart-item-remove" data-qty-remove>Retirer</button>
          </div>`;
      })
      .join("");

    if (footer) footer.hidden = false;
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  };

  const overlay = document.querySelector("[data-cart-overlay]");
  const drawer = document.querySelector("[data-cart-drawer]");

  const openDrawer = () => {
    renderDrawer();
    overlay?.removeAttribute("hidden");
    requestAnimationFrame(() => {
      overlay?.classList.add("is-open");
      drawer?.classList.add("is-open");
    });
    drawer?.setAttribute("aria-hidden", "false");
  };

  const closeDrawer = () => {
    overlay?.classList.remove("is-open");
    drawer?.classList.remove("is-open");
    drawer?.setAttribute("aria-hidden", "true");
    setTimeout(() => overlay?.setAttribute("hidden", ""), 250);
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateBadge();

    document.querySelectorAll("[data-cart-toggle]").forEach((btn) => {
      btn.addEventListener("click", openDrawer);
    });
    document.querySelector("[data-cart-close]")?.addEventListener("click", closeDrawer);
    overlay?.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    cartBody?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-cart-item]");
      if (!item) return;
      const id = item.getAttribute("data-cart-item");
      const cart = getCart();
      const qty = cart[id] || 0;

      if (e.target.closest("[data-qty-increase]")) {
        setQty(id, qty + 1);
      } else if (e.target.closest("[data-qty-decrease]")) {
        setQty(id, qty - 1);
      } else if (e.target.closest("[data-qty-remove]")) {
        setQty(id, 0);
      }
    });

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".product-card-add[data-product-id]");
      if (!btn) return;

      addToCart(btn.getAttribute("data-product-id"));
      showFeedback(btn);
    });
  });
})();
