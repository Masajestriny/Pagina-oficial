/**
 * TRINY MASAJES - CONFIGURACIÓN DEL SERVIDOR
 * Centralización segura de variables y catálogo oficial del backend.
 */

import dotenv from "dotenv";
dotenv.config();

// ⚠ IMPORTANTE: Configura estas variables en tu archivo .env antes de iniciar el servidor.
// En producción NUNCA uses los valores por defecto. Copia .env.example → .env y rellena
// cada variable con valores fuertes y únicos.
if (process.env.NODE_ENV === "production") {
  const required = ["SESSION_SECRET", "CRM_ADMIN_USERNAME", "CRM_ADMIN_PASSWORD"];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[STARTUP ERROR] Variable de entorno obligatoria no configurada: ${key}`);
      process.exit(1);
    }
  }
}

export const CONFIG = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  // En desarrollo se usa un secreto de sesión genérico; en producción DEBE venir de .env
  sessionSecret: process.env.SESSION_SECRET || "dev_session_secret_CHANGE_IN_PRODUCTION",

  // Credenciales CRM — definir siempre en .env
  crmAdmin: {
    username: process.env.CRM_ADMIN_USERNAME || "admin",
    password: process.env.CRM_ADMIN_PASSWORD || ""   // Vacío → el login fallará hasta configurar .env
  },

  // Webhook 1: Reservas y Contratación
  webhookBookings: {
    url: process.env.WEBHOOK_BOOKINGS_URL || "",
    secret: process.env.WEBHOOK_BOOKINGS_SECRET || "",
    timeoutMs: 4000
  },

  // Webhook 2: Consultas y Atención al Cliente
  webhookContact: {
    url: process.env.WEBHOOK_CONTACT_URL || "",
    secret: process.env.WEBHOOK_CONTACT_SECRET || "",
    timeoutMs: 4000
  },

  whatsapp: process.env.WHATSAPP_NUMBER || "51986100444",
  email: process.env.SUPPORT_EMAIL || "soporte@trinymasajes.com"
};

// Catálogo Oficial en Servidor (23 Servicios estándar a S/ 100, 60 min)
export const OFFICIAL_SERVICES = {
  "masaje-relajante": { name: "Masaje Relajante", price: 100, duration: 60 },
  "masaje-descontracturante": { name: "Masaje Descontracturante", price: 100, duration: 60 },
  "maderoterapia-corporal": { name: "Maderoterapia Corporal", price: 100, duration: 60 },
  "maderoterapia-facial": { name: "Maderoterapia Facial", price: 100, duration: 60 },
  "masaje-shiatsu": { name: "Masaje Shiatsu Tradicional", price: 100, duration: 60 },
  "reflexologia-podal": { name: "Reflexología Podal y Holística", price: 100, duration: 60 },
  "masaje-deportivo": { name: "Masaje Deportivo", price: 100, duration: 60 },
  "masaje-reductor": { name: "Masaje Reductor", price: 100, duration: 60 },
  "drenaje-linfatico": { name: "Drenaje Linfático", price: 100, duration: 60 },
  "masaje-prenatal": { name: "Masaje Prenatal", price: 100, duration: 60 },
  "masaje-terapeutico": { name: "Masaje Terapéutico", price: 100, duration: 60 },
  "masaje-piedras-calientes": { name: "Masaje con Piedras Calientes", price: 100, duration: 60 },
  "aromaterapia": { name: "Aromaterapia", price: 100, duration: 60 },
  "masaje-anticelulitico": { name: "Masaje Anticelulítico", price: 100, duration: 60 },
  "masaje-modelador": { name: "Masaje Modelador", price: 100, duration: 60 },
  "masaje-facial": { name: "Masaje Facial", price: 100, duration: 60 },
  "limpieza-facial": { name: "Limpieza Facial", price: 100, duration: 60 },
  "exfoliacion-corporal": { name: "Exfoliación Corporal", price: 100, duration: 60 },
  "spa-para-parejas": { name: "Spa para Parejas", price: 100, duration: 60 },
  "masaje-antiestres": { name: "Masaje Antiestrés", price: 100, duration: 60 },
  "masaje-cervical": { name: "Masaje Cervical", price: 100, duration: 60 },
  "masaje-lumbar": { name: "Masaje Lumbar", price: 100, duration: 60 },
  "masaje-piernas-cansadas": { name: "Masaje Piernas Cansadas", price: 100, duration: 60 }
};

// Catálogo Oficial de Productos (Precios individuales reales)
export const OFFICIAL_PRODUCTS = {
  "prod-aceite-lavanda": { name: "Aceite Esencial de Lavanda", price: 45 },
  "prod-aceite-almendras": { name: "Aceite de Almendras Dulces", price: 35 },
  "prod-aceite-argan": { name: "Aceite de Argán Premium", price: 65 },
  "prod-aceite-rosa-mosqueta": { name: "Aceite de Rosa Mosqueta", price: 50 },
  "prod-crema-reductora": { name: "Crema Reductora Corporal", price: 55 },
  "prod-crema-hidratante": { name: "Crema Hidratante Natural", price: 40 },
  "prod-crema-anticelulitica": { name: "Crema Anticelulítica", price: 60 },
  "prod-sales-himalaya": { name: "Sales de Baño Himalaya", price: 30 },
  "prod-exfoliante-cafe": { name: "Exfoliante de Café y Coco", price: 35 },
  "prod-difusor-ultrasonico": { name: "Difusor Ultrasónico", price: 89 },
  "prod-kit-aromaterapia": { name: "Kit Aromaterapia Zen", price: 125 },
  "prod-velas-soya": { name: "Velas de Soya Aromatizadas", price: 28 }
};

export const OFFICIAL_PROMOTIONS = {
  "promo-duo-relax": { name: "Paquete Dúo Relax a Domicilio", price: 180, regularPrice: 200, discountType: "fixed" },
  "promo-pack-maderoterapia": { name: "Plan Integral Maderoterapia (5 Sesiones)", price: 450, regularPrice: 500, discountType: "fixed" },
  "promo-circuito-playa": { name: "Circuito Bienestar Total Playa", price: 180, regularPrice: 200, discountType: "fixed" }
};
