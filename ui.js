"use strict";

/*
  ui.js — Navigation sidebar, cartes d'accueil, catalogue de quiz, timer HP et utilitaires UI.
  Approche défensive : vérification de l'existence des éléments du DOM avant toute manipulation.
*/

(function () {
  // --- Sélecteurs DOM sécurisés ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Table de correspondance pour les icônes par domaine
  const DOMAIN_ICONS = {
    "Philosophie": "🏛️",
    "Psychologie": "🧠",
    "Histoire": "📜",
    "Sciences": "🔬",
    "Littérature": "📚",
    "Manga": "📖",
    "Anime": "🎬",
    "Jeux vidéo": "🎮",
    "Light Novel": "📑",
    "Webtoon": "📱",
    "Géographie": "🗺️",
    "Cinéma": "🎥",
    "Musique": "🎵",
    "Technologie": "💻",
    "Sports": "⚽",
    "Culture mondiale": "🌍"
  };

  // Attente du chargement complet du DOM
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /**
   * Initialisation principale de l'UI.
   * Doit être appelée après le chargement des données utilisateur (userData dans script.js).
   */
  function initUI() {
    try {
      setupSidebarNavigation();
      renderHomeCards();
      renderCategoryCatalogs();
      renderExtraProfileStats();
      startHpTimerIfNeeded();
      attachGlobalUIHandlers();
    } catch (err) {
      console.warn("ui.js init error:", err);
    }
  }

  // --- Navigation Sidebar ---
  function setupSidebarNavigation() {
    const navItems = $$("[data-nav]");
    if (!navItems.length) return;

    navItems.forEach((item) => {
      // Évite d'attacher plusieurs fois l'événement si initUI est rappelé
      if (item.dataset.navBound) return;
      item.dataset.navBound = "true";

      item.addEventListener("click", () => {
        const target = item.getAttribute("data-nav");
        if (!target) return;
        showPage(target);

        // Sur mobile : ferme la sidebar après un clic
        const sb = $(".sidebar");
        if (sb && window.innerWidth < 900) {
          sb.classList.add("collapsed");
        }
      });
    });
  }

  // --- Affichage des Pages ---
  function showPage(pageId) {
    const pages = $$(".page");
    pages.forEach((p) => p.classList.add("hidden"));

    const target = document.getElementById(pageId);
    if (!target) return;

    target.classList.remove("hidden");
    target.classList.add("fade-in");

    // Suppression de la classe d'animation après son exécution
    setTimeout(() => target.classList.remove("fade-in"), 600);
  }

  // --- Cartes d'Accueil ---
  function renderHomeCards() {
    const homeContainer = document.getElementById("homeCards");
    if (!homeContainer) return;

    const categories = [
      { id: "group-thinkers", icon: "🧠", title: "Penseurs", desc: "Philosophie, Psychologie, Histoire, Sciences, Littérature" },
      { id: "group-otaku", icon: "🎌", title: "Otaku", desc: "Manga, Anime, Jeux vidéo, Light Novel, Webtoon" },
      { id: "group-culture", icon: "🌍", title: "Culture Générale", desc: "Géographie, Cinéma, Musique, Technologie, Sports, Culture mondiale" }
    ];

    homeContainer.innerHTML = categories.map((c) => `
      <div class="home-card" data-nav="${c.id}" role="button" tabindex="0">
        <div class="card-visual">${c.icon}</div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="muted">${escapeHtml(c.desc)}</p>
        <div class="card-actions">
          <button class="button primary">Explorer</button>
        </div>
      </div>
    `).join("");

    // Événements de clic et accessibilité clavier (Entrée + Espace)
    homeContainer.querySelectorAll(".home-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-nav");
        if (id) showPage(id);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // --- Groupes de Domaines et Catalogue ---
  const DOMAIN_GROUPS = {
    "group-thinkers": ["Philosophie", "Psychologie", "Histoire", "Sciences", "Littérature"],
    "group-otaku": ["Manga", "Anime", "Jeux vidéo", "Light Novel", "Webtoon"],
    "group-culture": ["Géographie", "Cinéma", "Musique", "Technologie", "Sports", "Culture mondiale"]
  };

  function renderCategoryCatalogs() {
    Object.entries(DOMAIN_GROUPS).forEach(([groupId, domains]) => {
      const container = document.getElementById(groupId);
      if (!container) return;

      container.innerHTML = `
        <div class="catalog-grid">
          ${domains.map((d) => {
            const icon = DOMAIN_ICONS[d] || "💡";
            return `
              <article class="domain-card" data-domain="${escapeHtml(d)}">
                <div class="domain-icon">${icon}</div>
                <strong>${escapeHtml(d)}</strong>
                <small class="muted domain-count" data-domain-count="${escapeHtml(d)}">…</small>
                <div class="domain-actions">
                  <button class="button sm" data-open-domain="${escapeHtml(d)}">Explorer</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      `;
    });

    // Gestionnaires d'ouverture de domaine
    $$("[data-open-domain]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const domain = btn.getAttribute("data-open-domain");
        openDomain(domain);
      });
    });

    // Mise à jour des compteurs de quiz
    updateDomainCounts();
  }

  // Calcul du nombre de questions par domaine (questions locales + personnalisées)
  function countQuestionsForDomain(domain) {
    try {
      const localCount = (window.QUIZ_QUESTIONS || []).filter((q) => q.domain === domain).length;
      const customCount = (window.customQuestions || []).filter((q) => q.domain === domain).length;
      return localCount + customCount;
    } catch (e) {
      return 0;
    }
  }

  function updateDomainCounts() {
    $$(".domain-count").forEach((el) => {
      const domain = el.getAttribute("data-domain-count");
      const n = countQuestionsForDomain(domain);
      el.textContent = n > 0 ? `${n} quiz` : "Bientôt disponible";
    });
  }

  // Ouverture d'un domaine sélectionné
  function openDomain(domain) {
    if (typeof window.displayQuestions === "function") {
      try {
        window.displayQuestions({ domain });
      } catch (e) {
        console.warn("displayQuestions call failed:", e);
      }
    } else {
      showPage("home");
      const cat = document.getElementById("categoryFilter");
      if (cat) {
        cat.value = domain;
        cat.dispatchEvent(new Event("change"));
      }
      notify(`Filtré sur ${domain}`);
    }
  }

  // --- Statistiques du Profil ---
  function renderExtraProfileStats() {
    if (!window.userData) return;

    const successEl = document.getElementById("successRate");
    if (successEl) {
      const total = Object.keys(window.userData.quizResults || {}).length;
      const correct = Object.values(window.userData.quizResults || {}).filter((r) => r && r.correct).length;
      const pct = total ? Math.round((correct / total) * 100) : 0;
      successEl.textContent = `${pct}%`;
    }

    // Mises à jour rapides dans la sidebar
    const sp = document.getElementById("sidebarPseudo");
    if (sp) sp.textContent = window.userData.pseudo || "Visiteur";

    const sx = document.getElementById("sidebarXP");
    if (sx) sx.textContent = `${window.userData.xp || 0} XP`;

    const sh = document.getElementById("sidebarHP");
    if (sh) sh.textContent = `${window.userData.hp != null ? window.userData.hp : 100} HP`;
  }

  // --- Timer HP (Compte à rebours de régénération) ---
  let hpInterval = null;
  function startHpTimerIfNeeded() {
    if (!window.userData) return;

    const timerEl = document.getElementById("hpTimer");
    if (!timerEl) return;

    if ((window.userData.hp || 0) > 0) {
      timerEl.textContent = "";
      clearInterval(hpInterval);
      return;
    }

    let remaining = 3600; // 1 heure par défaut (3600s)

    clearInterval(hpInterval);
    hpInterval = setInterval(() => {
      remaining--;
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      const formattedSec = s < 10 ? `0${s}` : s;
      timerEl.textContent = `${m}m ${formattedSec}s avant régénération`;

      if (remaining <= 0) {
        clearInterval(hpInterval);
        timerEl.textContent = "HP régénérés !";
        if (typeof window.ensureDailyHP === "function") {
          window.ensureDailyHP();
        }
      }
    }, 1000);
  }

  // --- Système de Notification Volante ---
  let notifyTimeout = null;
  function notify(text, ms = 2200) {
    try {
      let n = document.getElementById("uiNotify");
      if (!n) {
        n = document.createElement("div");
        n.id = "uiNotify";
        n.className = "notification";
        document.body.appendChild(n);
      }

      n.textContent = text;
      n.classList.add("visible");

      if (notifyTimeout) clearTimeout(notifyTimeout);
      notifyTimeout = setTimeout(() => {
        n.classList.remove("visible");
      }, ms);
    } catch (e) {
      console.log("notify:", text);
    }
  }

  // --- Handlers globaux & Utilitaires ---
  function attachGlobalUIHandlers() {
    window.updateDomainCounts = updateDomainCounts;
    window.notify = notify;
    window.showPage = showPage;
  }

  // Échappement HTML contre les injections XSS
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  // Exposition globale de la fonction d'initialisation
  window.initUI = initUI;

  // Initialisation légère au DOM ready
  onReady(() => {
    attachGlobalUIHandlers();
  });
})();