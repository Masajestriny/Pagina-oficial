/**
 * TRINY MASAJES - RUTAS DEL PANEL CRM OPERATIVO
 * Autenticación exclusiva por cookie HttpOnly, RBAC del lado del servidor
 * y protección de exportaciones contra Formula Injection.
 */

import { Router } from "express";
import { CONFIG } from "../config.js";
import { store, exportBookingsCsv } from "../data/store.js";
import { createSessionToken, verifySessionToken, requireAuth, COOKIE_NAME } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/security.js";

const router = Router();

// Rate limiter específico para login (anti fuerza bruta): máx 5 intentos cada 15 min
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Demasiados intentos fallidos de inicio de sesión. Bloqueado temporalmente por 15 minutos."
});

// 1. Estado de autenticación
router.get("/status", (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  const session = verifySessionToken(token);
  return res.json({ authenticated: !!session });
});

// 2. Iniciar sesión administrativa
router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (
    username === CONFIG.crmAdmin.username &&
    password === CONFIG.crmAdmin.password
  ) {
    const sessionToken = createSessionToken(username);

    // Establecer cookie HttpOnly segura (inaccesible desde JS / XSS)
    res.cookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: CONFIG.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 8 // 8 horas
    });

    return res.json({
      success: true,
      message: "Inicio de sesión concedido."
    });
  }

  return res.status(401).json({
    success: false,
    message: "Credenciales de acceso incorrectas."
  });
});

// 3. Cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict"
  });
  return res.json({ success: true, message: "Sesión cerrada correctamente." });
});

// 4. Listado de Reservas (Protegido)
router.get("/bookings", requireAuth, (req, res) => {
  return res.json({
    success: true,
    bookings: [...store.bookings].reverse()
  });
});

// 5. Listado de Consultas (Protegido)
router.get("/inquiries", requireAuth, (req, res) => {
  return res.json({
    success: true,
    inquiries: [...store.inquiries].reverse()
  });
});

// 6. Exportación de CSV Seguro (Protegido contra Inyección de Fórmulas)
router.get("/export/bookings.csv", requireAuth, (req, res) => {
  const csvContent = exportBookingsCsv();
  const filename = `triny_reservas_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Content-Type-Options", "nosniff");

  return res.send("\uFEFF" + csvContent); // BOM UTF-8 para compatibilidad Excel
});

export default router;

