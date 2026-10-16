/**
 * TRINY MASAJES - SISTEMA DE RESERVAS MÚLTIPLES Y FLUJO GUIADO EN 5 PASOS
 * Selección de varios masajes, cálculo de duración y sesiones, y envío estructurado por WhatsApp.
 */

import { SERVICES_DATA, BRAND_DATA, sendToWhatsApp } from "./data.js";
import { addToCart } from "./cart.js";

// Estado de la reserva en curso
let currentStep = 1;
let selectedServices = new Map(); // serviceId -> { ...service, quantity }
let attachedProducts = [];        // productos que venían del carrito si aplica
let clientData = {
  name: "",
  phone: "",
  email: "",
  locationType: "playa",
  address: "",
  date: "",
  timeSlot: "10:00",
  notes: "",
  couponCode: ""
};

let idempotencyKey = null;

function generateIdempotencyKey() {
  return "book_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

// Cargar datos previos del cliente si existen en sessionStorage
function loadPersistedClientData() {
  try {
    const saved = sessionStorage.getItem("triny_client_cache");
    if (saved) {
      const parsed = JSON.parse(saved);
      clientData = { ...clientData, ...parsed };
    }
  } catch {}
}

function persistClientData() {
  try {
    sessionStorage.setItem("triny_client_cache", JSON.stringify({
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email,
      locationType: clientData.locationType,
      address: clientData.address
    }));
  } catch {}
}

export function initBookings() {
  loadPersistedClientData();

  const modal = document.getElementById("bookingModal");
  const btnClose = document.getElementById("bookingModalClose");

  // Botones de paso
  const btnNext = document.getElementById("bookingStepNext");
  const btnPrev = document.getElementById("bookingStepPrev");
  const btnSendWhatsApp = document.getElementById("bookingBtnWhatsApp");

  if (!modal) return;

  if (btnClose) {
    btnClose.addEventListener("click", closeBookingModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeBookingModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeBookingModal();
    }
  });

  // Fecha mínima = hoy
  const inputDate = document.getElementById("step2Date");
  if (inputDate) {
    const today = new Date().toISOString().split("T")[0];
    inputDate.min = today;
  }

  // Navegación de pasos
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      goToStep(currentStep - 1);
    });
  }

  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener("click", handleFinalizeAndSend);
  }

  // Escuchar cambios en selector rápido de servicios (Paso 1)
  const quickSelect = document.getElementById("step1QuickSelect");
  if (quickSelect) {
    populateQuickSelect(quickSelect);
    quickSelect.addEventListener("change", (e) => {
      const serviceId = e.target.value;
      if (serviceId) {
        addServiceToSelection(serviceId, 1);
        e.target.value = "";
      }
    });
  }

  // Sincronizar inputs del Paso 3
  bindStep3Inputs();
}

