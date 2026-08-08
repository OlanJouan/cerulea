// CÉRULEA — Formulaire newsletter (démo, aucun envoi réel)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;

  const feedback = form.querySelector("[data-newsletter-feedback]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    const email = input?.value.trim();

    if (!email) return;

    if (feedback) {
      feedback.textContent = `Merci ! Votre code de -10% arrive à ${email}.`;
    }
    form.reset();
  });
});
