/**
 * ABYSSUS — Core Engine (Édition Éditoriale Dark & Cataloguée)
 * Emplacement : /script.js
 */

// --- 1. ÉTAT GLOBAL ---
let userData = {
  level: 1,
  xp: 0,
  stats: {
    force: 10,
    agilite: 10,
    intellect: 10,
    volonte: 10
  },
  completedQuizzes: [],
  reflectionData: {}, // Format: { [id]: { text: "", hearts: 0, rewardClaimed: false } }
  defeatedBosses: []
};

const XP_PER_LEVEL = 100;

// --- 2. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadUserData();
  setupNavigation();
  setupEventListeners();

  renderReflections();
  renderQuizzes();
  renderBossTitles();
  renderEventTitles();
  
  updateUI();
  notify("ARCHIVE ABYSSUS CHARGÉE — SYSTÈME PRÊT");
}

// --- 3. SAUVEGARDE ET CHARGEMENT ---
function loadUserData() {
  const saved = localStorage.getItem('abyssus_user_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      userData = { ...userData, ...parsed };
      if (parsed.stats) userData.stats = { ...userData.stats, ...parsed.stats };
      if (parsed.reflectionData) userData.reflectionData = { ...userData.reflectionData, ...parsed.reflectionData };
    } catch (e) {
      console.error("Erreur lors de la lecture du registre Abyssus:", e);
    }
  }
}

function saveUserData() {
  localStorage.setItem('abyssus_user_data', JSON.stringify(userData));
  updateUI();
}

// --- 4. MISE À JOUR INTERFACE ---
function updateUI() {
  const levelEl = document.getElementById('userLevel');
  const xpEl = document.getElementById('userXP');
  const progressBar = document.getElementById('xpProgressBar');

  const maxXP = userData.level * XP_PER_LEVEL;
  const pct = Math.min(100, Math.floor((userData.xp / maxXP) * 100));

  if (levelEl) levelEl.textContent = userData.level;
  if (xpEl) xpEl.textContent = `${userData.xp} / ${maxXP} XP`;
  if (progressBar) progressBar.style.width = `${pct}%`;

  for (const [stat, val] of Object.entries(userData.stats)) {
    const el = document.getElementById(`stat-${stat}`);
    if (el) el.textContent = val;
  }
}

function gainXP(amount) {
  userData.xp += amount;
  const targetXP = userData.level * XP_PER_LEVEL;

  if (userData.xp >= targetXP) {
    userData.xp -= targetXP;
    userData.level += 1;

    userData.stats.force += 2;
    userData.stats.agilite += 2;
    userData.stats.intellect += 2;
    userData.stats.volonte += 2;

    notify(`ACCRÉDITATION ÉLEVÉE : NIVEAU ${userData.level}`);
  }
  saveUserData();
}

// --- 5. NOTIFICATION TOAST ---
function notify(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  
  toast.textContent = `[ABYSSUS] ${message}`;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
}

// --- 6. NAVIGATION ET INTERACTIONS ---
function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
      
      const secEl = document.getElementById(target);
      if (secEl) secEl.classList.add('active');
    });
  });
}

function setupEventListeners() {
  const resetBtn = document.getElementById('btnResetData');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("RÉINITIALISATION DE L'ARCHIVE : Souhaitez-vous vraiment effacer tout votre registre de progression ?")) {
        localStorage.removeItem('abyssus_user_data');
        location.reload();
      }
    });
  }

  const bossBtn = document.getElementById('btnStartBoss');
  if (bossBtn) {
    bossBtn.addEventListener('click', () => {
      if (typeof AbyssusBossEngine !== 'undefined') {
        AbyssusBossEngine.openBossModal();
      } else {
        notify("MOTEUR DE COMBAT EN COURS DE CHARGEMENT");
      }
    });
  }
}

