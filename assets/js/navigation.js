/**
 * TRINY MASAJES - NAVEGACIÓN Y ACCESIBILIDAD
 */

export function initNavigation() {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("btnMenuToggle");
  const menuClose = document.getElementById("btnMenuClose");
  const mobilePanel = document.getElementById("mobileNavPanel");
  const mobileOverlay = document.getElementById("mobileNavOverlay");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  // Elevación del header al hacer scroll
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Control del menú móvil
  const openMenu = () => {
    if (!mobilePanel || !mobileOverlay) return;
    mobilePanel.classList.add("is-open");
    mobileOverlay.classList.add("is-visible");
    menuToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    menuClose?.focus();
  };

  const closeMenu = () => {
    if (!mobilePanel || !mobileOverlay) return;
    mobilePanel.classList.remove("is-open");
    mobileOverlay.classList.remove("is-visible");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    menuToggle?.focus();
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobilePanel?.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  // Cierre accesible con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobilePanel?.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Cierre del menú móvil al hacer clic en enlaces internos
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobilePanel?.classList.contains("is-open")) {
        closeMenu();
      }
    });
  });

  // IntersectionObserver para actualizar estado activo en el menú
  const sections = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          document.querySelectorAll(`.nav-link, .mobile-nav-link`).forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
              link.setAttribute("aria-current", "page");
            } else if (href && href.startsWith("#")) {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
  }
}

