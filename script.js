/* ==========================================================================
   ABYSSUS - ARCHITECTURE FRONT-END (PWA & SPA ENGINE)
   ========================================================================== */

// 1. ÉTAT GLOBAL ET PROFIL JOUEUR
const AbyssState = {
  player: {
    username: "hakimusprime",
    title: "Traqueur d'Abysse",
    bio: "Explorateur passionné de récits sombres, de psychologie et de mangas obscurs.",
    avatarSeed: "hakimusprime",
    xp: 2450,
    hp: 100,
    maxHp: 100,
    lastHpDepletedTime: null // Timestamp de la perte totale de HP
  },
  currentCategory: 'otaku',
  currentSubdomain: 'Tous',
  activeQuiz: null,
  currentQuestionIndex: 0,
  selectedOption: null,
  isAnswered: false,
  questionTimer: null,
  timeLeft: 15,
  hpTimerInterval: null
};

// Constante : Cooldown de régénération totale des HP (1 Heure = 3600000 ms)
const HP_REGEN_COOLDOWN_MS = 60 * 60 * 1000;

/* ==========================================================================
   2. SYSTEME DE PROGRESSION (XP & LEVELING IMMERSIF)
   ========================================================================== */

/**
  * Courbe exponentielle longue :
  * Niv 1: 0 XP
  * Niv 2: 1,000 XP
  * Niv 3: 4,000 XP
  * Niv 4: 9,000 XP
  * Niv 5: 16,000 XP ... Niv 10: 81,000 XP
  */
function getPlayerLevel(xp) {
  return Math.floor(1 + Math.sqrt(xp / 1000));
}

function getXpForNextLevel(currentLevel) {
  return Math.pow(currentLevel, 2) * 1000;
}

function getXpForCurrentLevel(currentLevel) {
  return Math.pow(currentLevel - 1, 2) * 1000;
}

function addXp(amount) {
  const oldLevel = getPlayerLevel(AbyssState.player.xp);
  AbyssState.player.xp += amount;
  const newLevel = getPlayerLevel(AbyssState.player.xp);

  if (newLevel > oldLevel) {
    showToast(`⚡ MONTÉE DE NIVEAU ! Vous êtes désormais Niveau ${newLevel}`);
  } else {
    showToast(`+${amount} XP gagnés !`);
  }
  updatePlayerUI();
}

/* ==========================================================================
   3. GESTION DES HP & RÉGÉNÉRATION SUR 1 HEURE
   ========================================================================== */

function takeDamage(damage) {
  AbyssState.player.hp = Math.max(0, AbyssState.player.hp - damage);
  updatePlayerUI();

  if (AbyssState.player.hp === 0 && !AbyssState.player.lastHpDepletedTime) {
    AbyssState.player.lastHpDepletedTime = Date.now();
    startHpRegenerationTimer();
    showToast("💀 Vos HP sont épuisés ! L'Abysse vous bloque pendant 1 heure.");
  }
}

function startHpRegenerationTimer() {
  if (!AbyssState.player.lastHpDepletedTime) return;

  clearInterval(AbyssState.hpTimerInterval);

  const warningBanner = document.getElementById('hp-warning-banner');
  if (warningBanner) warningBanner.style.display = 'block';

  AbyssState.hpTimerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - AbyssState.player.lastHpDepletedTime;
    const remaining = HP_REGEN_COOLDOWN_MS - elapsed;

    if (remaining <= 0) {
      // Régénération complète après 1h
      AbyssState.player.hp = AbyssState.player.maxHp;
      AbyssState.player.lastHpDepletedTime = null;
      clearInterval(AbyssState.hpTimerInterval);
      if (warningBanner) warningBanner.style.display = 'none';
      updatePlayerUI();
      showToast("❤️ Vos HP ont été totalement régénérés !");
    } else {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      const timerElem = document.getElementById('hp-timer');
      if (timerElem) timerElem.textContent = formatted;
    }
  }, 1000);
}

