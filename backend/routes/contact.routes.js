/**
 * TRINY MASAJES - RUTAS DE CONTACTO
 * Despacho a Webhook 2 (Atención al cliente) con firma HMAC.
 */

import { Router } from "express";
import { store } from "../data/store.js";
import { dispatchWebhook } from "../integrations/webhooks.js";
import { createRateLimiter, sanitizeString } from "../middleware/security.js";

const router = Router();

// Rate limit: máx 8 consultas por media hora
const contactRateLimit = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 8,
  message: "Has enviado varios mensajes recientemente. Por favor espera unos minutos."
});

router.post("/", contactRateLimit, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email);
    const cleanPhone = sanitizeString(phone);
    const cleanSubject = sanitizeString(subject);
    const cleanMessage = sanitizeString(message);

    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, message: "Nombre requerido (mínimo 2 letras)." });
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Correo electrónico no válido." });
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      return res.status(400).json({ success: false, message: "Teléfono de contacto requerido." });
    }

    if (!cleanMessage || cleanMessage.length < 8) {
      return res.status(400).json({ success: false, message: "Mensaje demasiado breve." });
    }

    const inquiryId = `INQ-${Date.now().toString().slice(-5)}`;
    const newInquiry = {
      id: inquiryId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject || "Consulta general",
      message: cleanMessage,
      timestamp: new Date().toISOString()
    };

    store.inquiries.push(newInquiry);

    // Despacho a Webhook 2 (Consultas)
    const webhookPayload = {
      event: "customer_inquiry.received",
      inquiryId: newInquiry.id,
      timestamp: newInquiry.timestamp,
      sender: {
        name: newInquiry.name,
        email: newInquiry.email,
        phone: newInquiry.phone
      },
      content: {
        subject: newInquiry.subject,
        message: newInquiry.message
      }
    };

    dispatchWebhook("contact", webhookPayload).catch((err) => {
      console.warn("Fallo de webhook de contacto:", err);
    });

    return res.status(200).json({
      success: true,
      message: "Consulta recibida correctamente. Nos comunicaremos a la brevedad.",
      inquiryId
    });

  } catch (err) {
    console.error("Error al procesar consulta:", err);
    return res.status(500).json({
      success: false,
      message: "Ocurrió un error al procesar tu consulta."
    });
  }
});

export default router;

