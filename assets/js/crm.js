/**
 * TRINY MASAJES - PANEL DE CONTROL OPERATIVO (CRM SEGURO)
 * Autenticación exclusiva por cookie HttpOnly de sesión.
 * CERO almacenamiento de credenciales o tokens en localStorage.
 */

export function initCRM() {
  const crmModal = document.getElementById("crmModal");
  const crmTrigger = document.getElementById("btnFooterCRM");
  const crmClose = document.getElementById("crmModalClose");

  const loginSection = document.getElementById("crmLoginSection");
  const dashboardSection = document.getElementById("crmDashboardSection");
  const loginForm = document.getElementById("crmLoginForm");
  const loginAlert = document.getElementById("crmLoginAlert");
  const btnLogout = document.getElementById("crmBtnLogout");

  const bookingsTableBody = document.getElementById("crmBookingsTbody");
  const inquiriesTableBody = document.getElementById("crmInquiriesTbody");
  const tabBookingsBtn = document.getElementById("crmTabBookings");
  const tabInquiriesBtn = document.getElementById("crmTabInquiries");
  const bookingsView = document.getElementById("crmViewBookings");
  const inquiriesView = document.getElementById("crmViewInquiries");
  const exportCsvBtn = document.getElementById("crmExportCsvBtn");

  if (!crmModal || !crmTrigger) return;

  function openCRM() {
    crmModal.classList.add("is-active");
    crmModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    checkAuthStatus();
  }

  function closeCRM() {
    crmModal.classList.remove("is-active");
    crmModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  crmTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    openCRM();
  });

  if (crmClose) crmClose.addEventListener("click", closeCRM);

  crmModal.addEventListener("click", (e) => {
    if (e.target === crmModal) closeCRM();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && crmModal.classList.contains("is-active")) {
      closeCRM();
    }
  });

  // Verificar estado de sesión en backend
  async function checkAuthStatus() {
    try {
      const res = await fetch("/api/crm/status", { credentials: "same-origin" });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        showDashboard();
      } else {
        showLogin();
      }
    } catch {
      showLogin();
    }
  }

  function showLogin() {
    if (loginSection) loginSection.style.display = "block";
    if (dashboardSection) dashboardSection.style.display = "none";
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = "none";
    if (dashboardSection) dashboardSection.style.display = "block";
    loadBookings();
    loadInquiries();
  }

  // Manejo de formulario de Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (loginAlert) loginAlert.style.display = "none";

      const username = loginForm.crmUsername.value.trim();
      const password = loginForm.crmPassword.value;

      try {
        const res = await fetch("/api/crm/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Credenciales incorrectas.");
        }

        loginForm.reset();
        showDashboard();
      } catch (err) {
        if (loginAlert) {
          loginAlert.style.display = "block";
          loginAlert.textContent = err.message;
        }
      }
    });
  }

  // Cierre de Sesión seguro
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      try {
        await fetch("/api/crm/logout", {
          method: "POST",
          credentials: "same-origin"
        });
      } catch (err) {
        console.warn("Fallo al cerrar sesión:", err);
      }
      showLogin();
    });
  }

  // Cargar Reservas
  async function loadBookings() {
    if (!bookingsTableBody) return;
    bookingsTableBody.textContent = "";

    try {
      const res = await fetch("/api/crm/bookings", { credentials: "same-origin" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al obtener reservas.");
      }

      if (data.bookings.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 6;
        td.textContent = "No hay reservas registradas en este período.";
        td.style.textAlign = "center";
        td.style.padding = "1rem";
        tr.appendChild(td);
        bookingsTableBody.appendChild(tr);
        return;
      }

      data.bookings.forEach((b) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = `#${b.id}`;
        tr.appendChild(tdId);

        const tdClient = document.createElement("td");
        tdClient.innerHTML = `<strong>${escapeText(b.customerName)}</strong><br><small style="color:var(--color-taupe);">${escapeText(b.customerPhone)}</small>`;
        tr.appendChild(tdClient);

        const tdService = document.createElement("td");
        tdService.textContent = b.itemName;
        tr.appendChild(tdService);

        const tdSchedule = document.createElement("td");
        tdSchedule.textContent = `${b.date} (${b.timeSlot})`;
        tr.appendChild(tdSchedule);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = `S/ ${b.totalPrice}`;
        tr.appendChild(tdPrice);

        const tdStatus = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = b.status === "confirmada" ? "badge badge-success" : "badge badge-terracotta";
        badge.textContent = b.status.toUpperCase();
        tdStatus.appendChild(badge);
        tr.appendChild(tdStatus);

        bookingsTableBody.appendChild(tr);
      });
    } catch (err) {
      console.warn("Error al cargar reservas:", err);
    }
  }

  // Cargar Consultas
  async function loadInquiries() {
    if (!inquiriesTableBody) return;
    inquiriesTableBody.textContent = "";

    try {
      const res = await fetch("/api/crm/inquiries", { credentials: "same-origin" });
      const data = await res.json();

      if (!res.ok || !data.success) return;

      if (data.inquiries.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "No hay consultas pendientes.";
        td.style.textAlign = "center";
        td.style.padding = "1rem";
        tr.appendChild(td);
        inquiriesTableBody.appendChild(tr);
        return;
      }

      data.inquiries.forEach((item) => {
        const tr = document.createElement("tr");

        const tdDate = document.createElement("td");
        tdDate.textContent = item.timestamp ? item.timestamp.split("T")[0] : "-";
        tr.appendChild(tdDate);

        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        tr.appendChild(tdName);

        const tdPhone = document.createElement("td");
        tdPhone.textContent = item.phone;
        tr.appendChild(tdPhone);

        const tdSubject = document.createElement("td");
        tdSubject.textContent = item.subject;
        tr.appendChild(tdSubject);

        const tdMsg = document.createElement("td");
        tdMsg.textContent = item.message;
        tdMsg.style.maxWidth = "240px";
        tdMsg.style.overflow = "hidden";
        tdMsg.style.textOverflow = "ellipsis";
        tdMsg.style.whiteSpace = "nowrap";
        tr.appendChild(tdMsg);

        inquiriesTableBody.appendChild(tr);
      });
    } catch (err) {
      console.warn("Error al cargar consultas:", err);
    }
  }

  // Tabs de navegación interna en CRM
  if (tabBookingsBtn && tabInquiriesBtn) {
    tabBookingsBtn.addEventListener("click", () => {
      tabBookingsBtn.classList.add("active");
      tabInquiriesBtn.classList.remove("active");
      if (bookingsView) bookingsView.style.display = "block";
      if (inquiriesView) inquiriesView.style.display = "none";
    });

    tabInquiriesBtn.addEventListener("click", () => {
      tabInquiriesBtn.classList.add("active");
      tabBookingsBtn.classList.remove("active");
      if (bookingsView) bookingsView.style.display = "none";
      if (inquiriesView) inquiriesView.style.display = "block";
    });
  }

  // Exportar CSV protegido contra inyección de fórmulas
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      window.location.href = "/api/crm/export/bookings.csv";
    });
  }

  function escapeText(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }
}