/* ==========================================================================
   4. BASE DE DONNÉES DES CATALOGUES & QCMS
   ========================================================================== */

const ABYSS_DATABASE = {
  penseurs: {
    title: "🧠 PENSEURS",
    subdomains: ["Tous", "Philosophie", "Psychologie", "Histoire", "Sciences", "Littérature"],
    items: [
      {
        id: "P01",
        title: "Nietzsche & La Volonté de Puissance",
        sub: "Philosophie",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        questions: [
          {
            q: "Quel concept nietzschéen désève le dépassement de soi et de la morale traditionnelle ?",
            options: ["L'Impératif Catégorique", "L'Übermensch (Surhomme)", "Le Leviathan", "Le Contrat Social"],
            correct: 1,
            explanation: "L'Übermensch est la figure qui crée ses propres valeurs au-dessus du nihilisme."
          }
        ]
      },
      {
        id: "P02",
        title: "L'Inconscient selon Carl Jung",
        sub: "Psychologie",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500",
        questions: [
          {
            q: "Comment Jung nomme-t-il les structures psychiques héréditaires partagées par l'humanité ?",
            options: ["Les Complexes", "Les Archétypes", "Les Traumatismes", "Les Pulsions"],
            correct: 1,
            explanation: "Les archétypes constituent le contenu de l'inconscient collectif."
          }
        ]
      }
    ]
  },
  otaku: {
    title: "🎌 OTAKU",
    subdomains: ["Tous", "Manga", "Webtoon", "Anime", "Jeux vidéo", "Light Novel"],
    items: [
      {
        id: "O01",
        title: "Berserk : L'Éclipse & La Marque",
        sub: "Manga",
        rating: "5.0",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500",
        questions: [
          {
            q: "Dans Berserk, quel artefact invoque la Main de Dieu lors du désespoir absolu ?",
            options: ["La Pierre Philosophale", "Le Béhélit Pourpre", "L'Œuf du Dragon", "Le Sceau de Godhand"],
            correct: 1,
            explanation: "Le Béhélit rouge (ou Œuf du Roi Suprême) appartient à Griffith."
          },
          {
            q: "Quel nom porte l'épée colossale forgée par Godo et maniée par Guts ?",
            options: ["Dragonslayer (Fend-Dragon)", "Excalibur", "Vorpal", "La Lame d'Ombre"],
            correct: 0,
            explanation: "La Dragonslayer était jugée trop lourde et brute pour être maniée par un humain ordinaire."
          }
        ]
      },
      {
        id: "O02",
        title: "Solo Leveling & Les Monarques",
        sub: "Webtoon",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
        questions: [
          {
            q: "Quel est le vrai titre du créateur du Système transmis à Sung Jin-Woo ?",
            options: ["Le Monarque des Ombres", "L'Architecte", "Le Roi des Démons", "L'Éveillé Suprême"],
            correct: 1,
            explanation: "L'Architecte a conçu le système d'interface de jeu pour tester les hôtes d'Ashborn."
          }
        ]
      },
      {
        id: "O03",
        title: "Monster : L'Ombre de Johan Liebert",
        sub: "Anime",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
        questions: [
          {
            q: "Dans quel orphelinat expérimental d'Allemagne de l'Est Johan a-t-il subi son conditionnement ?",
            options: ["Kindergarten 511", "Spandau 12", "L'Institut Rose", "L'Asile de Prague"],
            correct: 0,
            explanation: "Le Kindergarten 511 visait à effacer l'individualité des enfants."
          }
        ]
      }
    ]
  },
  culture: {
    title: "🌍 CULTURE GÉNÉRALE",
    subdomains: ["Tous", "Cinéma", "Technologies", "Musique", "Géographie", "Sports"],
    items: [
      {
        id: "C01",
        title: "Thrillers Psychologiques du Cinéma",
        sub: "Cinéma",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
        questions: [
          {
            q: "Qui a réalisé le film culte 'Shutter Island' sorti en 2010 ?",
            options: ["Christopher Nolan", "Martin Scorsese", "David Fincher", "Denis Villeneuve"],
            correct: 1,
            explanation: "Martin Scorsese a dirigé Leonardo DiCaprio dans cette adaptation du roman de Dennis Lehane."
          }
        ]
      }
    ]
  }
};

