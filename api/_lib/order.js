// CÉRULEA — Calcul de commande côté serveur (montants faisant foi)
const PRODUCTS = require("./products");

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_FEE = 4.9;
const MAX_QTY_PER_ITEM = 20;
const MAX_LINES = 30;

// Évite les erreurs d'arrondi flottant classiques (0.1 + 0.2 !== 0.3)
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Valide et normalise le panier envoyé par le client, en ignorant tout prix
// éventuellement fourni par celui-ci : seul le catalogue serveur fait foi.
function buildOrder(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    throw new Error("Panier invalide.");
  }

  const lines = items.map((item) => {
    const id = String(item && item.id || "");
    const qty = Number(item && item.qty);
    const product = PRODUCTS[id];

    if (!product || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new Error("Article de panier invalide.");
    }

    return { id, name: product.name, unitPrice: product.price, qty, lineTotal: round2(product.price * qty) };
  });

  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = round2(subtotal + shipping);

  return { lines, subtotal, shipping, total };
}

module.exports = { buildOrder, round2, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE };
