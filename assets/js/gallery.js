/**
 * TRINY MASAJES - GALERÍA ACCESIBLE Y LIGHTBOX
 * Soporta navegación por teclado (Flechas, Esc) y focus trap.
 */

import { GALLERY_DATA } from "./data.js";

export function initGallery() {
  const container = document.getElementById("galleryGrid");
  const modalOverlay = document.getElementById("galleryLightbox");
  const modalImg = document.getElementById("lightboxImage");
  const modalCaption = document.getElementById("lightboxCaption");
  const btnClose = document.getElementById("lightboxClose");
  const btnPrev = document.getElementById("lightboxPrev");
  const btnNext = document.getElementById("lightboxNext");

  if (!container || !modalOverlay) return;

  let currentIndex = 0;
  let lastActiveElement = null;

  container.textContent = "";

  GALLERY_DATA.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `Ampliar imagen: ${item.caption}`);

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    img.width = 400;
    img.height = 300;

    const caption = document.createElement("figcaption");
    caption.className = "gallery-caption";
    caption.textContent = item.caption;

    figure.appendChild(img);
    figure.appendChild(caption);

    const openImage = () => {
      lastActiveElement = figure;
      currentIndex = index;
      showLightbox();
    };

    figure.addEventListener("click", openImage);
    figure.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openImage();
      }
    });

    container.appendChild(figure);
  });

  function showLightbox() {
    const item = GALLERY_DATA[currentIndex];
    if (!item) return;

    modalImg.src = item.src;
    modalImg.alt = item.alt;
    modalCaption.textContent = `${currentIndex + 1} / ${GALLERY_DATA.length} — ${item.caption}`;

    modalOverlay.classList.add("is-active");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose?.focus();
  }

  function closeLightbox() {
    modalOverlay.classList.remove("is-active");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    showLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % GALLERY_DATA.length;
    showLightbox();
  }

  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnPrev) btnPrev.addEventListener("click", showPrev);
  if (btnNext) btnNext.addEventListener("click", showNext);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modalOverlay.classList.contains("is-active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    } else if (e.key === "ArrowRight") {
      showNext();
    }
  });
}

