/**
 * TRINY MASAJES - RULETA DE FIDELIZACIÓN (CANVAS ACCESIBLE)
 * Validación estricta del resultado en backend y animación física determinista.
 */

import { WHEEL_PRIZES, BRAND_DATA } from "./data.js";

export function initWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const spinBtn = document.getElementById("wheelSpinBtn");
  const resultBox = document.getElementById("wheelResultBox");

  if (!canvas || !spinBtn) return;

  const ctx = canvas.getContext("2d");
  const segments = WHEEL_PRIZES;
  const numSegments = segments.length;
  const arcSize = (2 * Math.PI) / numSegments;

  let currentRotation = 0; // en radianes
  let isSpinning = false;

  // Ajuste de alta resolución (DPI Retina)
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = rect.width || 340;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    drawWheel(currentRotation);
  }

  // Dibuja la ruleta en el canvas según el ángulo actual de rotación
  function drawWheel(rotationAngle) {
    const rect = canvas.getBoundingClientRect();
    const size = rect.width || 340;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = centerX - 6;

    ctx.clearRect(0, 0, size, size);

    // Fondo / Borde exterior
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < numSegments; i++) {
      const seg = segments[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      // Dibujar rebanada
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Borde suave entre segmentos
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Texto de la rebanada
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = seg.textColor;
      ctx.font = "bold 13px Plus Jakarta Sans, sans-serif";

      // Truncar o envolver si es necesario
      const labelText = seg.label;
      ctx.fillText(labelText, radius - 20, 0);
      ctx.restore();
    }

    // Círculo central estético
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = "#FAF7F2";
    ctx.fill();
    ctx.strokeStyle = "#D46722";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  // Inicializar renderizado
  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 50);

  // Escuchar clic para girar
  spinBtn.addEventListener("click", async () => {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = "Validando turno...";
    if (resultBox) {
      resultBox.style.display = "none";
      resultBox.textContent = "";
    }

    try {
      // 1. Obtener resultado validado y firmado por el backend
      const response = await fetch("/api/wheel/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo validar el giro de la ruleta.");
      }

      // 2. Localizar el segmento del premio asignado por el servidor
      const targetIndex = segments.findIndex((s) => s.id === data.prizeId);
      if (targetIndex === -1) {
        throw new Error("Respuesta de premio no reconocida por el cliente.");
      }

      // La aguja fija está arriba (270 grados = 3 * Math.PI / 2 en estándar Canvas)
      const needleAngle = 3 * Math.PI / 2;
      const targetSegmentCenter = (targetIndex * arcSize) + (arcSize / 2);

      // Desaceleración y giros completos (mínimo 5 vueltas = 10 * PI)
      const fullRotations = 5 + Math.floor(Math.random() * 2);
      const targetRotation = (fullRotations * 2 * Math.PI) + (needleAngle - targetSegmentCenter);

      // Respetar preferencia de movimiento reducido
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const durationMs = prefersReducedMotion ? 200 : 4500;

      animateSpin(targetRotation, durationMs, () => {
        isSpinning = false;
        spinBtn.disabled = true;
        spinBtn.textContent = "Giro realizado";
        showPrizeResult(data);
      });

    } catch (err) {
      console.warn("Fallo de ruleta:", err);
      isSpinning = false;
      spinBtn.disabled = false;
      spinBtn.textContent = "Intentar de nuevo";
      showWheelError(err.message);
    }
  });

  function animateSpin(finalAngleTarget, duration, onComplete) {
    const startRotation = currentRotation % (2 * Math.PI);
    const totalDelta = finalAngleTarget - startRotation;
    const startTime = performance.now();

    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      currentRotation = startRotation + (totalDelta * easedProgress);
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        currentRotation = finalAngleTarget;
        drawWheel(currentRotation);
        onComplete();
      }
    }

    requestAnimationFrame(frame);
  }

  function showPrizeResult(result) {
    if (!resultBox) return;
    resultBox.style.display = "block";
    resultBox.textContent = "";

    const alert = document.createElement("div");
    alert.className = result.prizeId === "intenta-manana" ? "alert alert-info" : "alert alert-success";
    alert.style.flexDirection = "column";

    const title = document.createElement("strong");
    title.style.fontSize = "var(--text-md)";
    title.textContent = result.prizeId === "intenta-manana" ? "¡Gracias por participar!" : `🎉 ¡Felicitaciones! Has ganado: ${result.prizeLabel}`;

    const desc = document.createElement("p");
    desc.style.marginTop = "6px";
    desc.textContent = result.description;

    alert.appendChild(title);
    alert.appendChild(desc);

    if (result.couponCode) {
      const codeBox = document.createElement("div");
      codeBox.style.marginTop = "8px";
      codeBox.style.padding = "8px 12px";
      codeBox.style.backgroundColor = "rgba(0,0,0,0.06)";
      codeBox.style.borderRadius = "4px";
      codeBox.style.fontFamily = "monospace";
      codeBox.style.fontWeight = "bold";
      codeBox.textContent = `Código de cupón: ${result.couponCode}`;

      const applyBtn = document.createElement("button");
      applyBtn.className = "btn btn-primary btn-sm";
      applyBtn.style.marginTop = "10px";
      applyBtn.type = "button";
      applyBtn.textContent = "Aplicar Cupón en Reserva";
      applyBtn.addEventListener("click", () => {
        const inputCoupon = document.getElementById("bookingCouponCode");
        if (inputCoupon) {
          inputCoupon.value = result.couponCode;
        }
        document.getElementById("btnHeroReservar")?.click();
      });

      alert.appendChild(codeBox);
      alert.appendChild(applyBtn);
    }

    resultBox.appendChild(alert);
  }

  function showWheelError(msg) {
    if (!resultBox) return;
    resultBox.style.display = "block";
    resultBox.textContent = "";

    const alert = document.createElement("div");
    alert.className = "alert alert-error";
    alert.textContent = msg;
    resultBox.appendChild(alert);
  }
}

