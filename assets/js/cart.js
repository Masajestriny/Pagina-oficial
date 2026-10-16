/**
 * TRINY MASAJES - CARRITO UNIFICADO (SERVICIOS Y PRODUCTOS)
 * Soporta reservas múltiples de masajes, productos de bienestar y pedidos por WhatsApp.
 */

import { BRAND_DATA, sendToWhatsApp } from "./data.js";
import { openMultiServiceBookingWithCart } from "./bookings.js";

const CART_STORAGE_KEY = "triny_wellness_cart_v1";

let cartItems = [];

// Cargar carrito desde localStorage
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      cartItems = JSON.parse(raw);
      if (!Array.isArray(cartItems)) cartItems = [];
    }
  } catch {
    cartItems = [];
  }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // Si almacenamiento está deshabilitado
  }
  updateCartBadge();
  renderCartDrawer();
}

export function getCartItems() {
  return [...cartItems];
}

export function getCartTotals() {
  let serviceCount = 0;
  let productCount = 0;
  let servicesTotal = 0;
  let productsTotal = 0;
  let totalDurationMinutes = 0;

  cartItems.forEach((item) => {
    const qty = item.quantity || 1;
    const subtotal = item.price * qty;

    if (item.type === "service") {
      serviceCount += qty;
      servicesTotal += subtotal;
      totalDurationMinutes += (item.durationMinutes || 60) * qty;
    } else {
      productCount += qty;
      productsTotal += subtotal;
    }
  });

  return {
    totalItems: serviceCount + productCount,
    serviceCount,
    productCount,
    servicesTotal,
    productsTotal,
    grandTotal: servicesTotal + productsTotal,
    totalDurationMinutes
  };
}

export function addToCart(item, quantity = 1) {
  loadCartFromStorage();
  const existing = cartItems.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + quantity;
  } else {
    cartItems.push({
      id: item.id,
      type: item.type || "service",
      title: item.title,
      price: item.price,
      durationMinutes: item.durationMinutes || 60,
      image: item.image || "assets/img/Logo de triny.jpg",
      quantity
    });
  }

  saveCartToStorage();
  showToast(`✓ ${item.title} (${quantity > 1 ? `${quantity} sesiones/uds.` : "1 sesión/ud."}) añadido al carrito.`);
}

export function updateCartQuantity(id, delta) {
  loadCartFromStorage();
  const index = cartItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    cartItems[index].quantity = (cartItems[index].quantity || 1) + delta;
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    saveCartToStorage();
  }
}

export function removeFromCart(id) {
  loadCartFromStorage();
  cartItems = cartItems.filter((i) => i.id !== id);
  saveCartToStorage();
}

export function clearCart() {
  cartItems = [];
  saveCartToStorage();
}

export function updateCartBadge() {
  const badge = document.getElementById("cartCountBadge");
  const totals = getCartTotals();
  if (badge) {
    badge.textContent = totals.totalItems;
    badge.style.display = totals.totalItems > 0 ? "inline-flex" : "none";
  }
}

export function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (!drawer || !overlay) return;

  renderCartDrawer();
  drawer.classList.add("is-open");
  overlay.classList.add("is-visible");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("btnCartDrawerClose")?.focus();
}

export function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (!drawer || !overlay) return;

  drawer.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

export function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItemsContainer");
  const footer = document.getElementById("cartDrawerFooter");
  const emptyState = document.getElementById("cartDrawerEmptyState");
  const totalAmountEl = document.getElementById("cartDrawerTotalAmount");
  const summaryDetailsEl = document.getElementById("cartDrawerSummaryDetails");

  if (!container) return;
  container.textContent = "";

  const totals = getCartTotals();

  if (cartItems.length === 0) {
    if (emptyState) emptyState.style.display = "flex";
    if (footer) footer.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (footer) footer.style.display = "block";

  // Agrupar Servicios y Productos
  const services = cartItems.filter((i) => i.type === "service");
  const products = cartItems.filter((i) => i.type === "product");

  if (services.length > 0) {
    const secHeader = document.createElement("div");
    secHeader.className = "cart-group-header";
    secHeader.innerHTML = `<span>💆‍♀️ Masajes & Sesiones (${totals.serviceCount})</span><span>${BRAND_DATA.currencySymbol} ${totals.servicesTotal}</span>`;
    container.appendChild(secHeader);

    services.forEach((s) => container.appendChild(createCartItemNode(s)));
  }

  if (products.length > 0) {
    const secHeader = document.createElement("div");
    secHeader.className = "cart-group-header";
    secHeader.style.marginTop = "1rem";
    secHeader.innerHTML = `<span>🌿 Productos de Cuidado (${totals.productCount})</span><span>${BRAND_DATA.currencySymbol} ${totals.productsTotal}</span>`;
    container.appendChild(secHeader);

    products.forEach((p) => container.appendChild(createCartItemNode(p)));
  }

  if (totalAmountEl) {
    totalAmountEl.textContent = `${BRAND_DATA.currencySymbol} ${totals.grandTotal}`;
  }

  if (summaryDetailsEl) {
    let summaryText = "";
    if (totals.serviceCount > 0 && totals.productCount > 0) {
      summaryText = `${totals.serviceCount} sesiones de masaje (${Math.round(totals.totalDurationMinutes / 60)}h) + ${totals.productCount} productos`;
    } else if (totals.serviceCount > 0) {
      summaryText = `${totals.serviceCount} sesiones de masaje (${Math.round(totals.totalDurationMinutes / 60)}h estimadas)`;
    } else {
      summaryText = `${totals.productCount} unidades de productos`;
    }
    summaryDetailsEl.textContent = summaryText;
  }
}

