/**
 * TRINY MASAJES - INTEGRACIÓN DE WEBHOOKS
 * Webhook 1: Reservas y contrataciones confirmadas.
 * Webhook 2: Consultas y solicitudes de atención al cliente.
 * 
 * Requisitos de Ciberseguridad:
 * - Firma criptográfica HMAC SHA-256.
 * - Idempotencia para evitar duplicados.
 * - Timeouts con AbortController.
 * - Cero filtración de datos sensibles o secretos.
 */

import crypto from "crypto";
import { CONFIG } from "../config.js";

/**
 * Despacha un evento a un webhook externo con firma HMAC y timeout
 */
export async function dispatchWebhook(type, payload, idempotencyKey = null) {
  const isBooking = type === "booking";
  const webhookConfig = isBooking ? CONFIG.webhookBookings : CONFIG.webhookContact;

  if (!webhookConfig.url) {
    // Modo desconectado / no configurado en entorno
    console.info(`[Webhook Notice] Endpoint para "${type}" no configurado en variables de entorno. Operación registrada en base local.`);
    return {
      delivered: false,
      reason: "URL no configurada en servidor (.env)",
      status: "pending_config"
    };
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const rawBody = JSON.stringify(payload);

  // Generar firma HMAC SHA-256: timestamp + "." + body
  const signature = crypto
    .createHmac("sha256", webhookConfig.secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), webhookConfig.timeoutMs);

  try {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "TrinyMasajes-WebhookDispatcher/1.0",
      "X-Triny-Timestamp": timestamp,
      "X-Triny-Signature": `sha256=${signature}`
    };

    if (idempotencyKey) {
      headers["X-Idempotency-Key"] = idempotencyKey;
    }

    const response = await fetch(webhookConfig.url, {
      method: "POST",
      headers,
      body: rawBody,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Webhook Error] Respuesta HTTP ${response.status} desde webhook ${type}`);
      return {
        delivered: false,
        status: response.status,
        reason: "Servicio externo respondió con error"
      };
    }

    return {
      delivered: true,
      status: response.status
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === "AbortError";
    console.warn(`[Webhook Warning] Fallo de conexión con webhook ${type}: ${isTimeout ? "Timeout" : err.message}`);

    return {
      delivered: false,
      status: isTimeout ? "timeout" : "network_error",
      reason: isTimeout ? "Tiempo de espera agotado" : "Error de red"
    };
  }
}

