// CÉRULEA — Catalogue produit côté serveur (source de vérité pour les prix)
// Doit rester synchronisé avec js/products.js (catalogue affiché côté client).
// Les prix ne sont JAMAIS pris depuis le client lors de la création d'un paiement :
// on recalcule toujours le total ici, à partir de cette liste.
module.exports = {
  "ampoules-sommeil-profond": { name: "Ampoules Sommeil Profond", price: 22.9 },
  "tisane-nuit-calme": { name: "Tisane Nuit Calme", price: 12.5 },
  "duo-sommeil-detente": { name: "Duo Sommeil & Détente", price: 36.9 },
  "complexe-vitalite-marine": { name: "Complexe Vitalité Marine", price: 24.9 },
  "gelules-memoire-claire": { name: "Gélules Mémoire Claire", price: 19.9 },
  "cure-vitalite-30-jours": { name: "Cure Vitalité 30 Jours", price: 44.9 },
  "infusion-digestion-douce": { name: "Infusion Digestion Douce", price: 11.9 },
  "concentre-drainage-marin": { name: "Concentré Drainage Marin", price: 21.9 },
  "serum-immunite-boreale": { name: "Sérum Immunité Boréale", price: 23.5 },
  "duo-immunite-hiver": { name: "Duo Immunité Hiver", price: 39.9 },
  "fluide-circulation-fraicheur": { name: "Fluide Circulation Fraîcheur", price: 18.9 },
  "gelules-articulations-profondeur": { name: "Gélules Articulations Profondeur", price: 26.9 },
  "baume-articulations-chaleur": { name: "Baume Articulations Chaleur", price: 17.5 },
  "huile-peau-eclat-marin": { name: "Huile Peau Éclat Marin", price: 29.9 },
  "complexe-peau-hydratation": { name: "Complexe Hydratation Profonde", price: 27.9 },
  "sels-bain-detox-minerale": { name: "Sels de Bain Détox Minérale", price: 15.9 },
};