function createCartItemNode(item) {
  const row = document.createElement("div");
  row.className = "cart-item-row";

  // Imagen miniatura
  const img = document.createElement("img");
  img.src = item.image || "assets/img/Logo de triny.jpg";
  img.alt = item.title;
  img.className = "cart-item-thumb";
  row.appendChild(img);

  // Información
  const info = document.createElement("div");
  info.className = "cart-item-info";

  const title = document.createElement("h4");
  title.className = "cart-item-title";
  title.textContent = item.title;
  info.appendChild(title);

  const price = document.createElement("div");
  price.className = "cart-item-price";
  price.textContent = `${BRAND_DATA.currencySymbol} ${item.price} ${item.type === "service" ? "/ sesión (60 min)" : "/ ud."}`;
  info.appendChild(price);

  row.appendChild(info);

  // Controles de Cantidad (+ / -)
  const controls = document.createElement("div");
  controls.className = "cart-item-controls";

  const btnMinus = document.createElement("button");
  btnMinus.type = "button";
  btnMinus.className = "qty-btn";
  btnMinus.textContent = "−";
  btnMinus.setAttribute("aria-label", `Disminuir cantidad de ${item.title}`);
  btnMinus.addEventListener("click", () => updateCartQuantity(item.id, -1));

  const qtySpan = document.createElement("span");
  qtySpan.className = "qty-value";
  qtySpan.textContent = item.quantity;

  const btnPlus = document.createElement("button");
  btnPlus.type = "button";
  btnPlus.className = "qty-btn";
  btnPlus.textContent = "+";
  btnPlus.setAttribute("aria-label", `Aumentar cantidad de ${item.title}`);
  btnPlus.addEventListener("click", () => updateCartQuantity(item.id, 1));

  controls.appendChild(btnMinus);
  controls.appendChild(qtySpan);
  controls.appendChild(btnPlus);

  row.appendChild(controls);

  // Subtotal del ítem
  const subtotal = document.createElement("div");
  subtotal.className = "cart-item-subtotal";
  subtotal.textContent = `${BRAND_DATA.currencySymbol} ${item.price * item.quantity}`;
  row.appendChild(subtotal);

  // Botón Eliminar
  const btnDelete = document.createElement("button");
  btnDelete.type = "button";
  btnDelete.className = "cart-item-delete-btn";
  btnDelete.setAttribute("aria-label", `Eliminar ${item.title} del carrito`);
  btnDelete.innerHTML = "✕";
  btnDelete.addEventListener("click", () => removeFromCart(item.id));
  row.appendChild(btnDelete);

  return row;
}

export function showToast(message) {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

export function initCart() {
  loadCartFromStorage();
  updateCartBadge();

  const btnOpen = document.getElementById("headerCartBtn");
  const btnClose = document.getElementById("btnCartDrawerClose");
  const overlay = document.getElementById("cartDrawerOverlay");
  const btnCheckout = document.getElementById("btnCartCheckout");
  const btnClear = document.getElementById("btnCartClear");
  const btnExplore = document.getElementById("btnCartExplore");

  if (btnOpen) btnOpen.addEventListener("click", openCartDrawer);
  if (btnClose) btnClose.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (confirm("¿Deseas vaciar todos los elementos del carrito?")) {
        clearCart();
      }
    });
  }

  if (btnExplore) {
    btnExplore.addEventListener("click", () => {
      closeCartDrawer();
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Acción de Checkout / Procesar carrito
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      const totals = getCartTotals();
      if (totals.totalItems === 0) return;

      const services = cartItems.filter((i) => i.type === "service");
      const products = cartItems.filter((i) => i.type === "product");

      if (services.length > 0) {
        // Si hay servicios (con o sin productos), abrir el flujo guiado de reserva múltiple
        closeCartDrawer();
        openMultiServiceBookingWithCart(cartItems);
      } else {
        // Solo productos: Enviar directamente orden de productos a WhatsApp (Formato B)
        const name = prompt("Por favor, ingresa tu Nombre y Apellido para el pedido de productos:") || "Cliente";
        const phone = prompt("Ingresa tu número de WhatsApp de contacto:") || "";
        const address = prompt("Ingresa la dirección o condominio de entrega:") || "";

        sendToWhatsApp({
          type: "order",
          data: {
            customer: { name, phone },
            products,
            totalPrice: totals.productsTotal,
            deliveryMethod: "Entrega a domicilio / Condominio",
            address,
            notes: "Pedido generado desde la tienda de Triny Masajes."
          }
        });
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const drawer = document.getElementById("cartDrawer");
      if (drawer && drawer.classList.contains("is-open")) {
        closeCartDrawer();
      }
    }
  });
}

