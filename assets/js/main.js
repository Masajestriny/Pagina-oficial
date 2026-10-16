/**
 * TRINY MASAJES - CONTROLADOR PRINCIPAL
 * Coordinación modular de la aplicación, pantalla de carga y carrito.
 */

import { initNavigation } from "./navigation.js";
import { initServices } from "./services.js";
import { initProducts } from "./products.js";
import { initPromotions } from "./promotions.js";
import { initGallery } from "./gallery.js";
import { initFAQ } from "./faq.js";
import { initBookings, openBookingModal } from "./bookings.js";
import { initContact } from "./contact.js";
import { initWheel } from "./wheel.js";
import { initCRM } from "./crm.js";
import { initCart } from "./cart.js";

function hideLoadingScreen() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;

  loader.style.opacity = "0";
  loader.style.visibility = "hidden";
  loader.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    if (loader.parentNode) {
      loader.style.display = "none";
    }
  }, 450);
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de subsistemas
  initNavigation();
  initServices();
  initProducts();
  initPromotions();
  initGallery();
  initFAQ();
  initBookings();
  initContact();
  initWheel();
  initCRM();
  initCart();

  // Enlazar botones directos de acción de reserva
  const bookingTriggers = document.querySelectorAll(".action-open-booking");
  bookingTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Fecha actual en copyright del footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Desvanecer pantalla de carga de forma segura
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(hideLoadingScreen, prefersReduced ? 50 : 600);
});

// Respaldo de seguridad en caso de demora de imágenes
window.addEventListener("load", () => {
  setTimeout(hideLoadingScreen, 200);
});
