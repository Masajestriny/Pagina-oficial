/**
 * TRINY MASAJES - CATÁLOGO DE SERVICIOS
 * 23 Servicios a S/ 100 (60 min) con controles de sesiones, detalles y carrito.
 */

import { SERVICES_DATA, BRAND_DATA } from "./data.js";
import { openBookingWithService, addServiceToSelection, openBookingModal } from "./bookings.js";
import { addToCart } from "./cart.js";

export function initServices() {
  const container = document.getElementById("servicesContainer");
  const filterBtns = document.querySelectorAll(".services-filter-btn");

  if (!container) return;

  function renderServices(filter = "all") {
    container.textContent = "";

    const filtered = filter === "all"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === filter);

    if (filtered.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.className = "card-desc";
      emptyMsg.textContent = "No se encontraron servicios en esta categoría.";
      container.appendChild(emptyMsg);
      return;
    }

    filtered.forEach((service) => {
      const card = document.createElement("article");
      card.className = "card card-service";

      // Contenedor de Imagen
      const imgWrap = document.createElement("div");
      imgWrap.className = "card-img-wrap";

      const img = document.createElement("img");
      img.src = service.image;
      img.alt = `Tratamiento de ${service.title} en Triny Masajes`;
      img.loading = "lazy";
      img.width = 400;
      img.height = 250;
      imgWrap.appendChild(img);

      // Badge de Categoría
      const badge = document.createElement("span");
      badge.className = "badge badge-navy";
      badge.textContent = service.categoryLabel;
      badge.style.position = "absolute";
      badge.style.top = "12px";
      badge.style.left = "12px";
      imgWrap.appendChild(badge);

      card.appendChild(imgWrap);

      // Título
      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = service.title;
      card.appendChild(title);

      // Descripción
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = service.description;
      card.appendChild(desc);

      // Metadatos: Duración y Precio
      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.style.marginBottom = "var(--space-3)";

      const priceBox = document.createElement("div");
      const duration = document.createElement("span");
      duration.className = "price-duration";
      duration.textContent = `⏱️ Duración: ${service.duration}`;

      const price = document.createElement("span");
      price.className = "price-tag";
      price.textContent = `${BRAND_DATA.currencySymbol} ${service.price}`;

      priceBox.appendChild(duration);
      priceBox.appendChild(price);
      meta.appendChild(priceBox);

      // Botón "Más información"
      const btnInfo = document.createElement("button");
      btnInfo.type = "button";
      btnInfo.className = "btn btn-outline btn-sm";
      btnInfo.textContent = "Más info";
      btnInfo.setAttribute("aria-label", `Más información sobre ${service.title}`);
      btnInfo.addEventListener("click", () => openServiceDetailsModal(service));
      meta.appendChild(btnInfo);

      card.appendChild(meta);

      // Selector de sesiones (+ / -) y Botones de Acción
      let sessionCount = 1;

      const actionsRow = document.createElement("div");
      actionsRow.className = "service-actions-row";

      const qtyWrap = document.createElement("div");
      qtyWrap.className = "service-qty-controls";

      const btnMinus = document.createElement("button");
      btnMinus.type = "button";
      btnMinus.className = "qty-btn";
      btnMinus.textContent = "−";
      btnMinus.setAttribute("aria-label", `Disminuir sesiones de ${service.title}`);

      const qtySpan = document.createElement("span");
      qtySpan.className = "qty-value";
      qtySpan.textContent = sessionCount;

      const btnPlus = document.createElement("button");
      btnPlus.type = "button";
      btnPlus.className = "qty-btn";
      btnPlus.textContent = "+";
      btnPlus.setAttribute("aria-label", `Aumentar sesiones de ${service.title}`);

      btnMinus.addEventListener("click", () => {
        if (sessionCount > 1) {
          sessionCount--;
          qtySpan.textContent = sessionCount;
        }
      });

      btnPlus.addEventListener("click", () => {
        sessionCount++;
        qtySpan.textContent = sessionCount;
      });

      qtyWrap.appendChild(btnMinus);
      qtyWrap.appendChild(qtySpan);
      qtyWrap.appendChild(btnPlus);
      actionsRow.appendChild(qtyWrap);

      // Botón Reservar
      const btnBook = document.createElement("button");
      btnBook.className = "btn btn-primary btn-sm";
      btnBook.type = "button";
      btnBook.textContent = "Reservar";
      btnBook.setAttribute("aria-label", `Reservar ${service.title}`);
      btnBook.addEventListener("click", () => {
        addServiceToSelection(service.id, sessionCount);
        openBookingModal();
      });
      actionsRow.appendChild(btnBook);

      // Botón Agregar al carrito
      const btnCart = document.createElement("button");
      btnCart.className = "btn btn-gold btn-sm";
      btnCart.type = "button";
      btnCart.title = "Añadir a tu carrito de masajes";
      btnCart.textContent = "🛒 Al carrito";
      btnCart.addEventListener("click", () => {
        addToCart({
          id: service.id,
          type: "service",
          title: service.title,
          price: service.price,
          durationMinutes: service.durationMinutes || 60,
          image: service.image
        }, sessionCount);
      });
      actionsRow.appendChild(btnCart);

      card.appendChild(actionsRow);

      container.appendChild(card);
    });
  }

  // Filtros de categoría
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      const category = btn.getAttribute("data-category") || "all";
      renderServices(category);
    });
  });

  renderServices("all");
}

