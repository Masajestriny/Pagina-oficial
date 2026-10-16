/**
 * TRINY MASAJES - SERVIDOR PRINCIPAL Y ARQUITECTURA BACKEND
 * Servidor Express con cabeceras de seguridad Helmet, CSP, cookies y APIs.
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { CONFIG } from "./config.js";

// Importación de Rutas
import bookingsRoutes from "./routes/bookings.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import wheelRoutes from "./routes/wheel.routes.js";
import crmRoutes from "./routes/crm.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();

// 1. Configuración de Seguridad con Helmet & CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// 2. Parsers con límites de carga
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

// 3. Montar APIs
app.use("/api/bookings", bookingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wheel", wheelRoutes);
app.use("/api/crm", crmRoutes);

// Endpoint de verificación de salud
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Triny Masajes",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// 4. Servir archivos estáticos del frontend
app.use(express.static(rootDir, {
  maxAge: CONFIG.nodeEnv === "production" ? "1d" : 0,
  etag: true
}));

// Fallback a index.html para rutas no reconocidas que no sean API
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "Endpoint no encontrado" });
  }
  res.sendFile(path.join(rootDir, "index.html"));
});

// 5. Manejador Global de Errores (Sin fuga de trazas internas)
app.use((err, req, res, next) => {
  console.error("[Servidor Error]", err);
  res.status(err.status || 500).json({
    success: false,
    message: "Ocurrió un error inesperado en el servidor."
  });
});

// 6. Iniciar Servidor si es ejecutado directamente y no como módulo de test
const isDirectRun = process.argv[1] && (process.argv[1].endsWith("server.js") || process.argv[1].endsWith("server"));
if (isDirectRun && process.env.NODE_ENV !== "test") {
  app.listen(CONFIG.port, () => {
    console.info(`✓ Servidor Triny Masajes operando en http://localhost:${CONFIG.port}`);
    console.info(`✓ Entorno: ${CONFIG.nodeEnv}`);
  });
}

export default app;
