/**
 * TRINY MASAJES - PREGUNTAS FRECUENTES (ACORDEÓN ACCESIBLE)
 * Cumple con WAI-ARIA Accordion Pattern (aria-expanded, aria-controls, teclado).
 */

import { FAQ_DATA } from "./data.js";

export function initFAQ() {
  const container = document.getElementById("faqAccordion");
  if (!container) return;

  container.textContent = "";

  FAQ_DATA.forEach((faq, index) => {
    const item = document.createElement("div");
    item.className = "accordion-item";

    const header = document.createElement("h3");
    header.className = "accordion-header";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "accordion-trigger";
    button.id = `faq-trigger-${index}`;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `faq-panel-${index}`);

    const qText = document.createElement("span");
    qText.textContent = faq.question;

    const iconSpan = document.createElement("span");
    iconSpan.className = "accordion-icon";
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    button.appendChild(qText);
    button.appendChild(iconSpan);
    header.appendChild(button);
    item.appendChild(header);

    const panel = document.createElement("div");
    panel.id = `faq-panel-${index}`;
    panel.className = "accordion-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", `faq-trigger-${index}`);
    panel.hidden = true;

    const p = document.createElement("p");
    p.textContent = faq.answer;
    panel.appendChild(p);

    item.appendChild(panel);

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      // Opcional: cerrar los demás paneles para mantener la página compacta
      container.querySelectorAll(".accordion-trigger").forEach((otherBtn) => {
        otherBtn.setAttribute("aria-expanded", "false");
        const otherPanel = document.getElementById(otherBtn.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });

    container.appendChild(item);
  });
}