/* ==========================================================================
   5. NAVIGATION EN VUE UNIQUE (SPA) & INTERFACE
   ========================================================================== */

function navigateTo(viewId) {
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 10);
  }

  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCatalog(categoryKey) {
  AbyssState.currentCategory = categoryKey;
  AbyssState.currentSubdomain = 'Tous';
  
  const data = ABYSS_DATABASE[categoryKey];
  if (!data) return;

  const catalogTitle = document.getElementById('catalog-title');
  if (catalogTitle) catalogTitle.textContent = data.title;

  renderSubdomainsFilter(data.subdomains);
  renderCatalogItems();
  navigateTo('view-catalog');
}

function renderSubdomainsFilter(subdomains) {
  const container = document.querySelector('.horizontal-scroll-filters');
  if (!container) return;

  container.innerHTML = '';
  subdomains.forEach(sub => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${sub === AbyssState.currentSubdomain ? 'active' : ''}`;
    btn.textContent = sub;
    btn.onclick = () => {
      AbyssState.currentSubdomain = sub;
      renderSubdomainsFilter(subdomains);
      renderCatalogItems();
    };
    container.appendChild(btn);
  });
}

function renderCatalogItems() {
  const container = document.getElementById('qcm-list');
  if (!container) return;

  container.innerHTML = '';
  const data = ABYSS_DATABASE[AbyssState.currentCategory];
  if (!data) return;

  const items = AbyssState.currentSubdomain === 'Tous'
    ? data.items
    : data.items.filter(i => i.sub === AbyssState.currentSubdomain);

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'qcm-card glass-card';
    card.innerHTML = `
      <div class="qcm-img" style="background-image: url('${item.image}'); background-size: cover; background-position: center;"></div>
      <div class="qcm-info">
        <h4>${item.title}</h4>
        <span class="qcm-meta">${item.sub} • ${item.questions.length} Questions • ★ ${item.rating}</span>
        <button class="btn-start-qcm" onclick="startQuiz('${item.id}')">Affronter l'Épreuve</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   6. MOTEUR DE QUIZ / ÉPREUVES
   ========================================================================== */

function startQuiz(itemId) {
  if (AbyssState.player.hp <= 0) {
    showToast("⚠️ Vos HP sont épuisés. Attendez la fin de la régénération.");
    return;
  }

  // Recherche de l'épreuve dans la base
  let foundItem = null;
  Object.keys(ABYSS_DATABASE).forEach(cat => {
    const match = ABYSS_DATABASE[cat].items.find(i => i.id === itemId);
    if (match) foundItem = match;
  });

  if (!foundItem) return;

  AbyssState.activeQuiz = foundItem;
  AbyssState.currentQuestionIndex = 0;
  
  navigateTo('view-quiz');
  loadQuestion();
}

function loadQuestion() {
  AbyssState.isAnswered = false;
  AbyssState.selectedOption = null;
  AbyssState.timeLeft = 15;

  const quiz = AbyssState.activeQuiz;
  const qData = quiz.questions[AbyssState.currentQuestionIndex];

  // Remplissage UI
  const qNumElem = document.getElementById('question-number');
  const qTextElem = document.getElementById('question-text');
  const expBox = document.getElementById('explanation-box');

  if (qNumElem) qNumElem.textContent = `QUESTION ${AbyssState.currentQuestionIndex + 1} / ${quiz.questions.length}`;
  if (qTextElem) qTextElem.textContent = qData.q;
  if (expBox) expBox.classList.add('hidden');

  const container = document.getElementById('options-container');
  if (container) {
    container.innerHTML = '';
    qData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
      btn.onclick = () => selectOption(idx);
      container.appendChild(btn);
    });
  }

  startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(AbyssState.questionTimer);
  const timerBadge = document.getElementById('timer-badge');

  AbyssState.questionTimer = setInterval(() => {
    AbyssState.timeLeft--;
    if (timerBadge) timerBadge.textContent = `⏱️ ${AbyssState.timeLeft}s`;

    if (AbyssState.timeLeft <= 0) {
      clearInterval(AbyssState.questionTimer);
      if (!AbyssState.isAnswered) {
        showToast("⏳ Temps écoulé ! -20 HP");
        takeDamage(20);
        showExplanation();
      }
    }
  }, 1000);
}

