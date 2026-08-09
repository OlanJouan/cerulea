// CÉRULEA — Inscription newsletter (envoi réel via Web3Forms)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;

  // Le message de retour est un frère du formulaire, pas un enfant : on le cherche dans le document.
  const feedback = document.querySelector("[data-newsletter-feedback]");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    const email = input?.value.trim();
    if (!email) return;

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Envoi…";
    if (feedback) {
      feedback.style.color = "";
      feedback.textContent = "";
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || "Échec de l'envoi");
        if (feedback) {
          feedback.textContent = `Merci ! Votre code de -10% arrive à ${email}.`;
        }
        form.reset();
      })
      .catch(() => {
        if (feedback) {
          feedback.style.color = "#FFD9C7";
          feedback.textContent = "L'inscription a échoué. Réessayez dans un instant.";
        }
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
});
