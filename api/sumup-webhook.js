// CÉRULEA — Réception des notifications SumUp (return_url)
// SumUp ne fait qu'annoncer qu'un événement a eu lieu : conformément à leurs
// recommandations, on ne fait JAMAIS confiance au contenu de la requête reçue,
// on revérifie systématiquement le statut auprès de l'API avec la clé secrète.
// Ce endpoint sert de filet de sécurité / journal (visible dans les logs Vercel) ;
// la confirmation affichée au client passe par api/verify-checkout.js.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  // On répond vite dans tous les cas pour éviter les tentatives répétées de SumUp,
  // après avoir tenté la vérification.
  const id = req.body && req.body.id;
  const apiKey = process.env.SUMUP_API_KEY;

  if (id && apiKey) {
    try {
      const sumupRes = await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(String(id))}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await sumupRes.json().catch(() => null);
      if (sumupRes.ok && data) {
        console.log("sumup-webhook: checkout", data.checkout_reference, "->", data.status, data.amount, data.currency);
      } else {
        console.error("sumup-webhook: vérification échouée", sumupRes.status, data);
      }
    } catch (err) {
      console.error("sumup-webhook: erreur d'appel SumUp", err);
    }
  }

  res.status(200).end();
};
