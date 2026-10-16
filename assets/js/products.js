/**
 * TRINY MASAJES - TIENDA DE PRODUCTOS DE BIENESTAR
 * Búsqueda reactiva, filtros por categorías reales y adición instantánea al carrito.
 */

import { PRODUCTS_DATA, BRAND_DATA, sendToWhatsApp } from "./data.js";
import { addToCart } from "./cart.js";

export function initProducts() {
  const container = document.getElementById("productsContainer");
  const searchInput = document.getElementById("productSearchInput");
  const sortSelect = document.getElementById("productSortSelect");
  const filterBtns = document.querySelectorAll(".product-filter-btn");

  if (!container) return;

  let currentCategory = "all";
  let currentSearch = "";
  let currentSort = "default";

  function renderProducts() {
    container.textContent = "";

    // 1. Filtrar por categoría
    let list = currentCategory === "all"
      ? [...PRODUCTS_DATA]
      : PRODUCTS_DATA.filter((p) => p.category === currentCategory);

    // 2. Filtrar por búsqueda
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 3. Ordenar
    if (currentSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === "name-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (list.length === 0) {
      const emptyBox = document.createElement("div");
      emptyBox.style.gridColumn = "1 / -1";
      emptyBox.style.padding = "3rem 1rem";
      emptyBox.style.textAlign = "center";

      const p = document.createElement("p");
      p.className = "card-desc";
      p.textContent = "No encontramos productos que coincidan con los filtros seleccionados.";
      emptyBox.appendChild(p);

      container.appendChild(emptyBox);
      return;
    }

    list.forEach((product) => {
      const card = document.createElement("article");
      card.className = "card card-product";

      // Contenedor de Imagen
      const imgWrap = document.createElement("div");
      imgWrap.className = "card-img-wrap";

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;
      img.loading = "lazy";
      img.width = 300;
      img.height = 200;
      imgWrap.appendChild(img);

      // Badge de categoría
      const badge = document.createElement("span");
      badge.className = "badge badge-champagne";
      badge.textContent = product.categoryLabel;
      badge.style.position = "absolute";
      badge.style.top = "10px";
      badge.style.left = "10px";
      imgWrap.appendChild(badge);

      card.appendChild(imgWrap);

      // Título
      const title = document.createElement("h3");
      title.className = "card-title";
      title.style.fontSize = "var(--text-md)";
      title.textContent = product.title;
      card.appendChild(title);

      // Descripción
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = product.description;
      card.appendChild(desc);

      // Meta: Precio
      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.style.marginBottom = "var(--space-3)";

      const price = document.createElement("span");
      price.className = "price-tag";
      price.textContent = `${BRAND_DATA.currencySymbol} ${product.price}`;
      meta.appendChild(price);

      const stockBadge = document.createElement("span");
      stockBadge.style.fontSize = "var(--text-xs)";
      stockBadge.style.color = "var(--color-text-reading)";
      stockBadge.textContent = `${product.stock} disponibles`;
      meta.appendChild(stockBadge);

      card.appendChild(meta);

      // Selector de cantidad y botones
      let quantity = 1;

      const actionsRow = document.createElement("div");
      actionsRow.className = "product-actions-row";

      const qtyWrap = document.createElement("div");
      qtyWrap.className = "service-qty-controls";

      const btnMinus = document.createElement("button");
      btnMinus.type = "button";
      btnMinus.className = "qty-btn";
      btnMinus.textContent = "−";
      btnMinus.setAttribute("aria-label", `Disminuir unidades de ${product.title}`);

      const qtySpan = document.createElement("span");
      qtySpan.className = "qty-value";
      qtySpan.textContent = quantity;

      const btnPlus = document.createElement("button");
      btnPlus.type = "button";
      btnPlus.className = "qty-btn";
      btnPlus.textContent = "+";
      btnPlus.setAttribute("aria-label", `Aumentar unidades de ${product.title}`);

      btnMinus.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          qtySpan.textContent = quantity;
        }
      });

      btnPlus.addEventListener("click", () => {
        quantity++;
        qtySpan.textContent = quantity;
      });

      qtyWrap.appendChild(btnMinus);
      qtyWrap.appendChild(qtySpan);
      qtyWrap.appendChild(btnPlus);
      actionsRow.appendChild(qtyWrap);

      // Botón Agregar al Carrito
      const btnAdd = document.createElement("button");
      btnAdd.type = "button";
      btnAdd.className = "btn btn-primary btn-sm";
      btnAdd.textContent = "Al Carrito";
      btnAdd.addEventListener("click", () => {
        addToCart({
          id: product.id,
          type: "product",
          title: product.title,
          price: product.price,
          image: product.image
        }, quantity);
      });
      actionsRow.appendChild(btnAdd);

      // Botón Pedir directo por WhatsApp
      const btnDirectWa = document.createElement("button");
      btnDirectWa.type = "button";
      btnDirectWa.className = "btn btn-outline btn-sm";
      btnDirectWa.textContent = "💬 Pedir";
      btnDirectWa.title = "Comprar directo por WhatsApp";
      btnDirectWa.addEventListener("click", () => {
        sendToWhatsApp({
          type: "order",
          data: {
            customer: { name: "", phone: "" },
            products: [{ title: product.title, quantity, price: product.price }],
            totalPrice: product.price * quantity,
            deliveryMethod: "Por coordinar",
            notes: "Consulta directa desde la tienda web."
          }
        });
      });
      actionsRow.appendChild(btnDirectWa);

      card.appendChild(actionsRow);

      container.appendChild(card);
    });
  }

  // Escuchar búsqueda
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderProducts();
    });
  }

  // Escuchar ordenamiento
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Escuchar filtros
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      currentCategory = btn.getAttribute("data-category") || "all";
      renderProducts();
    });
  });

  renderProducts();
}
