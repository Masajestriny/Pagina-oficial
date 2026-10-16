/**
 * TRINY MASAJES - ALMACÉN DE DATOS Y SANITIZACIÓN CSV
 * Ciberseguridad: Mitigación de Fórmula Injection en hojas de cálculo (CSV/Excel).
 */

export const store = {
  bookings: [
    {
      id: "BK-1001",
      idempotencyKey: "seed_1",
      customerName: "Camila Torres",
      customerPhone: "986100444",
      customerEmail: "camila.torres@ejemplo.com",
      itemType: "service",
      itemId: "maderoterapia-corporal",
      itemName: "Maderoterapia Corporal y Facial",
      locationType: "playa",
      address: "Condominio Playa Blanca, Mz C Lote 4",
      date: "2026-10-20",
      timeSlot: "10:00",
      notes: "Sesión en terraza frente al mar.",
      totalPrice: 140,
      status: "confirmada",
      createdAt: new Date().toISOString()
    }
  ],

  inquiries: [
    {
      id: "INQ-501",
      name: "Rodrigo Morales",
      email: "rodrigo.m@ejemplo.pe",
      phone: "994138981",
      subject: "Atención en Playa Misterio km 117",
      message: "¿Tienen disponibilidad este fin de semana para dos personas en la tarde?",
      timestamp: new Date().toISOString()
    }
  ],

  activeCoupons: new Map(), // code -> { prizeId, discountPercent, fixedDiscount, expiresAt, used: boolean }
  rateLimits: new Map()     // ip -> { count, resetTime }
};

/**
 * Sanitiza valores contra Inyección de Fórmulas en CSV (OWASP ASVS)
 * Si el campo inicia con '=', '+', '-', '@' o tabulaciones, se prefija con apóstrofe (')
 */
export function sanitizeCsvField(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Detección de caracteres ejecutables en Excel / Calc
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escapar comillas dobles
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Genera el archivo CSV protegido de reservas
 */
export function exportBookingsCsv() {
  const headers = ["ID", "Fecha_Registro", "Cliente", "Telefono", "Email", "Servicio", "Ubicacion", "Direccion", "Fecha_Cita", "Horario", "Monto_Soles", "Estado"];
  
  const rows = store.bookings.map((b) => [
    sanitizeCsvField(b.id),
    sanitizeCsvField(b.createdAt),
    sanitizeCsvField(b.customerName),
    sanitizeCsvField(b.customerPhone),
    sanitizeCsvField(b.customerEmail),
    sanitizeCsvField(b.itemName),
    sanitizeCsvField(b.locationType),
    sanitizeCsvField(b.address),
    sanitizeCsvField(b.date),
    sanitizeCsvField(b.timeSlot),
    sanitizeCsvField(b.totalPrice),
    sanitizeCsvField(b.status)
  ].join(","));

  return [headers.join(","), ...rows].join("\r\n");
}