// --- 7. RÉFLEXIONS (RÈGLE DU CŒUR REÇU) ---
function renderReflections() {
  const container = document.getElementById('reflectionsContainer');
  if (!container || typeof reflectionQuestions === 'undefined') return;
  container.innerHTML = '';

  reflectionQuestions.forEach((q) => {
    const data = userData.reflectionData[q.id] || { text: "", hearts: 0, rewardClaimed: false };
    const card = document.createElement('div');
    card.className = 'catalog-card';

    const hasHearts = data.hearts > 0;
    const isClaimed = data.rewardClaimed;

    card.innerHTML = `
      <div class="card-meta">
        <span>REF N° ${q.id}</span>
        <span>+${q.xpReward} XP</span>
      </div>
      
      <div class="reflection-body">
        <h3 class="reflection-title">${q.title}</h3>
        <p class="reflection-text">${q.question}</p>
        
        <textarea id="input-ref-${q.id}" class="editorial-textarea" rows="3" 
          placeholder="Consignez votre analyse ici..." ${isClaimed ? 'disabled' : ''}>${data.text}</textarea>
      </div>

      <div class="reflection-footer">
        <div class="heart-counter">
          ❤️ <span>${data.hearts} Cœur(s)</span>
        </div>

        <div class="actions-group">
          ${!isClaimed ? `
            <button class="btn btn-outline" style="font-size:0.65rem;" onclick="simulateReceiveHeart(${q.id})">
              +1 ❤️ (Autre participant)
            </button>
          ` : ''}

          <button class="btn ${hasHearts && !isClaimed ? 'btn-solid' : 'btn-outline'}" 
            ${(!hasHearts || isClaimed) ? 'disabled' : ''} 
            onclick="claimReflectionReward(${q.id}, ${q.xpReward})">
            ${isClaimed ? 'XP RÉCLAMÉE' : 'RÉCLAMER XP'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

window.simulateReceiveHeart = function(id) {
  if (!userData.reflectionData[id]) {
    userData.reflectionData[id] = { text: "", hearts: 0, rewardClaimed: false };
  }

  const textInput = document.getElementById(`input-ref-${id}`);
  if (textInput) {
    userData.reflectionData[id].text = textInput.value;
  }

  userData.reflectionData[id].hearts += 1;
  saveUserData();
  notify(`NOUVEAU CŒUR ❤️ REÇU SUR LA RÉFLEXION N° ${id}`);
  renderReflections();
};

window.claimReflectionReward = function(id, xpReward) {
  const data = userData.reflectionData[id];
  if (data && data.hearts > 0 && !data.rewardClaimed) {
    data.rewardClaimed = true;
    gainXP(xpReward);
    notify(`XP VALIDÉE ET ATTRIBUÉE (+${xpReward} XP)`);
    saveUserData();
    renderReflections();
  }
};

// --- 8. QUIZ ---
function renderQuizzes() {
  const container = document.getElementById('quizzesContainer');
  if (!container || typeof quizQuestions === 'undefined') return;
  container.innerHTML = '';

  quizQuestions.forEach(q => {
    const isCompleted = userData.completedQuizzes.includes(q.id);
    const card = document.createElement('div');
    card.className = 'catalog-card';

    let optionsHtml = q.options.map((opt, idx) => `
      <button class="btn btn-outline" style="text-align:left; width:100%; margin-bottom:0.5rem; text-transform:none;" 
        ${isCompleted ? 'disabled' : ''} 
        onclick="answerQuiz(${q.id}, ${idx}, ${q.correctIndex}, ${q.xpReward})">
        [${String.fromCharCode(65 + idx)}] ${opt}
      </button>
    `).join('');

    card.innerHTML = `
      <div class="card-meta">
        <span>EVAL N° ${q.id}</span>
        <span>${isCompleted ? 'RÉUSSITE' : '+' + q.xpReward + ' XP'}</span>
      </div>

      <div class="reflection-body">
        <h3 class="reflection-title">${q.title}</h3>
        <p class="reflection-text">${q.question}</p>
        <div style="margin-top:1rem;">${optionsHtml}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

window.answerQuiz = function(id, selected, correct, reward) {
  if (selected === correct) {
    if (!userData.completedQuizzes.includes(id)) {
      userData.completedQuizzes.push(id);
      gainXP(reward);
      notify(`ÉVALUATION VALIDÉE (+${reward} XP)`);
      renderQuizzes();
    }
  } else {
    notify("ÉVALUATION ÉCHOUÉE — ANALYSE INCORRECTE");
  }
};

// --- 9. BOSS & ÉVÉNEMENTS ---
function renderBossTitles() {
  const container = document.getElementById('bossTitlesList');
  if (!container) return;
  container.innerHTML = '';

  if (!userData.defeatedBosses || userData.defeatedBosses.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim); font-family:var(--font-mono); font-size:0.8rem;">AUCUN TITRE DE BOSS ENREGISTRÉ</p>';
    return;
  }

  userData.defeatedBosses.forEach(bossId => {
    const boss = typeof AbyssusBossEngine !== 'undefined' ? AbyssusBossEngine.getBossById(bossId) : null;
    const name = boss ? boss.name : bossId;
    const title = boss ? boss.rewardTitle : "Vainqueur de l'Abysse";

    const div = document.createElement('div');
    div.className = 'title-entry';
    div.innerHTML = `<span>${name}</span><strong>${title}</strong>`;
    container.appendChild(div);
  });
}

function renderEventTitles() {
  const container = document.getElementById('eventTitlesList');
  if (!container) return;
  container.innerHTML = '';

  const events = typeof AbyssusEventEngine !== 'undefined' ? AbyssusEventEngine.getActiveEvents() : [];
  if (events.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim); font-family:var(--font-mono); font-size:0.8rem;">AUCUN ALIGNEMENT ACTIF</p>';
    return;
  }

  events.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'title-entry';
    div.innerHTML = `<span>${ev.title}</span><span style="color:var(--text-muted);">${ev.description}</span>`;
    container.appendChild(div);
  });
}
