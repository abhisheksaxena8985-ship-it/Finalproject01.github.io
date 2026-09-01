// Shastriya Vidhan - Chrome Extension Popup Script

const BASE_URL = "http://localhost:3000";

const PUJAS = [
  {
    slug: "rudrabhishek-puja",
    category: "shiva-pujas",
    name: "Rudrabhishek Puja",
    duration: "2 to 2.5 Hours",
    price: "₹3,100",
    deity: "Lord Shiva"
  },
  {
    slug: "griha-pravesh-puja",
    category: "home-property",
    name: "Griha Pravesh & Vastu Shanti",
    duration: "3.5 to 4.5 Hours",
    price: "₹5,100",
    deity: "Vastu Purusha & Navgrah"
  },
  {
    slug: "satyanarayan-katha",
    category: "vishnu-krishna",
    name: "Sri Satyanarayan Katha",
    duration: "2 Hours",
    price: "₹2,500",
    deity: "Lord Vishnu"
  },
  {
    slug: "diwali-lakshmi-ganesh-puja",
    category: "festival-pujas",
    name: "Diwali Maha Lakshmi Ganesh",
    duration: "2 Hours",
    price: "₹3,500",
    deity: "Maha Lakshmi & Ganesha"
  },
  {
    slug: "mahamrityunjaya-jaap",
    category: "shiva-pujas",
    name: "Mahamrityunjaya Jaap (Chanting)",
    duration: "3 to 4 Hours",
    price: "₹5,100",
    deity: "Lord Shiva (Mrityunjaya)"
  },
  {
    slug: "sundarkand-path",
    category: "hanuman-ganesh",
    name: "Sampurna Sundarkand Path",
    duration: "2.5 to 3 Hours",
    price: "₹2,800",
    deity: "Lord Hanuman"
  },
  {
    slug: "navgrah-shanti-puja",
    category: "graha-dosh-shanti",
    name: "Navgrah Shanti Puja & Homa",
    duration: "3 Hours",
    price: "₹4,100",
    deity: "Navagrahas"
  },
  {
    slug: "kaal-sarp-dosh-puja",
    category: "graha-dosh-shanti",
    name: "Kaal Sarp Dosh Shanti (Ujjain)",
    duration: "3.5 Hours",
    price: "₹4,500",
    deity: "Rahu-Ketu & Mahakal"
  }
];

const MOCK_BOOKINGS = {
  "SV-2026-8812": {
    service: "Rudrabhishek Puja",
    customer: "Amitabh & Rashmi Saxena",
    date: "Tomorrow, 07:00 AM",
    mode: "Home (Noida Sector 50)",
    status: "Confirmed",
    shastri: "Acharya Ramesh Sharma"
  },
  "SV-2026-4401": {
    service: "Griha Pravesh & Vastu Shanti",
    customer: "Vikram Malhotra",
    date: "Upcoming Sunday, 08:30 AM",
    mode: "Home (Gurugram Phase 5)",
    status: "Assigned",
    shastri: "Acharya Devendra Tripathi"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Set current date in Muhurat
  const dateElem = document.getElementById("currentDateText");
  if (dateElem) {
    dateElem.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  // Render Pujas
  const listElem = document.getElementById("serviceList");
  const searchInput = document.getElementById("pujaSearch");

  function renderPujas(filter = "") {
    listElem.innerHTML = "";
    const filtered = PUJAS.filter(
      p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.deity.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      listElem.innerHTML = `<div style="text-align:center; padding: 20px; color:#888; font-size:12px;">No ceremonies matching "${filter}"</div>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `
        <div>
          <div class="service-name">${p.name}</div>
          <div class="service-meta">${p.duration} &bull; ${p.deity}</div>
          <div class="service-price">${p.price}</div>
        </div>
        <button class="book-mini-btn" data-slug="${p.slug}">Book Now</button>
      `;

      card.querySelector(".book-mini-btn").addEventListener("click", () => {
        openUrl(`${BASE_URL}/book?service=${p.slug}`);
      });

      listElem.appendChild(card);
    });
  }

  renderPujas();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderPujas(e.target.value);
    });
  }

  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".content-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = `panel-${tab.getAttribute("data-tab")}`;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // Track Booking Form
  const btnTrack = document.getElementById("btnTrack");
  const trackInput = document.getElementById("trackInput");
  const trackResult = document.getElementById("trackResult");

  if (btnTrack && trackInput && trackResult) {
    btnTrack.addEventListener("click", () => {
      const id = trackInput.value.trim().toUpperCase();
      const booking = MOCK_BOOKINGS[id];

      trackResult.style.display = "block";
      if (booking) {
        trackResult.innerHTML = `
          <div style="font-weight: bold; color: #1B8A44; margin-bottom: 4px;">✓ Status: ${booking.status}</div>
          <div><strong>Ceremony:</strong> ${booking.service}</div>
          <div><strong>Devotee:</strong> ${booking.customer}</div>
          <div><strong>Date:</strong> ${booking.date}</div>
          <div><strong>Assigned Shastri:</strong> ${booking.shastri}</div>
          <div style="margin-top: 8px;">
            <button id="btnViewFullReceipt" style="background:#6B1D1D; color:#FFF; border:none; padding:4px 8px; border-radius:4px; font-size:10.5px; cursor:pointer;">
              Open Full Receipt ↗
            </button>
          </div>
        `;
        document.getElementById("btnViewFullReceipt")?.addEventListener("click", () => {
          openUrl(`${BASE_URL}/admin`);
        });
      } else {
        trackResult.innerHTML = `
          <div style="color: #C62828; font-weight: bold;">Booking ID Not Found</div>
          <div style="font-size: 10.5px; color: #666; margin-top: 2px;">
            Try checking <strong>SV-2026-8812</strong> or open your confirmation message on WhatsApp.
          </div>
        `;
      }
    });
  }

  // External Action Links
  document.getElementById("btnOpenWeb")?.addEventListener("click", () => openUrl(BASE_URL));
  document.getElementById("btnOpenPandits")?.addEventListener("click", () => openUrl(`${BASE_URL}/pandits`));
  document.getElementById("btnMuhuratFull")?.addEventListener("click", () => openUrl(`${BASE_URL}/guides/festival-dates-and-muhurat-method`));
  document.getElementById("btnAdminOpen")?.addEventListener("click", () => openUrl(`${BASE_URL}/admin`));
  document.getElementById("btnWhatsAppDesk")?.addEventListener("click", () => {
    openUrl("https://wa.me/919810000000?text=Namaste,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20Puja%20via%20Shastriya%20Vidhan.");
  });
  document.getElementById("btnCallDesk")?.addEventListener("click", () => {
    openUrl(`${BASE_URL}/contact`);
  });

  function openUrl(url) {
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, "_blank");
    }
  }
});
