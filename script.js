/* ==========================================================================
   ABYSSUS - ENGINE COMPLETE
   ========================================================================== */

// 1. ÉTAT GLOBAL ET PROFIL
const AbyssState = {
  player: {
    username: "hakimusprime",
    title: "Explorateur des Ombres",
    bio: "Explorateur passionné de récits sombres, de psychologie et de mangas.",
    xp: 2450,
    hp: 100,
    maxHp: 100,
    lastHpDepletedTime: null
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

// Cooldown de régénération totale des HP (1 Heure)
const HP_REGEN_COOLDOWN_MS = 60 * 60 * 1000;

// 2. COURBE XP ET PROGRESSION
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
    showToast(`⚡ LEVEL UP ! Vous passez au Niveau ${newLevel}`);
  } else {
    showToast(`+${amount} XP !`);
  }
  updatePlayerUI();
}

// 3. GESTION DES HP ET RÉGÉNÉRATION DE 1H
function takeDamage(damage) {
  AbyssState.player.hp = Math.max(0, AbyssState.player.hp - damage);
  updatePlayerUI();

  if (AbyssState.player.hp === 0 && !AbyssState.player.lastHpDepletedTime) {
    AbyssState.player.lastHpDepletedTime = Date.now();
    startHpRegenerationTimer();
    showToast("💀 HP épuisés ! Bloqué pendant 1 heure.");
  }
}

function startHpRegenerationTimer() {
  if (!AbyssState.player.lastHpDepletedTime) return;

  clearInterval(AbyssState.hpTimerInterval);
  const warningBanner = document.getElementById('hp-warning-banner');
  if (warningBanner) warningBanner.style.display = 'block';

  AbyssState.hpTimerInterval = setInterval(() => {
    const elapsed = Date.now() - AbyssState.player.lastHpDepletedTime;
    const remaining = HP_REGEN_COOLDOWN_MS - elapsed;

    if (remaining <= 0) {
      AbyssState.player.hp = AbyssState.player.maxHp;
      AbyssState.player.lastHpDepletedTime = null;
      clearInterval(AbyssState.hpTimerInterval);
      if (warningBanner) warningBanner.style.display = 'none';
      updatePlayerUI();
      showToast("❤️ HP totalement régénérés !");
    } else {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      const timerElem = document.getElementById('hp-timer');
      if (timerElem) {
        timerElem.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }
  }, 1000);
}

// 4. BASE DE DONNÉES PAR DÉFAUT (SI QUIZ_QUESTIONS.JS EST ABSENT OU EN CHARGEMENT)
const LOCAL_DATABASE = {
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
            q: "Quel concept nietzschéen désigne le dépassement de soi ?",
            options: ["L'Impératif Catégorique", "L'Übermensch (Surhomme)", "Le Leviathan", "Le Contrat Social"],
            correct: 1,
            explanation: "L'Übermensch surpasse le nihilisme en créant ses propres valeurs."
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
            q: "Dans Berserk, quel artefact invoque la Main de Dieu ?",
            options: ["La Pierre Philosophale", "Le Béhélit Pourpre", "L'Œuf du Dragon", "Le Sceau de Godhand"],
            correct: 1,
            explanation: "Le Béhélit rouge (Œuf du Roi Suprême) appartient à Griffith."
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
            q: "Quel est le vrai titre du créateur du Système ?",
            options: ["Le Monarque des Ombres", "L'Architecte", "Le Roi des Démons", "L'Éveillé Suprême"],
            correct: 1,
            explanation: "L'Architecte a conçu l'interface de jeu pour trouver un hôte à Ashborn."
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
            q: "Qui a réalisé le film 'Shutter Island' ?",
            options: ["Christopher Nolan", "Martin Scorsese", "David Fincher", "Denis Villeneuve"],
            correct: 1,
            explanation: "Martin Scorsese a réalisé ce film d'après le roman de Dennis Lehane."
          }
        ]
      }
    ]
  }
};

function getDatabase() {
  return (window.ABYSS_DATABASE || window.quizQuestions) ? (window.ABYSS_DATABASE || window.quizQuestions) : LOCAL_DATABASE;
}

// 5. NAVIGATION (SPA)
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
  
  const db = getDatabase();
  const data = db[categoryKey];
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
  const db = getDatabase();
  const data = db[AbyssState.currentCategory];
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
        <span class="qcm-meta">${item.sub} • ${item.questions ? item.questions.length : 10} Qs • ★ ${item.rating || '5.0'}</span>
        <button class="btn-start-qcm" onclick="startQuiz('${item.id}')">Affronter l'Épreuve</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 6. MOTEUR DE QUIZ
function startQuiz(itemId) {
  if (AbyssState.player.hp <= 0) {
    showToast("⚠️ HP épuisés. Attendez la fin du décompte.");
    return;
  }

  const db = getDatabase();
  let foundItem = null;
  Object.keys(db).forEach(cat => {
    if (db[cat].items) {
      const match = db[cat].items.find(i => i.id === itemId);
      if (match) foundItem = match;
    }
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
    if (buttons[qData.correct]) buttons[qData.correct].classList.add('correct');
    takeDamage(20);
  }

  showExplanation();
}

function showExplanation() {
  const qData = AbyssState.activeQuiz.questions[AbyssState.currentQuestionIndex];
  const expBox = document.getElementById('explanation-box');
  const expText = document.getElementById('explanation-text');

  if (expBox && expText) {
    expText.textContent = qData.explanation || "Aucune explication fournie.";
    expBox.classList.remove('hidden');
  }
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

function goBack() {
  navigateTo('view-home');
}

// 7. MISE À JOUR DE L'INTERFACE
function updatePlayerUI() {
  const p = AbyssState.player;
  const level = getPlayerLevel(p.xp);
  const xpCurrentLvl = getXpForCurrentLevel(level);
  const xpNextLvl = getXpForNextLevel(level);
  
  const xpPercent = Math.min(100, Math.max(0, ((p.xp - xpCurrentLvl) / (xpNextLvl - xpCurrentLvl)) * 100));
  const hpPercent = (p.hp / p.maxHp) * 100;

  const elements = {
    'player-level': level,
    'menu-user-name': p.username,
    'profile-page-name': p.username,
    'profile-page-bio': p.bio,
    'pv-text': `${p.hp} / ${p.maxHp}`,
    'xp-text': `${p.xp} / ${xpNextLvl} XP`
  };

  Object.keys(elements).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = elements[id];
  });

  document.querySelectorAll('.xp-fill').forEach(bar => bar.style.width = `${xpPercent}%`);
  document.querySelectorAll('.hp-fill').forEach(bar => bar.style.width = `${hpPercent}%`);
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

// 8. ATTACHEMENT EXPLICITE AU SCOPE GLOBAL (WINDOW)
window.openCatalog = openCatalog;
window.startQuiz = startQuiz;
window.selectOption = selectOption;
window.nextQuestion = nextQuestion;
window.goBack = goBack;
window.navigateTo = navigateTo;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;

document.addEventListener('DOMContentLoaded', () => {
  updatePlayerUI();
});
