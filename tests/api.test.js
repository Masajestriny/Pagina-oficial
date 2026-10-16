/**
 * TRINY MASAJES - TEST DE INTEGRACIÓN DE APIS HTTP
 */

// Definir credenciales de prueba ANTES de importar el servidor (el módulo lee process.env)
process.env.CRM_ADMIN_USERNAME = "test_admin";
process.env.CRM_ADMIN_PASSWORD = "TestPass_CRM_2026!";
process.env.SESSION_SECRET = "test_session_secret_for_ci_only";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import app from "../backend/server.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("GET /api/health debe responder 200 con estado ok", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "ok");
  assert.equal(data.app, "Triny Masajes");
});

test("POST /api/bookings debe rechazar reservas con datos incompletos", async () => {
  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerName: "A" }) // Inválido
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("POST /api/bookings debe registrar y calcular precio oficial en el servidor", async () => {
  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotencyKey: "test_key_123",
      customerName: "Lucia Mendoza",
      customerPhone: "986100444",
      customerEmail: "lucia@ejemplo.com",
      itemType: "service",
      itemId: "masaje-shiatsu",
      locationType: "playa",
      address: "Condominio Las Lagunas Mz B Lote 8",
      date: "2026-10-25",
      timeSlot: "11:30",
      notes: "Sesión relajante"
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.booking.itemName, "Masaje Shiatsu Tradicional");
  assert.equal(data.booking.totalPrice, 100); // Precio oficial fijado por catálogo a S/ 100
});

test("POST /api/bookings debe calcular correctamente múltiples servicios y sesiones", async () => {
  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotencyKey: "multi_test_999",
      customerName: "Carlos Baldeón",
      customerPhone: "986100444",
      services: [
        { id: "masaje-relajante", quantity: 1 },       // 1 x 100 = 100
        { id: "masaje-descontracturante", quantity: 2 } // 2 x 100 = 200
      ],
      locationType: "playa",
      address: "Playa Misterio km 117",
      date: "2026-10-26",
      timeSlot: "15:00"
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.booking.totalSessions, 3);
  assert.equal(data.booking.totalPrice, 300); // 100 + 200 = 300
});

test("POST /api/wheel/spin debe generar un resultado de ruleta válido", async () => {
  const res = await fetch(`${baseUrl}/api/wheel/spin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  // Puede responder 200 o 429 si ya se giró por IP
  assert.ok(res.status === 200 || res.status === 429);
  const data = await res.json();
  if (res.status === 200) {
    assert.equal(data.success, true);
    assert.ok(data.prizeId.length > 0);
  }
});

test("GET /api/crm/bookings sin cookie de autenticación debe ser rechazado con 401", async () => {
  const res = await fetch(`${baseUrl}/api/crm/bookings`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("POST /api/crm/login con credenciales incorrectas debe retornar 401", async () => {
  const res = await fetch(`${baseUrl}/api/crm/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "wrong_user", password: "wrong_password" })
  });

  assert.equal(res.status, 401);
});

test("POST /api/crm/login con credenciales correctas debe otorgar cookie HttpOnly", async () => {
  const res = await fetch(`${baseUrl}/api/crm/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.CRM_ADMIN_USERNAME,
      password: process.env.CRM_ADMIN_PASSWORD
    })
  });

  assert.equal(res.status, 200);
  const setCookie = res.headers.get("set-cookie");
  assert.ok(setCookie, "Debe enviar cabecera Set-Cookie");
  assert.ok(setCookie.includes("triny_crm_session="), "Debe contener el nombre de la cookie");
  assert.ok(setCookie.includes("HttpOnly"), "La cookie debe tener flag HttpOnly");
});
