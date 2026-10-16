/**
 * TRINY MASAJES - RUTAS DE RESERVAS (SOPORTE MULTI-SERVICIO Y CARRITO)
 * Validación exhaustiva y cálculo de precios exclusivamente en servidor.
 */

import { Router } from "express";
import { OFFICIAL_SERVICES, OFFICIAL_PROMOTIONS, OFFICIAL_PRODUCTS } from "../config.js";
import { store } from "../data/store.js";
import { dispatchWebhook } from "../integrations/webhooks.js";
import { createRateLimiter, sanitizeString } from "../middleware/security.js";

const router = Router();
const idempotencyCache = new Map();

// Rate limit: máx 15 reservas por hora por IP
const bookingRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: "Has alcanzado el límite de solicitudes de reserva por esta hora."
});

router.post("/", bookingRateLimit, async (req, res) => {
  try {
    const {
      idempotencyKey,
      customerName,
      customerPhone,
      customerEmail,
      itemType,
      itemId,
      services, // Array de { id, quantity } para reservas múltiples
      products, // Array opcional de { id, quantity } para compras adicionales
      locationType,
      address,
      date,
      timeSlot,
      notes,
      couponCode
    } = req.body;

    // Control de Idempotencia: responder con registro existente si ya fue procesada
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      const existingBooking = idempotencyCache.get(idempotencyKey);
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        booking: existingBooking
      });
    }

    // 1. Validaciones de datos del cliente
    const cleanName = sanitizeString(customerName);
    const cleanPhone = sanitizeString(customerPhone);
    const cleanEmail = sanitizeString(customerEmail);
    const cleanAddress = sanitizeString(address);
    const cleanNotes = sanitizeString(notes);
    const cleanCoupon = sanitizeString(couponCode);

    if (cleanName.length < 3) {
      return res.status(400).json({ success: false, message: "Nombre de cliente inválido (mínimo 3 caracteres)." });
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      return res.status(400).json({ success: false, message: "Número de teléfono o WhatsApp inválido." });
    }

    if (!cleanAddress || cleanAddress.length < 3) {
      return res.status(400).json({ success: false, message: "Dirección o condominio requerido." });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: "Formato de fecha inválido." });
    }

    if (!timeSlot) {
      return res.status(400).json({ success: false, message: "Horario de sesión requerido." });
    }

    // 2. Determinación de Servicios y Precios Oficiales (Servidor calcula los importes)
    let processedServices = [];
    let officialServicesTotal = 0;
    let totalSessions = 0;
    let primaryItemName = "";

    if (Array.isArray(services) && services.length > 0) {
      // Flujo de Reservas Múltiples
      for (const item of services) {
        const sId = item.id || item.itemId;
        const qty = parseInt(item.quantity || 1, 10);
        if (!sId || qty < 1) continue;

        const official = OFFICIAL_SERVICES[sId];
        if (!official) {
          return res.status(400).json({ success: false, message: `El servicio "${sId}" no existe en el catálogo oficial.` });
        }

        const subtotal = official.price * qty;
        officialServicesTotal += subtotal;
        totalSessions += qty;

        processedServices.push({
          id: sId,
          name: official.name,
          quantity: qty,
          unitPrice: official.price,
          subtotal,
          durationMinutes: official.duration
        });
      }

      if (processedServices.length === 0) {
        return res.status(400).json({ success: false, message: "No se seleccionó ningún servicio válido." });
      }

      primaryItemName = processedServices.map((s) => `${s.name} (x${s.quantity})`).join(", ");
    } else if (itemType === "service" && itemId) {
      // Compatibilidad con selección individual previa
      const service = OFFICIAL_SERVICES[itemId];
      if (!service) {
        return res.status(400).json({ success: false, message: "El servicio seleccionado no existe en el catálogo oficial." });
      }
      officialServicesTotal = service.price;
      totalSessions = 1;
      primaryItemName = service.name;
      processedServices.push({
        id: itemId,
        name: service.name,
        quantity: 1,
        unitPrice: service.price,
        subtotal: service.price,
        durationMinutes: service.duration
      });
    } else if (itemType === "promo" && itemId) {
      const promo = OFFICIAL_PROMOTIONS[itemId];
      if (!promo) {
        return res.status(400).json({ success: false, message: "La promoción seleccionada no es válida." });
      }
      officialServicesTotal = promo.price;
      totalSessions = 2;
      primaryItemName = promo.name;
      processedServices.push({
        id: itemId,
        name: promo.name,
        quantity: 1,
        unitPrice: promo.price,
        subtotal: promo.price,
        durationMinutes: 60
      });
    } else {
      return res.status(400).json({ success: false, message: "Debes seleccionar al menos un servicio para reservar." });
    }

    // 3. Procesar Productos adicionales si fueron incluidos en la solicitud
    let processedProducts = [];
    let officialProductsTotal = 0;
    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        const pId = p.id || p.itemId;
        const qty = parseInt(p.quantity || 1, 10);
        if (!pId || qty < 1) continue;

        const officialProd = OFFICIAL_PRODUCTS[pId];
        if (officialProd) {
          const subtotal = officialProd.price * qty;
          officialProductsTotal += subtotal;
          processedProducts.push({
            id: pId,
            name: officialProd.name,
            quantity: qty,
            unitPrice: officialProd.price,
            subtotal
          });
        }
      }
    }

    const subtotalGeneral = officialServicesTotal + officialProductsTotal;

    // 4. Validación y aplicación de cupón si aplica
    let appliedDiscount = 0;
    if (cleanCoupon && store.activeCoupons.has(cleanCoupon)) {
      const coupon = store.activeCoupons.get(cleanCoupon);
      if (!coupon.used && Date.now() < coupon.expiresAt) {
        if (coupon.discountPercent) {
          appliedDiscount = Math.round((subtotalGeneral * coupon.discountPercent) / 100);
        } else if (coupon.fixedDiscount) {
          appliedDiscount = coupon.fixedDiscount;
        }
        coupon.used = true;
      }
    }

    const finalPrice = Math.max(0, subtotalGeneral - appliedDiscount);

    // 5. Registrar reserva oficial
    const bookingId = `TRINY-${Date.now().toString().slice(-6)}`;
    const newBooking = {
      id: bookingId,
      idempotencyKey: idempotencyKey || bookingId,
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: cleanEmail || null,
      services: processedServices,
      products: processedProducts,
      itemName: primaryItemName,
      totalSessions,
      locationType: locationType || "domicilio",
      address: cleanAddress,
      date,
      timeSlot,
      notes: cleanNotes || null,
      subtotal: subtotalGeneral,
      discount: appliedDiscount,
      totalPrice: finalPrice,
      status: "confirmada",
      createdAt: new Date().toISOString()
    };

    store.bookings.push(newBooking);

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, newBooking);
    }

    // 6. Despacho a Webhook 1 (Reservas)
    const webhookPayload = {
      event: "booking.created",
      bookingId: newBooking.id,
      timestamp: newBooking.createdAt,
      customer: {
        name: newBooking.customerName,
        phone: newBooking.customerPhone,
        email: newBooking.customerEmail
      },
      appointment: {
        services: newBooking.services,
        products: newBooking.products,
        totalSessions: newBooking.totalSessions,
        location: newBooking.locationType,
        address: newBooking.address,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot
      },
      financials: {
        currency: "PEN",
        totalAmount: newBooking.totalPrice,
        discountApplied: newBooking.discount
      }
    };

    dispatchWebhook("booking", webhookPayload, idempotencyKey).catch((err) => {
      console.warn("Fallo de webhook de reserva:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Reserva registrada y confirmada oficialmente por el servidor.",
      booking: newBooking
    });

  } catch (err) {
    console.error("Error en procesamiento de reserva:", err);
    return res.status(500).json({
      success: false,
      message: "Ocurrió un error interno al registrar la reserva. Intenta nuevamente."
    });
  }
});

export default router;
