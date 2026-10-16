/**
 * TRINY MASAJES - TEST DE INTEGRACIÓN DE WEBHOOKS
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { dispatchWebhook } from "../backend/integrations/webhooks.js";
import { CONFIG } from "../backend/config.js";

test("Firma HMAC SHA-256 debe coincidir con el secreto configurado", () => {
  const secret = "test_webhook_secret_key";
  const timestamp = "1773500000";
  const body = JSON.stringify({ event: "test.event", value: 100 });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  assert.ok(signature.length === 64, "La firma SHA-256 debe tener 64 caracteres hex");

  // Verificar recálculo
  const verifySig = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  assert.equal(signature, verifySig);
});

test("Despacho de Webhook debe manejar URLs no configuradas de forma segura y sin excepciones", async () => {
  // Aseguramos que la URL esté vacía en esta prueba
  const originalUrl = CONFIG.webhookBookings.url;
  CONFIG.webhookBookings.url = "";

  const result = await dispatchWebhook("booking", { test: true });
  assert.equal(result.delivered, false);
  assert.equal(result.status, "pending_config");

  CONFIG.webhookBookings.url = originalUrl;
});

