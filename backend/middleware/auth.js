/**
 * TRINY MASAJES - AUTENTICACIÓN Y AUTORIZACIÓN SERVIDOR
 * Sesiones protegidas por cookies HttpOnly con firma criptográfica.
 * Cero almacenamiento inseguro en localStorage del cliente.
 */

import crypto from "crypto";
import { CONFIG } from "../config.js";

const COOKIE_NAME = "triny_crm_session";

/**
 * Genera un token firmado de sesión
 */
export function createSessionToken(username) {
  const payload = {
    u: username,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 8 // 8 horas
  };
  const jsonStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", CONFIG.sessionSecret)
    .update(jsonStr)
    .digest("base64url");

  return `${jsonStr}.${signature}`;
}

/**
 * Valida un token de sesión
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataPart, sigPart] = parts;

  const expectedSig = crypto
    .createHmac("sha256", CONFIG.sessionSecret)
    .update(dataPart)
    .digest("base64url");

  // Comparación segura en tiempo constante contra ataques de timing
  const sigBuf = Buffer.from(sigPart);
  const expectedBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(dataPart, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) {
      return null; // Sesión expirada
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Middleware para rutas protegidas del CRM
 */
export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Acceso no autorizado. Se requiere inicio de sesión en el CRM."
    });
  }

  req.user = session;
  next();
}

export { COOKIE_NAME };

