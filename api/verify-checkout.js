// CÉRULEA — Vérifie l'état RÉEL d'un paiement auprès de SumUp
// Source de vérité unique : on ne fait jamais confiance à un statut renvoyé
// par le navigateur ou à un simple retour de redirection, on interroge
// systématiquement l'API SumUp avec la clé secrète côté serveur.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  res.setHeader("Cache-Control", "no-store");

  const id = String(req.query.id || "");
  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Identifiant de paiement invalide." });
    return;
  }

  const apiKey = process.env.SUMUP_API_KEY;
  if (!apiKey) {
    console.error("verify-checkout: SUMUP_API_KEY manquant.");
    res.status(500).json({ error: "Vérification momentanément indisponible." });
    return;
  }

  try {
    const sumupRes = await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (sumupRes.status === 404) {
      res.status(404).json({ error: "Paiement introuvable." });
      return;
    }

    const data = await sumupRes.json().catch(() => null);
    if (!sumupRes.ok || !data) {
      console.error("verify-checkout: réponse SumUp inattendue", sumupRes.status, data);
      res.status(502).json({ error: "Vérification impossible pour le moment." });
      return;
    }

    // On ne renvoie au client que le strict nécessaire à l'affichage.
    res.status(200).json({
      status: data.status,
      reference: data.checkout_reference,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (err) {
    console.error("verify-checkout: erreur d'appel SumUp", err);
    res.status(502).json({ error: "Vérification impossible pour le moment." });
  }
};
