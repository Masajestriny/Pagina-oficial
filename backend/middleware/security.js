/**
 * TRINY MASAJES - SEGURIDAD Y RATE LIMITING
 * Mitigación de abusos automatizados, fuerza bruta y cabeceras HTTP.
 */

const rateLimits = new Map();

/**
 * Rate limiter configurable por ruta / acción
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000; // 1 minuto por defecto
  const max = options.max || 30;                 // 30 peticiones por ventana
  const message = options.message || "Demasiadas peticiones. Por favor inténtalo más tarde.";

  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    rateLimits.set(key, record);

    if (record.count > max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSec
      });
    }

    next();
  };
}

/**
 * Limpieza periódica de memoria de rate limits
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetTime) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Sanitiza entradas textuales eliminando etiquetas potencialmente maliciosas
 */
export function sanitizeString(val) {
  if (typeof val !== "string") return "";
  return val
    .replace(/[<>]/g, "") // Remueve corchetes angulares
    .trim();
}