/**
 * Modal de Detalles de Servicio
 */
function openServiceDetailsModal(service) {
  let modal = document.getElementById("serviceDetailsModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "serviceDetailsModal";
    modal.className = "modal-overlay";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    document.body.appendChild(modal);
  }

  modal.textContent = "";

  const dialog = document.createElement("div");
  dialog.className = "modal-dialog";

  const header = document.createElement("div");
  header.className = "modal-header";
  header.innerHTML = `
    <h3 class="modal-title">${service.title}</h3>
    <button type="button" class="modal-close-btn" id="btnCloseDetailsModal" aria-label="Cerrar ventana">
      ✕
    </button>
  `;
  dialog.appendChild(header);

  const body = document.createElement("div");
  body.className = "modal-body";

  const img = document.createElement("img");
  img.src = service.image;
  img.alt = service.title;
  img.style.borderRadius = "var(--radius-sm)";
  img.style.maxHeight = "220px";
  img.style.width = "100%";
  img.style.objectFit = "cover";
  img.style.marginBottom = "1rem";
  body.appendChild(img);

  const desc = document.createElement("p");
  desc.style.fontSize = "var(--text-sm)";
  desc.style.lineHeight = "var(--leading-relaxed)";
  desc.textContent = service.description;
  body.appendChild(desc);

  const benTitle = document.createElement("h4");
  benTitle.style.fontSize = "var(--text-sm)";
  benTitle.style.marginTop = "1rem";
  benTitle.style.marginBottom = "0.5rem";
  benTitle.textContent = "Beneficios Clínicos y Físicos:";
  body.appendChild(benTitle);

  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.fontSize = "var(--text-xs)";
  service.benefits.forEach((b) => {
    const li = document.createElement("li");
    li.style.marginBottom = "4px";
    li.textContent = `✓ ${b}`;
    ul.appendChild(li);
  });
  body.appendChild(ul);

  const footer = document.createElement("div");
  footer.className = "modal-footer";
  footer.style.justifyContent = "space-between";
  footer.innerHTML = `
    <div>
      <span style="font-size:var(--text-xs);color:var(--color-text-reading);display:block;">Duración: ${service.duration}</span>
      <strong style="font-size:var(--text-xl);color:var(--color-blue-night);">${BRAND_DATA.currencySymbol} ${service.price}</strong>
    </div>
  `;

  const btnAction = document.createElement("button");
  btnAction.type = "button";
  btnAction.className = "btn btn-primary";
  btnAction.textContent = "Reservar Ahora";
  btnAction.addEventListener("click", () => {
    modal.classList.remove("is-active");
    openBookingWithService(service.id);
  });
  footer.appendChild(btnAction);

  dialog.appendChild(body);
  dialog.appendChild(footer);
  modal.appendChild(dialog);

  modal.classList.add("is-active");
  document.getElementById("btnCloseDetailsModal")?.addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
}
