/**
 * TRINY MASAJES - RUTAS DE RULETA DE FIDELIZACIÓN
 * Validación y asignación de premios estrictamente del lado del servidor.
 */

import { Router } from "express";
import crypto from "crypto";
import { store } from "../data/store.js";

const router = Router();

const WHEEL_PRIZES_CONFIG = [
  { id: "dto-10-relax", label: "10% dto. Relax", description: "10% de descuento en tu próxima sesión de Masaje Relajante individual.", probability: 0.30, discountPercent: 10 },
  { id: "dto-15-madera", label: "15% Maderoterapia", description: "15% de descuento en sesión individual de Maderoterapia Corporal.", probability: 0.20, discountPercent: 15 },
  { id: "aceite-cortesia", label: "Aceite Relax", description: "Muestra de cortesía de aceite botánico relajante (15ml).", probability: 0.15, gift: "Aceite botánico 15ml" },
  { id: "dto-20-pack", label: "20% Pack Dúo", description: "20% de descuento sobre el Paquete Dúo Relax para dos personas.", probability: 0.15, discountPercent: 20 },
  { id: "reflex-extra", label: "+15m Reflexología", description: "15 minutos extra de reflexología podal en tu próxima reserva.", probability: 0.10, extraService: "Reflexología 15 min" },
  { id: "intenta-manana", label: "Sigue jugando", description: "¡Gracias por participar! Vuelve mañana para un nuevo intento de la suerte.", probability: 0.10, noPrize: true }
];

// Registro de giros por IP: máximo 1 giro cada 24 horas
const userSpins = new Map();

router.post("/spin", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const lastSpin = userSpins.get(ip);
  if (lastSpin && (now - lastSpin < ONE_DAY_MS)) {
    const hoursLeft = Math.ceil((ONE_DAY_MS - (now - lastSpin)) / (60 * 60 * 1000));
    return res.status(429).json({
      success: false,
      message: `Ya participaste hoy. Podrás girar la ruleta nuevamente en aproximadamente ${hoursLeft} hora(s).`
    });
  }

  // Selección ponderada por probabilidad en Servidor
  const random = Math.random();
  let cumulative = 0;
  let selectedPrize = WHEEL_PRIZES_CONFIG[0];

  for (const p of WHEEL_PRIZES_CONFIG) {
    cumulative += p.probability;
    if (random <= cumulative) {
      selectedPrize = p;
      break;
    }
  }

  // Registrar giro
  userSpins.set(ip, now);

  let couponCode = null;
  if (!selectedPrize.noPrize) {
    const randSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    couponCode = `TRINY-${selectedPrize.id.toUpperCase().slice(0, 6)}-${randSuffix}`;

    // Registrar en almacén de cupones válidos (vigencia 48h)
    store.activeCoupons.set(couponCode, {
      prizeId: selectedPrize.id,
      discountPercent: selectedPrize.discountPercent || 0,
      fixedDiscount: selectedPrize.fixedDiscount || 0,
      description: selectedPrize.description,
      expiresAt: now + (48 * 60 * 60 * 1000),
      used: false
    });
  }

  return res.status(200).json({
    success: true,
    prizeId: selectedPrize.id,
    prizeLabel: selectedPrize.label,
    description: selectedPrize.description,
    couponCode,
    expiresInHours: 48
  });
});

export default router;

