/**
 * TRINY MASAJES - TEST DE CÁLCULO Y VALIDACIÓN DE PRECIOS
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { OFFICIAL_SERVICES, OFFICIAL_PROMOTIONS, OFFICIAL_PRODUCTS } from "../backend/config.js";

test("Los 23 servicios oficiales deben tener precio exacto de S/ 100 y 60 min de duración", () => {
  const serviceKeys = Object.keys(OFFICIAL_SERVICES);
  assert.equal(serviceKeys.length, 23, "Debe haber exactamente 23 servicios oficiales");

  serviceKeys.forEach((key) => {
    const s = OFFICIAL_SERVICES[key];
    assert.ok(s.name.length > 0, `El servicio ${key} debe tener nombre`);
    assert.equal(s.price, 100, `El precio del servicio ${key} debe ser S/ 100`);
    assert.equal(s.duration, 60, `La duración del servicio ${key} debe ser 60 min`);
  });
});

test("Los 12 productos oficiales deben tener precios reales conservados", () => {
  const prodKeys = Object.keys(OFFICIAL_PRODUCTS);
  assert.equal(prodKeys.length, 12, "Debe haber exactamente 12 productos oficiales");

  prodKeys.forEach((key) => {
    const p = OFFICIAL_PRODUCTS[key];
    assert.ok(p.name.length > 0, `El producto ${key} debe tener nombre`);
    assert.ok(p.price > 0, `El precio del producto ${key} debe ser mayor a 0`);
  });
});

test("Los paquetes promocionales deben ofrecer ahorro real sobre el precio regular", () => {
  const promoKeys = Object.keys(OFFICIAL_PROMOTIONS);
  assert.ok(promoKeys.length >= 3, "Debe haber al menos 3 paquetes promocionales");

  promoKeys.forEach((key) => {
    const p = OFFICIAL_PROMOTIONS[key];
    assert.ok(p.price < p.regularPrice, `El paquete ${key} debe ser menor al precio regular`);
  });
});
