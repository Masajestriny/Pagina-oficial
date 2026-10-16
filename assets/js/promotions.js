/**
 * TRINY MASAJES - PROMOCIONES Y PAQUETES DE SESIONES
 */

import { PROMOTIONS_DATA, BRAND_DATA } from "./data.js";
import { openBookingWithPackage } from "./bookings.js";

export function initPromotions() {
  const container = document.getElementById("promotionsContainer");
  if (!container) return;

  container.textContent = "";

  PROMOTIONS_DATA.forEach((promo) => {
    const card = document.createElement("article");
    card.className = "card card-promo";

    // Badge
    const badge = document.createElement("span");
    badge.className = "badge badge-terracotta";
    badge.textContent = promo.badge;
    badge.style.alignSelf = "flex-start";
    badge.style.marginBottom = "var(--space-3)";
    card.appendChild(badge);

    // Título
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = promo.title;
    card.appendChild(title);

    // Sesiones
    const sessions = document.createElement("p");
    sessions.style.fontSize = "var(--text-xs)";
    sessions.style.fontWeight = "600";
    sessions.style.color = "var(--color-terracotta)";
    sessions.style.textTransform = "uppercase";
    sessions.style.letterSpacing = "0.08em";
    sessions.textContent = promo.sessions;
    card.appendChild(sessions);

    // Descripción
    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = promo.description;
    card.appendChild(desc);

    // Lista de inclusiones
    const incList = document.createElement("ul");
    incList.style.listStyle = "none";
    incList.style.padding = "0";
    incList.style.margin = "0 0 1.5rem 0";
    incList.style.fontSize = "var(--text-xs)";
    incList.style.color = "var(--color-stone)";

    promo.includes.forEach((item) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "baseline";
      li.style.gap = "6px";
      li.style.marginBottom = "6px";

      const mark = document.createElement("span");
      mark.textContent = "✦";
      mark.style.color = "var(--color-terracotta)";

      const txt = document.createElement("span");
      txt.textContent = item;

      li.appendChild(mark);
      li.appendChild(txt);
      incList.appendChild(li);
    });
    card.appendChild(incList);

    // Meta precios
    const meta = document.createElement("div");
    meta.className = "card-meta";

    const priceBox = document.createElement("div");

    const regular = document.createElement("span");
    regular.style.fontSize = "var(--text-xs)";
    regular.style.textDecoration = "line-through";
    regular.style.color = "var(--color-taupe)";
    regular.style.marginRight = "8px";
    regular.textContent = `Normal: ${BRAND_DATA.currency} ${promo.priceRegular}`;

    const promoPrice = document.createElement("span");
    promoPrice.className = "price-tag";
    promoPrice.textContent = `${BRAND_DATA.currency} ${promo.pricePromo}`;

    const savingsBadge = document.createElement("span");
    savingsBadge.className = "badge badge-success";
    savingsBadge.style.display = "block";
    savingsBadge.style.marginTop = "4px";
    savingsBadge.textContent = `Ahorro real de ${BRAND_DATA.currency} ${promo.savings}`;

    priceBox.appendChild(regular);
    priceBox.appendChild(promoPrice);
    priceBox.appendChild(savingsBadge);
    meta.appendChild(priceBox);

    // Botón Reservar Paquete
    const btnBook = document.createElement("button");
    btnBook.className = "btn btn-primary btn-sm";
    btnBook.type = "button";
    btnBook.textContent = "Agendar Paquete";
    btnBook.setAttribute("aria-label", `Agendar ${promo.title}`);
    btnBook.addEventListener("click", () => {
      openBookingWithPackage(promo.id);
    });

    meta.appendChild(btnBook);
    card.appendChild(meta);

    container.appendChild(card);
  });
}