function selectOption(idx) {
  if (AbyssState.isAnswered) return;
  AbyssState.isAnswered = true;
  clearInterval(AbyssState.questionTimer);

  const qData = AbyssState.activeQuiz.questions[AbyssState.currentQuestionIndex];
  const buttons = document.querySelectorAll('#options-container .option-btn');

  if (idx === qData.correct) {
    buttons[idx].classList.add('correct');
    addXp(500);
  } else {
    buttons[idx].classList.add('wrong');
    buttons[qData.correct].classList.add('correct');
    takeDamage(20);
  }

  showExplanation();
}

function showExplanation() {
  const qData = AbyssState.activeQuiz.questions[AbyssState.currentQuestionIndex];
  const expBox = document.getElementById('explanation-box');
  const expText = document.getElementById('explanation-text');

  if (expBox && expText) {
    expText.textContent = qData.explanation;
    expBox.classList.remove('hidden');
  }

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.disabled = false;
}

function nextQuestion() {
  AbyssState.currentQuestionIndex++;
  const quiz = AbyssState.activeQuiz;

  if (AbyssState.currentQuestionIndex < quiz.questions.length) {
    loadQuestion();
  } else {
    showToast("🎉 Épreuve terminée !");
    navigateTo('view-home');
  }
}

/* ==========================================================================
   7. MISE À JOUR DE L'INTERFACE UTILISATEUR & MODAL
   ========================================================================== */

function updatePlayerUI() {
  const p = AbyssState.player;
  const level = getPlayerLevel(p.xp);
  const xpCurrentLvl = getXpForCurrentLevel(level);
  const xpNextLvl = getXpForNextLevel(level);
  
  const xpProgressPercent = Math.min(100, Math.max(0, ((p.xp - xpCurrentLvl) / (xpNextLvl - xpCurrentLvl)) * 100));
  const hpPercent = (p.hp / p.maxHp) * 100;

  // Mise à jour des textes
  const elements = {
    'player-level': level,
    'menu-user-name': p.username,
    'home-username': p.username,
    'profile-page-name': p.username,
    'profile-page-bio': p.bio,
    'pv-text': `${p.hp} / ${p.maxHp}`,
    'xp-text': `${p.xp} / ${xpNextLvl} XP`
  };

  Object.keys(elements).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = elements[id];
  });

  // Barre de progression
  const xpFills = document.querySelectorAll('.xp-fill, .xp-bar');
  const hpFills = document.querySelectorAll('.hp-fill, .hp-bar');

  xpFills.forEach(bar => bar.style.width = `${xpProgressPercent}%`);
  hpFills.forEach(bar => bar.style.width = `${hpPercent}%`);
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// 8. INITIALISATION AU CHARGEMENT DE LA PAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Événements d'ouverture/fermeture Sidebar
  const openSidebarBtn = document.getElementById('open-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (openSidebarBtn) openSidebarBtn.onclick = openSidebar;
  if (overlay) overlay.onclick = closeSidebar;

  // Bouton de question suivante
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.onclick = nextQuestion;

  // Initialisation du Profil & UI
  updatePlayerUI();
});