function populateQuickSelect(selectEl) {
  selectEl.textContent = "";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "+ Agregar un masaje al listado de tu reserva...";
  selectEl.appendChild(defaultOpt);

  SERVICES_DATA.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.title} (60 min) — ${BRAND_DATA.currencySymbol} ${s.price}`;
    selectEl.appendChild(opt);
  });
}

function bindStep3Inputs() {
  const nameEl = document.getElementById("step3Name");
  const phoneEl = document.getElementById("step3Phone");
  const emailEl = document.getElementById("step3Email");
  const locationEl = document.getElementById("step3LocationType");
  const addressEl = document.getElementById("step3Address");
  const notesEl = document.getElementById("step3Notes");
  const couponEl = document.getElementById("step3Coupon");

  if (nameEl) {
    if (clientData.name) nameEl.value = clientData.name;
    nameEl.addEventListener("input", (e) => { clientData.name = e.target.value; persistClientData(); });
  }
  if (phoneEl) {
    if (clientData.phone) phoneEl.value = clientData.phone;
    phoneEl.addEventListener("input", (e) => { clientData.phone = e.target.value; persistClientData(); });
  }
  if (emailEl) {
    if (clientData.email) emailEl.value = clientData.email;
    emailEl.addEventListener("input", (e) => { clientData.email = e.target.value; persistClientData(); });
  }
  if (locationEl) {
    if (clientData.locationType) locationEl.value = clientData.locationType;
    locationEl.addEventListener("change", (e) => { clientData.locationType = e.target.value; persistClientData(); });
  }
  if (addressEl) {
    if (clientData.address) addressEl.value = clientData.address;
    addressEl.addEventListener("input", (e) => { clientData.address = e.target.value; persistClientData(); });
  }
  if (notesEl) {
    notesEl.addEventListener("input", (e) => { clientData.notes = e.target.value; });
  }
  if (couponEl) {
    couponEl.addEventListener("input", (e) => { clientData.couponCode = e.target.value; });
  }

  // Paso 2: Fecha y Hora
  const dateEl = document.getElementById("step2Date");
  const timeEl = document.getElementById("step2Time");
  if (dateEl) {
    dateEl.addEventListener("change", (e) => { clientData.date = e.target.value; });
  }
  if (timeEl) {
    timeEl.addEventListener("change", (e) => { clientData.timeSlot = e.target.value; });
  }
}

export function openBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  idempotencyKey = generateIdempotencyKey();
  modal.classList.add("is-active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Si no hay servicios seleccionados, preseleccionar por defecto "Masaje Relajante"
  if (selectedServices.size === 0) {
    addServiceToSelection("masaje-relajante", 1);
  }

  goToStep(1);
}

export function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  modal.classList.remove("is-active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

export function openBookingWithService(serviceId) {
  selectedServices.clear();
  addServiceToSelection(serviceId, 1);
  openBookingModal();
}

export function openBookingWithPackage(packageId) {
  selectedServices.clear();
  if (packageId === "promo-duo-relax") {
    addServiceToSelection("masaje-relajante", 2);
  } else if (packageId === "promo-pack-maderoterapia") {
    addServiceToSelection("maderoterapia-corporal", 5);
  } else if (packageId === "promo-circuito-playa") {
    addServiceToSelection("masaje-descontracturante", 1);
    addServiceToSelection("exfoliacion-corporal", 1);
    addServiceToSelection("reflexologia-podal", 1);
  } else {
    addServiceToSelection("masaje-relajante", 1);
  }
  openBookingModal();
}

export function openMultiServiceBookingWithCart(cartItems) {
  selectedServices.clear();
  attachedProducts = [];

  cartItems.forEach((item) => {
    if (item.type === "service") {
      addServiceToSelection(item.id, item.quantity || 1);
    } else {
      attachedProducts.push(item);
    }
  });

  openBookingModal();
}

export function addServiceToSelection(serviceId, qty = 1) {
  const service = SERVICES_DATA.find((s) => s.id === serviceId);
  if (!service) return;

  if (selectedServices.has(serviceId)) {
    const current = selectedServices.get(serviceId);
    current.quantity += qty;
  } else {
    selectedServices.set(serviceId, {
      id: service.id,
      title: service.title,
      price: service.price, // S/ 100
      durationMinutes: service.durationMinutes || 60,
      quantity: qty
    });
  }
  renderStep1ServicesList();
}

export function updateServiceQuantity(serviceId, delta) {
  if (selectedServices.has(serviceId)) {
    const item = selectedServices.get(serviceId);
    item.quantity += delta;
    if (item.quantity <= 0) {
      selectedServices.delete(serviceId);
    }
    renderStep1ServicesList();
  }
}

export function removeServiceFromSelection(serviceId) {
  selectedServices.delete(serviceId);
  renderStep1ServicesList();
}

export function clearServicesSelection() {
  selectedServices.clear();
  renderStep1ServicesList();
}

// Renderizar la lista interactiva de masajes seleccionados en el Paso 1
function renderStep1ServicesList() {
  const container = document.getElementById("step1ServicesList");
  const summaryBox = document.getElementById("step1SubtotalBar");
  if (!container) return;

  container.textContent = "";

  if (selectedServices.size === 0) {
    const emptyNotice = document.createElement("div");
    emptyNotice.style.padding = "1.5rem";
    emptyNotice.style.textAlign = "center";
    emptyNotice.style.color = "var(--color-text-reading)";
    emptyNotice.innerHTML = "<p>No has añadido ningún masaje a tu reserva aún.</p><p style='font-size:var(--text-xs);margin-top:4px;'>Usa el selector superior o explora el catálogo para agregar tus masajes preferidos.</p>";
    container.appendChild(emptyNotice);

    if (summaryBox) {
      summaryBox.innerHTML = `<strong>Total: S/ 0</strong> (0 sesiones seleccionadas)`;
    }
    return;
  }

  let totalSessions = 0;
  let totalPrice = 0;
  let totalMinutes = 0;

  selectedServices.forEach((item) => {
    totalSessions += item.quantity;
    const subtotal = item.price * item.quantity;
    totalPrice += subtotal;
    totalMinutes += item.durationMinutes * item.quantity;

    const row = document.createElement("div");
    row.className = "booking-service-item";

    const titleDiv = document.createElement("div");
    titleDiv.className = "booking-service-title";
    titleDiv.innerHTML = `<strong>${item.title}</strong><span style="display:block;font-size:var(--text-xs);color:var(--color-text-reading);">Duración: ${item.durationMinutes} min • S/ ${item.price} c/u</span>`;
    row.appendChild(titleDiv);

    // Controles + / -
    const controls = document.createElement("div");
    controls.className = "booking-service-controls";

    const btnMinus = document.createElement("button");
    btnMinus.type = "button";
    btnMinus.className = "qty-btn";
    btnMinus.textContent = "−";
    btnMinus.setAttribute("aria-label", `Reducir sesiones de ${item.title}`);
    btnMinus.addEventListener("click", () => updateServiceQuantity(item.id, -1));

    const qtySpan = document.createElement("span");
    qtySpan.className = "qty-value";
    qtySpan.textContent = `${item.quantity} ${item.quantity === 1 ? "sesión" : "sesiones"}`;

    const btnPlus = document.createElement("button");
    btnPlus.type = "button";
    btnPlus.className = "qty-btn";
    btnPlus.textContent = "+";
    btnPlus.setAttribute("aria-label", `Aumentar sesiones de ${item.title}`);
    btnPlus.addEventListener("click", () => updateServiceQuantity(item.id, 1));

    controls.appendChild(btnMinus);
    controls.appendChild(qtySpan);
    controls.appendChild(btnPlus);
    row.appendChild(controls);

    // Subtotal
    const subtotalEl = document.createElement("div");
    subtotalEl.className = "booking-service-subtotal";
    subtotalEl.textContent = `${BRAND_DATA.currencySymbol} ${subtotal}`;
    row.appendChild(subtotalEl);

    // Eliminar
    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "cart-item-delete-btn";
    btnDel.innerHTML = "✕";
    btnDel.setAttribute("aria-label", `Quitar ${item.title}`);
    btnDel.addEventListener("click", () => removeServiceFromSelection(item.id));
    row.appendChild(btnDel);

    container.appendChild(row);
  });

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durStr = `${hours}h${mins > 0 ? ` ${mins}m` : ""}`;

  if (summaryBox) {
    summaryBox.innerHTML = `<div><strong>Total Estimado: ${BRAND_DATA.currencySymbol} ${totalPrice}</strong> <span style="font-size:var(--text-xs);color:var(--color-text-reading);display:block;">${totalSessions} ${totalSessions === 1 ? "sesión" : "sesiones"} • Duración total estimada: ${durStr}</span></div>`;
  }
}

// Navegar entre pasos del 1 al 5
function goToStep(step) {
  if (step < 1 || step > 5) return;
  currentStep = step;

  // Actualizar indicadores visuales de pasos
  document.querySelectorAll(".booking-progress-step").forEach((el, idx) => {
    const stepNumber = idx + 1;
    el.classList.remove("is-active", "is-completed");
    if (stepNumber < currentStep) {
      el.classList.add("is-completed");
    } else if (stepNumber === currentStep) {
      el.classList.add("is-active");
    }
  });

  // Ocultar todas las vistas de pasos y mostrar la actual
  document.querySelectorAll(".booking-step-view").forEach((view) => {
    view.style.display = "none";
  });
  const currentView = document.getElementById(`bookingStepView${currentStep}`);
  if (currentView) currentView.style.display = "block";

  // Botones de navegación inferior
  const btnPrev = document.getElementById("bookingStepPrev");
  const btnNext = document.getElementById("bookingStepNext");
  const btnSendWhatsApp = document.getElementById("bookingBtnWhatsApp");

  if (btnPrev) btnPrev.style.display = currentStep > 1 ? "inline-flex" : "none";
  if (btnNext) btnNext.style.display = currentStep < 4 ? "inline-flex" : "none";
  if (btnSendWhatsApp) btnSendWhatsApp.style.display = currentStep === 4 ? "inline-flex" : "none";

  if (currentStep === 1) {
    renderStep1ServicesList();
  } else if (currentStep === 2) {
    updateStep2DurationPreview();
  } else if (currentStep === 4) {
    renderStep4Summary();
  }
}

function updateStep2DurationPreview() {
  const preview = document.getElementById("step2DurationAlert");
  if (!preview) return;

  let totalMins = 0;
  selectedServices.forEach((s) => {
    totalMins += (s.durationMinutes || 60) * s.quantity;
  });

  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  preview.innerHTML = `ℹ Has solicitado un tiempo total aproximado de <strong>${hours}h${mins > 0 ? ` ${mins}m` : ""}</strong>. Si son sesiones consecutivas o para varios acompañantes en casa de playa, coordinaremos la disponibilidad exacta con nuestras terapeutas por WhatsApp.`;
}

function validateStep(step) {
  clearStepErrors();

  if (step === 1) {
    if (selectedServices.size === 0) {
      showStepError("Debes seleccionar al menos un masaje para tu reserva.");
      return false;
    }
    return true;
  }

  if (step === 2) {
    const dateVal = document.getElementById("step2Date")?.value;
    const timeVal = document.getElementById("step2Time")?.value;

    if (!dateVal) {
      showStepError("Por favor selecciona una fecha válida para tu cita.");
      return false;
    }
    const today = new Date().toISOString().split("T")[0];
    if (dateVal < today) {
      showStepError("La fecha seleccionada no puede ser en el pasado.");
      return false;
    }
    if (!timeVal) {
      showStepError("Por favor indica el horario de preferencia.");
      return false;
    }
    clientData.date = dateVal;
    clientData.timeSlot = timeVal;
    return true;
  }

  if (step === 3) {
    const nameVal = document.getElementById("step3Name")?.value.trim();
    const phoneVal = document.getElementById("step3Phone")?.value.trim();
    const addressVal = document.getElementById("step3Address")?.value.trim();
    const consentVal = document.getElementById("step3Consent")?.checked;

    if (!nameVal || nameVal.length < 3) {
      showStepError("Ingresa tu nombre y apellido (mínimo 3 caracteres).");
      return false;
    }
    const phoneClean = (phoneVal || "").replace(/\D/g, "");
    if (phoneClean.length < 8) {
      showStepError("Ingresa un número de WhatsApp válido (ej: 986 820 428).");
      return false;
    }
    if (!addressVal || addressVal.length < 3) {
      showStepError("Indica la dirección o condominio de playa donde se prestará el servicio.");
      return false;
    }
    if (!consentVal) {
      showStepError("Debes aceptar el consentimiento de datos y confirmar espacio para la camilla.");
      return false;
    }

    clientData.name = nameVal;
    clientData.phone = phoneClean;
    clientData.address = addressVal;
    persistClientData();
    return true;
  }

  return true;
}

function showStepError(msg) {
  const errBox = document.getElementById(`bookingStepErrorBox${currentStep}`);
  if (errBox) {
    errBox.textContent = msg;
    errBox.style.display = "block";
  }
}

function clearStepErrors() {
  document.querySelectorAll(".booking-step-error").forEach((el) => {
    el.textContent = "";
    el.style.display = "none";
  });
}

// Paso 4: Renderizar el resumen completo antes del envío
function renderStep4Summary() {
  const container = document.getElementById("step4SummaryContent");
  if (!container) return;

  container.textContent = "";

  const box = document.createElement("div");
  box.className = "booking-summary-card";

  // 1. Datos del Cliente
  const clientSec = document.createElement("div");
  clientSec.style.marginBottom = "1rem";
  clientSec.style.paddingBottom = "0.75rem";
  clientSec.style.borderBottom = "1px solid var(--color-border-light)";
  clientSec.innerHTML = `
    <h4 style="font-size:var(--text-sm);text-transform:uppercase;color:var(--color-gold-dark);margin-bottom:6px;letter-spacing:0.05em;">Datos del Cliente</h4>
    <p style="margin:0;font-size:var(--text-sm);"><strong>${clientData.name}</strong> • WhatsApp: <strong>${clientData.phone}</strong></p>
    <p style="margin:4px 0 0;font-size:var(--text-xs);color:var(--color-text-reading);">${clientData.locationType} — ${clientData.address}</p>
    <p style="margin:4px 0 0;font-size:var(--text-xs);color:var(--color-blue-night);"><strong>Fecha:</strong> ${clientData.date} | <strong>Hora:</strong> ${clientData.timeSlot}</p>
  `;
  box.appendChild(clientSec);

  // 2. Servicios Solicitados
  const servSec = document.createElement("div");
  servSec.style.marginBottom = "1rem";
  servSec.innerHTML = `<h4 style="font-size:var(--text-sm);text-transform:uppercase;color:var(--color-gold-dark);margin-bottom:6px;letter-spacing:0.05em;">Masajes Solicitados</h4>`;

  let totalServicesPrice = 0;
  let totalMins = 0;

  selectedServices.forEach((s) => {
    const sub = s.price * s.quantity;
    totalServicesPrice += sub;
    totalMins += (s.durationMinutes || 60) * s.quantity;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.fontSize = "var(--text-sm)";
    row.style.marginBottom = "4px";
    row.innerHTML = `<span>• ${s.title} × <strong>${s.quantity}</strong></span><span>${BRAND_DATA.currencySymbol} ${sub}</span>`;
    servSec.appendChild(row);
  });

  // Productos si venían del carrito
  let totalProductsPrice = 0;
  if (attachedProducts.length > 0) {
    const prodHeader = document.createElement("div");
    prodHeader.style.marginTop = "8px";
    prodHeader.style.fontWeight = "600";
    prodHeader.style.fontSize = "var(--text-xs)";
    prodHeader.textContent = "Productos complementarios del carrito:";
    servSec.appendChild(prodHeader);

    attachedProducts.forEach((p) => {
      const sub = p.price * p.quantity;
      totalProductsPrice += sub;
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.fontSize = "var(--text-xs)";
      row.innerHTML = `<span>• ${p.title} × ${p.quantity}</span><span>${BRAND_DATA.currencySymbol} ${sub}</span>`;
      servSec.appendChild(row);
    });
  }

  box.appendChild(servSec);

  // 3. Totales y Duración
  const grandTotal = totalServicesPrice + totalProductsPrice;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const totalSec = document.createElement("div");
  totalSec.style.paddingTop = "0.75rem";
  totalSec.style.borderTop = "2px solid var(--color-border-light)";
  totalSec.style.display = "flex";
  totalSec.style.justifyContent = "space-between";
  totalSec.style.alignItems = "baseline";
  totalSec.innerHTML = `
    <div>
      <span style="font-size:var(--text-xs);color:var(--color-text-reading);display:block;">Duración total: ~${hours}h${mins > 0 ? ` ${mins}m` : ""}</span>
      <strong>Total Estimado:</strong>
    </div>
    <span style="font-size:var(--text-2xl);font-weight:700;color:var(--color-blue-night);font-family:var(--font-serif);">${BRAND_DATA.currencySymbol} ${grandTotal}</span>
  `;
  box.appendChild(totalSec);

  container.appendChild(box);
}

// Paso 5: Enviar solicitud estructurada por WhatsApp y registrar en backend
async function handleFinalizeAndSend() {
  const btnSend = document.getElementById("bookingBtnWhatsApp");
  if (btnSend) {
    btnSend.disabled = true;
    btnSend.textContent = "Generando solicitud...";
  }

  const servicesArr = Array.from(selectedServices.values());
  const totals = servicesArr.reduce((acc, s) => acc + (s.price * s.quantity), 0);

  const payload = {
    idempotencyKey: idempotencyKey || generateIdempotencyKey(),
    customerName: clientData.name,
    customerPhone: clientData.phone,
    customerEmail: clientData.email,
    services: servicesArr,
    products: attachedProducts,
    locationType: clientData.locationType,
    address: clientData.address,
    date: clientData.date,
    timeSlot: clientData.timeSlot,
    notes: clientData.notes,
    couponCode: clientData.couponCode
  };

  // 1. Registro asíncrono en backend para CRM y Webhook 1
  try {
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch((err) => console.warn("Registro en backend en segundo plano:", err));
  } catch {}

  // 2. Preparar mensaje A y abrir WhatsApp
  sendToWhatsApp({
    type: "booking",
    data: {
      customer: {
        name: clientData.name,
        phone: clientData.phone,
        locationType: clientData.locationType,
        address: clientData.address
      },
      services: servicesArr,
      date: clientData.date,
      timeSlot: clientData.timeSlot,
      totalPrice: totals,
      notes: clientData.notes
    }
  });

  // 3. Mostrar pantalla de éxito y cierre
  const step4View = document.getElementById("bookingStepView4");
  if (step4View) {
    step4View.innerHTML = `
      <div style="text-align:center;padding:2rem 1rem;">
        <span style="font-size:3rem;display:block;margin-bottom:1rem;">✅</span>
        <h3 style="font-size:var(--text-xl);color:var(--color-blue-night);margin-bottom:0.5rem;">¡Solicitud de Reserva Preparada!</h3>
        <p style="font-size:var(--text-sm);color:var(--color-text-reading);max-width:440px;margin:0 auto 1.5rem;">
          Se ha abierto tu aplicación de WhatsApp con el resumen completo de tu reserva. 
          Nuestra terapeuta te confirmará la disponibilidad del horario y coordinará el acceso a tu residencia o condominio.
        </p>
        <button type="button" class="btn btn-primary" onclick="document.getElementById('bookingModalClose').click()">
          Aceptar y Cerrar
        </button>
      </div>
    `;
    document.getElementById("bookingStepPrev").style.display = "none";
    if (btnSend) btnSend.style.display = "none";
  }
}
