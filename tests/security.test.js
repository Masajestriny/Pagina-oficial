/**
 * TRINY MASAJES - TEST DE CIBERSEGURIDAD OWASP
 * Inyección de fórmulas CSV, sanitización y autenticación constante.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeCsvField } from "../backend/data/store.js";
import { createSessionToken, verifySessionToken } from "../backend/middleware/auth.js";
import { sanitizeString } from "../backend/middleware/security.js";

test("Sanitización CSV debe neutralizar fórmulas maliciosas", () => {
  // Vectores comunes de ataque por fórmula (Excel DDE / Calc)
  const attack1 = "=cmd|' /C calc'!A0";
  const attack2 = "+2+5";
  const attack3 = "-SUM(1+1)";
  const attack4 = "@SUM(1+1)";

  assert.equal(sanitizeCsvField(attack1), `"'=cmd|' /C calc'!A0"`);
  assert.equal(sanitizeCsvField(attack2), `"'+2+5"`);
  assert.equal(sanitizeCsvField(attack3), `"'-SUM(1+1)"`);
  assert.equal(sanitizeCsvField(attack4), `"'@SUM(1+1)"`);

  // Texto regular no debe alterarse con comilla
  const normalText = "Condominio Playa Blanca";
  assert.equal(sanitizeCsvField(normalText), `"Condominio Playa Blanca"`);
});

test("Sanitización de cadenas debe remover etiquetas HTML maliciosas", () => {
  const dirty = "<script>alert('xss')</script>Juan Perez";
  const clean = sanitizeString(dirty);
  assert.ok(!clean.includes("<script>"), "No debe contener tags script");
  assert.ok(!clean.includes("</script>"), "No debe contener tags de cierre");
  assert.equal(clean, "scriptalert('xss')/scriptJuan Perez");
});

test("Token de sesión debe ser verificado criptográficamente y detectar manipulación", () => {
  const username = "admin_triny";
  const token = createSessionToken(username);

  assert.ok(typeof token === "string", "El token debe ser una cadena");
  const payload = verifySessionToken(token);
  assert.ok(payload !== null, "El token válido debe verificarse exitosamente");
  assert.equal(payload.u, username);

  // Intentar manipular el payload o la firma
  const tamperedToken = token.slice(0, -4) + "XXXX";
  const tamperedPayload = verifySessionToken(tamperedToken);
  assert.equal(tamperedPayload, null, "Un token manipulado debe ser rechazado inmediatamente");
});

