// CÉRULEA — Crée une session de paiement hébergée SumUp
// Le montant n'est JAMAIS accepté depuis le client : il est recalculé ici
// à partir du catalogue serveur (api/_lib/products.js).
const { buildOrder } = require("./_lib/order");

const REQUIRED_CUSTOMER_FIELDS = ["firstName", "lastName", "email", "address", "zip", "city"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Coupe et nettoie un champ texte fourni par le client (pas de sauts de ligne,
// longueur raisonnable) avant de l'utiliser dans nos propres systèmes.
const cleanField = (value, maxLength) =>
  String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, maxLength);

function readCustomer(body) {
  const raw = body && typeof body.customer === "object" ? body.customer : {};

  for (const field of REQUIRED_CUSTOMER_FIELDS) {
    if (!raw[field] || !String(raw[field]).trim()) {
      throw new Error(`Champ manquant : ${field}`);
    }
  }

  const email = cleanField(raw.email, 200);
  if (!EMAIL_RE.test(email)) {
    throw new Error("E-mail invalide.");
  }

  return {
    firstName: cleanField(raw.firstName, 80),
    lastName: cleanField(raw.lastName, 80),
    email,
    phone: cleanField(raw.phone, 30),
    address: cleanField(raw.address, 200),
    addressComplement: cleanField(raw.addressComplement, 200),
    zip: cleanField(raw.zip, 12),
    city: cleanField(raw.city, 100),
  };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchantCode) {
    console.error("create-checkout: SUMUP_API_KEY ou SUMUP_MERCHANT_CODE manquant.");
    res.status(500).json({ error: "Paiement momentanément indisponible." });
    return;
  }

  let order;
  let customer;
  try {
    order = buildOrder(req.body && req.body.items);
    customer = readCustomer(req.body);
  } catch (err) {
    res.status(400).json({ error: err.message || "Requête invalide." });
    return;
  }

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  const checkoutReference = crypto.randomUUID();

  try {
    const sumupRes = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkout_reference: checkoutReference,
        amount: order.total,
        currency: "EUR",
        merchant_code: merchantCode,
        description: `Commande CÉRULEA ${checkoutReference.slice(0, 8)}`,
        redirect_url: `${siteUrl}/pages/commande-confirmation.html`,
        return_url: `${siteUrl}/api/sumup-webhook`,
        hosted_checkout: { enabled: true },
      }),
    });

    const data = await sumupRes.json().catch(() => null);

    if (!sumupRes.ok || !data || !data.hosted_checkout_url) {
      console.error("create-checkout: réponse SumUp inattendue", sumupRes.status, data);
      res.status(502).json({ error: "Impossible de créer la session de paiement. Réessayez dans un instant." });
      return;
    }

    // Le détail de la commande (articles, coordonnées) n'est volontairement pas
    // stocké côté serveur (pas de base de données sur ce site) : il est renvoyé
    // au client, qui le conserve le temps du paiement pour afficher le récapitulatif
    // final. La preuve de paiement, elle, est TOUJOURS revérifiée côté serveur
    // (voir api/verify-checkout.js) avant de considérer la commande comme payée.
    res.status(200).json({
      id: data.id,
      hostedCheckoutUrl: data.hosted_checkout_url,
      reference: checkoutReference,
      order,
      customer,
    });
  } catch (err) {
    console.error("create-checkout: erreur d'appel SumUp", err);
    res.status(502).json({ error: "Impossible de contacter le service de paiement. Réessayez dans un instant." });
  }
};
