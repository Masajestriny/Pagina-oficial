# Triny Masajes — Plataforma Web Profesional, Reservas Múltiples & Carrito Inteligente

> **Razón Social:** GRUPO INVERSIONES BALDEÓN FLORES SAC  
> **RUC:** 20608756181  
> **Contacto Oficial:** WhatsApp: [+51 986 820 428](https://wa.me/51986100444) | Correo: [soporte@trinymasajes.com](mailto:soporte@trinymasajes.com)  
> **Moneda Oficial:** Soles peruanos (PEN / S/)  
> **Tarifa Plana de Servicios:** S/ 100 por sesión de 60 minutos en los 23 masajes y tratamientos.  
> **Propuesta de Valor:** *"Relájate desde la comodidad de tu Hogar"* — Atención exclusiva con camilla clínica a domicilio en Lima Metropolitana y casas/condominios de playa del Sur chico (Playa Blanca, Playa Misterio km 117, Las Lagunas, Cocoa, Asia, Bujama).

---

## 1. Novedades del Rediseño Integral

1. **Pantalla de Carga (Loading Screen):**
   - Fondo blanco `#FFFFFF`, isotipo oficial `assets/img/Logo de triny.jpg`, spinner animado en azul noche (`#172B4D`) y dorado champagne (`#C6A56B`), con el mensaje *"Preparando tu experiencia de bienestar..."*.
   - Transición de salida suave y temporizador de seguridad que nunca bloquea la experiencia.
2. **Icono de Pestaña (Favicon):**
   - Configurado en el `<head>` mediante `<link rel="icon" type="image/jpeg" href="assets/img/Logo de triny.jpg">` para visibilidad en pestañas de navegadores web y móviles.
3. **Catálogo de 23 Servicios a S/ 100:**
   - Todos los masajes con duración de 60 minutos e inversión estándar de S/ 100.
   - Cada tarjeta incluye fotografía real de los archivos de proyecto, duración, precio, botón *"Más info"* (modal de beneficios y recomendaciones clínicas), selector de sesiones (+ / -), botón *"Reservar"* y *"🛒 Al carrito"*.
4. **Sistema de Reservas Múltiples:**
   - Permite al cliente seleccionar uno o varios tipos de masajes en una sola solicitud (ej: 1 Masaje Relajante × S/ 100 + 2 Masajes Descontracturantes × S/ 200 = S/ 300).
   - Cálculo automático de subtotales, sesiones totales y duración acumulada.
5. **Flujo Guiado de Reserva en 5 Pasos con Barra de Progreso:**
   - **Paso 1. Selección de Masajes:** Controles interactivos de cantidad, listado dinámico y resumen en tiempo real.
   - **Paso 2. Fecha y Horario:** Bloqueo de fechas pasadas, selección de turnos de 08:30 a 19:30 y cálculo del tiempo total estimado.
   - **Paso 3. Datos del Cliente:** Nombre, WhatsApp, tipo de ubicación (Playa/Lima/Espacio), dirección exacta, cupón de descuento y persistencia automática en borrador.
   - **Paso 4. Resumen:** Desglose completo de servicios, tiempos, dirección y total general.
   - **Paso 5. Envío por WhatsApp:** Abre la conversación con el mensaje estructurado A y registra la solicitud en el backend.
6. **Carrito Unificado (Drawer Lateral):**
   - Permite agregar masajes y productos simultáneamente.
   - Modificación de cantidades (+ / -), eliminación, cálculo de subtotales por grupo y total general.
   - Persistencia en almacenamiento local (`localStorage`) para que el cliente no pierda su selección al recargar la página.
7. **Tienda de 12 Productos de Bienestar:**
   - Aceites esenciales, cremas moldeadoras, sales del Himalaya y difusores ultrasónicos.
   - Búsqueda en tiempo real combinable con filtros de categoría ("Aceites", "Cremas", "Sales y Exfoliantes", "Aromaterapia").
8. **WhatsApp Automatizado (Función Centralizada `sendToWhatsApp`):**
   - Genera automáticamente los mensajes estandarizados para:
     - **Formato A:** Reservas múltiples con desglose de sesiones, fecha, horario y duración.
     - **Formato B:** Pedidos de productos con método de entrega y dirección.
     - **Formato C:** Formulario de atención al cliente con selector de 7 motivos de consulta.

---

## 2. Arquitectura de Archivos

```text
triny-masajes/
├── index.html                  # HTML5 semántico con pantalla de carga, modal 5 pasos y carrito
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Paleta: blanco, azul noche (#172B4D), dorado champagne (#C6A56B), gris lectura (#667085)
│   │   ├── base.css            # Reset accesible, focus visible y utilidades de lector de pantalla
│   │   ├── layout.css          # Header sticky, estructura de contenedores y pie de página
│   │   ├── components.css      # Loading screen, drawer de carrito, wizard de reservas y tarjetas
│   │   └── responsive.css      # Adaptabilidad móvil, drawer responsivo y reducción de movimiento
│   ├── js/
│   │   ├── data.js             # 23 servicios a S/ 100, 12 productos, configuración y función sendToWhatsApp()
│   │   ├── cart.js             # Carrito unificado para masajes y productos con persistencia
│   │   ├── bookings.js         # Flujo de reservas múltiples en 5 pasos guiados
│   │   ├── services.js         # Renderizado seguro de servicios, modal de detalles y selectores
│   │   ├── products.js         # Tienda con búsqueda, filtros y adición al carrito
│   │   ├── contact.js          # Formulario de atención con los 7 motivos y WhatsApp
│   │   ├── navigation.js       # Menú móvil accesible e IntersectionObserver
│   │   ├── promotions.js       # Paquetes y promociones con preselección
│   │   ├── gallery.js          # Visor accesible de fotografías de playas por teclado
│   │   ├── faq.js              # Acordeón accesible (WAI-ARIA pattern)
│   │   ├── wheel.js            # Ruleta Canvas con validación estricta en servidor
│   │   ├── crm.js              # Panel administrativo autenticado con cookies HttpOnly
│   │   └── main.js             # Orquestador principal e inicio del loader
│   └── img/                    # Fotografías reales del equipo en Playa Blanca, Misterio, Las Lagunas, Cocoa y logotipo
├── backend/
│   ├── config.js               # Catálogo oficial de 23 servicios a S/ 100 y 12 productos
│   ├── data/
│   │   └── store.js            # Almacén de reservas, consultas y exportación CSV con mitigación de fórmulas
│   ├── middleware/
│   │   ├── auth.js             # Verificación de sesiones y tokens con HMAC SHA-256
│   │   └── security.js         # Rate limiting anti-abuso y sanitización de entradas
│   ├── integrations/
│   │   └── webhooks.js         # Despacho firmado a Webhook 1 (Reservas) y Webhook 2 (Contacto)
│   ├── routes/
│   │   ├── bookings.routes.js  # API con cálculo multi-servicio en servidor e idempotencia
│   │   ├── contact.routes.js   # API de recepción de consultas
│   │   ├── wheel.routes.js     # API de ruleta probabilística y cupones válidos
│   │   └── crm.routes.js       # API del CRM y exportación segura de datos
│   └── server.js               # Servidor Express con cabeceras Helmet, CSP y compresión
├── tests/
│   ├── pricing.test.js         # Pruebas de 23 servicios (S/ 100) y 12 productos
│   ├── security.test.js        # Pruebas OWASP (sanitización, CSV formula injection, tokens)
│   ├── webhooks.test.js        # Pruebas de firma criptográfica y timeouts en webhooks
│   └── api.test.js             # Pruebas de integración HTTP de reservas múltiples y endpoints
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 3. Instalación, Pruebas y Despliegue

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar suite de pruebas automatizadas (16 tests):**
   ```bash
   npm test
   ```
   *Verifica el cálculo de precios a S/ 100, la recepción de múltiples servicios, las cuotas de la ruleta, la prevención de inyección en CSV y los tokens criptográficos.*

3. **Iniciar servidor:**
   ```bash
   npm start
   ```
   Abre en el navegador: `http://localhost:3000`

---

## 4. Canales de WhatsApp Centralizados

La función centralizada `sendToWhatsApp({ type, data })` en `assets/js/data.js` genera los tres tipos de mensajes oficiales hacia el número **+51 986 820 428**:

- **Formato A (Reservas Múltiples):**
  Desglosa cliente, dirección, cada masaje con su cantidad y subtotal, duración total calculada (ej. `2h (120 min)`), fecha y horario preferido.
- **Formato B (Pedidos de Productos):**
  Detalla los artículos del carrito, subtotales, método de entrega y dirección.
- **Formato C (Atención al Cliente):**
  Estructura el motivo (de entre las 7 opciones predefinidas), servicio/producto relacionado y mensaje.
