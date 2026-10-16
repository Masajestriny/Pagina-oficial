/**
 * TRINY MASAJES - FORMULARIO DE ATENCIÓN AL CLIENTE
 * Envío automatizado por WhatsApp (Mensaje C) y registro simultáneo en Webhook 2 / CRM.
 */

import { BRAND_DATA, sendToWhatsApp } from "./data.js";

export function initContact() {
  const form = document.getElementById("contactForm");
  const resultBox = document.getElementById("contactResultBox");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const waDirectBtn = document.getElementById("contactDirectWaBtn");

  if (waDirectBtn) {
    const defaultText = `Hola Triny Masajes, deseo realizar una consulta general sobre sus servicios de masajes a domicilio y en casas de playa.`;
    waDirectBtn.href = `https://wa.me/${BRAND_DATA.whatsappRaw}?text=${encodeURIComponent(defaultText)}`;
  }

  if (!form) return;

  // Restaurar datos guardados si existen
  try {
    const saved = sessionStorage.getItem("triny_contact_draft");
    if (saved) {
      const d = JSON.parse(saved);
      if (d.name) form.contactName.value = d.name;
      if (d.phone) form.contactPhone.value = d.phone;
      if (d.email) form.contactEmail.value = d.email;
    }
  } catch {}

  // Auto-guardado en borrador mientras escribe
  form.addEventListener("input", () => {
    try {
      sessionStorage.setItem("triny_contact_draft", JSON.stringify({
        name: form.contactName.value,
        phone: form.contactPhone.value,
        email: form.contactEmail.value
      }));
    } catch {}
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.contactName.value.trim();
    const phone = form.contactPhone.value.trim();
    const email = form.contactEmail.value.trim();
    const subject = form.contactSubject.value;
    const relatedItem = form.contactRelatedItem ? form.contactRelatedItem.value.trim() : "";
    const message = form.contactMessage.value.trim();

    let hasError = false;

    if (name.length < 2) {
      setError("contactName", "Por favor ingresa tu nombre completo.");
      hasError = true;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 8) {
      setError("contactPhone", "Ingresa un número de WhatsApp válido.");
      hasError = true;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("contactEmail", "Ingresa un formato de correo electrónico válido.");
      hasError = true;
    }

    if (!subject) {
      setError("contactSubject", "Selecciona el motivo de tu consulta.");
      hasError = true;
    }

    if (message.length < 5) {
      setError("contactMessage", "Por favor escribe tu consulta (al menos 5 caracteres).");
      hasError = true;
    }

    if (hasError) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Preparando mensaje...";
    }

    // 1. Registro asíncrono en backend para CRM / Webhook 2
    try {
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: cleanPhone,
          email,
          subject,
          relatedItem,
          message,
          timestamp: new Date().toISOString()
        })
      }).catch((err) => console.warn("Registro de consulta en segundo plano:", err));
    } catch {}

    // 2. Despacho centralizado por WhatsApp (Formato C)
    sendToWhatsApp({
      type: "inquiry",
      data: {
        name,
        phone: cleanPhone,
        subject,
        relatedItem,
        message
      }
    });

    showSuccess("Se ha abierto WhatsApp con tu consulta estructurada. Nuestra terapeuta te responderá en breve.");

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar por WhatsApp";
    }
  });

  function setError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("is-invalid");
      const err = document.getElementById(`${fieldId}-error`);
      if (err) {
        err.textContent = msg;
        err.classList.add("is-visible");
      }
    }
  }

  function clearErrors() {
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    form.querySelectorAll(".form-error").forEach((el) => {
      el.textContent = "";
      el.classList.remove("is-visible");
    });
    if (resultBox) {
      resultBox.textContent = "";
      resultBox.style.display = "none";
    }
  }

  function showSuccess(msg) {
    if (!resultBox) return;
    resultBox.style.display = "block";
    resultBox.textContent = "";

    const alert = document.createElement("div");
    alert.className = "alert alert-success";
    alert.textContent = msg;
    resultBox.appendChild(alert);
  }
}
