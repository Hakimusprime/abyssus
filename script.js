// ==========================================
// 1. BASE DE DONNÉES DES QUESTIONS
// ==========================================
const abyssusQuizData = [
  {
    id: "Q001",
    question: "Dans Monster de Naoki Urasawa, quel est le nom du programme d'endoctrinement secret où Johan Liebert a grandi ?",
    options: ["L'Espace 47", "Le Kindergarten 511", "La Rose Rouge", "La Clinique des Ombres"],
    correctAnswer: 1,
    difficulty: "Moyen",
    explanation: "Le Kindergarten 511 était un orphelinat expérimental visant à créer des soldats idéaux sans émotions."
  },
  {
    id: "Q002",
    question: "Dans Berserk, quel est le nom du talisman contrôlé par le Béhélit Pourpre qui ouvre la porte de l'Éclipse ?",
    options: ["L'Œuf du Roi Suprême", "La Clé de l'Abysse", "Le Sceau de la Main de Dieu", "L'Œil du Néant"],
    correctAnswer: 0,
    difficulty: "Facile",
    explanation: "L'Œuf du Roi Suprême réagit au désespoir ultime de son porteur pour invoquer la God Hand."
  },
  {
    id: "Q003",
    question: "Dans Tokyo Ghoul, quel est le grade d'investigateur de Kotaro Amon au début de la série ?",
    options: ["Inspecteur Spécial", "Inspecteur de Première Classe", "Inspecteur Adjoint (Rang 2)", "Inspecteur de Rang 3"],
    correctAnswer: 2,
    difficulty: "Moyen",
    explanation: "Amon commence comme Inspecteur Adjoint sous la tutelle de Kureo Mado."
  },
  {
    id: "Q004",
    question: "Dans Sakamoto Days, quelle est la règle absolue imposée par Aoi à son mari Taro Sakamoto ?",
    options: ["Ne plus jamais utiliser d'armes", "Ne plus jamais tuer quiconque", "Ne pas quitter la ville", "Ne plus revoir ses collègues"],
    correctAnswer: 1,
    difficulty: "Facile",
    explanation: "Aoi a menacé Sakamoto du divorce s'il venait à tuer à nouveau."
  },
  {
    id: "Q005",
    question: "Dans Jagaaan, quel compagnon singulier guide Jagasaki dans sa chasse aux Dae-gū ?",
    options: ["Un corbeau mécanique", "Une chouette nommée Doku-chan", "Un chat noir télépathe", "Un serpent de feu"],
    correctAnswer: 1,
    difficulty: "Moyen",
    explanation: "Doku-chan alimente Jagasaki en fientes magiques pour lui permettre de tirer des projectiles."
  }
];

// ==========================================
// 2. CONFIGURATION DES RANGS & PROGRESSION
// ==========================================
const RANK_THRESHOLDS = [
  { rank: "F", xpNeededForNext: 5000 },
  { rank: "E", xpNeededForNext: 10000 },
  { rank: "D", xpNeededForNext: 100000 },
  { rank: "C", xpNeededForNext: 1000000 },
  { rank: "B", xpNeededForNext: 10000000 },
  { rank: "A", xpNeededForNext: Infinity }
];

const MAX_PV = 100;
const DAMAGE_PER_ERROR = 25;
const XP_PER_SUCCESS = 1000;
const COOLDOWN_DURATION_MS = 1 * 60 * 60 * 1000; // 1 heure

// ==========================================
// 3. ÉTAT DE L'APPLICATION (STORAGE & VARS)
// ==========================================
let playerPV = parseInt(localStorage.getItem("abyssus_pv")) || MAX_PV;
let playerXP = parseInt(localStorage.getItem("abyssus_xp")) || 0;
let cooldownEndTime = parseInt(localStorage.getItem("abyssus_cooldown_end")) || 0;

let currentIndex = 0;
let sessionScore = 0;
let isAnswered = false;

let questionTimer = null;
let cooldownInterval = null;
let timeLeft = 5;

// Éléments du DOM
const pvFillEl = document.getElementById("pv-fill");
const pvTextEl = document.getElementById("pv-text");
const xpFillEl = document.getElementById("xp-fill");
const xpTextEl = document.getElementById("xp-text");
const rankBadgeEl = document.getElementById("rank-badge");

const questionNumberEl = document.getElementById("question-number");
const timerBadgeEl = document.getElementById("timer-badge");
const difficultyBadgeEl = document.getElementById("difficulty-badge");
const progressFillEl = document.getElementById("progress-fill");

const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const explanationBoxEl = document.getElementById("explanation-box");
const explanationTextEl = document.getElementById("explanation-text");
const nextBtn = document.getElementById("next-btn");

const cooldownScreenEl = document.getElementById("cooldown-screen");
const cooldownTimerEl = document.getElementById("cooldown-timer");
const quizContainerEl = document.querySelector(".abyssus-quiz-container");

// ==========================================
// 4. GESTION DES STATS, PV & SHAKE
// ==========================================
function updatePlayerStatsUI() {
  let currentRankIndex = 0;
  let accumulatedXP = 0;

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    const stage = RANK_THRESHOLDS[i];
    if (playerXP >= accumulatedXP + stage.xpNeededForNext) {
      accumulatedXP += stage.xpNeededForNext;
      currentRankIndex = i + 1;
    } else {
      break;
    }
  }

  const currentRankInfo = RANK_THRESHOLDS[Math.min(currentRankIndex, RANK_THRESHOLDS.length - 1)];
  const currentRankName = currentRankInfo.rank;
  const xpInCurrentRank = playerXP - accumulatedXP;
  const xpRequiredForNext = currentRankInfo.xpNeededForNext;

  rankBadgeEl.textContent = currentRankName;
  if (xpRequiredForNext === Infinity) {
    xpTextEl.textContent = `${playerXP} XP (Rang Max)`;
    xpFillEl.style.width = "100%";
  } else {
    xpTextEl.textContent = `${xpInCurrentRank} / ${xpRequiredForNext} XP`;
    const xpPercent = Math.min(100, Math.max(0, (xpInCurrentRank / xpRequiredForNext) * 100));
    xpFillEl.style.width = `${xpPercent}%`;
  }

  pvTextEl.textContent = `${playerPV} / ${MAX_PV}`;
  const pvPercent = Math.min(100, Math.max(0, (playerPV / MAX_PV) * 100));
  pvFillEl.style.width = `${pvPercent}%`;

  localStorage.setItem("abyssus_pv", playerPV);
  localStorage.setItem("abyssus_xp", playerXP);
}

function applyDamage(amount) {
  playerPV = Math.max(0, playerPV - amount);
  updatePlayerStatsUI();

  // Animation de secousse
  quizContainerEl.classList.add("shake-damage");
  setTimeout(() => {
    quizContainerEl.classList.remove("shake-damage");
  }, 400);

  if (playerPV <= 0) {
    triggerCooldown();
  }
}

function addXP(amount) {
  playerXP += amount;
  updatePlayerStatsUI();
}

// ==========================================
// 5. GESTION DU COOLDOWN (1 HEURE)
// ==========================================
function triggerCooldown() {
  clearInterval(questionTimer);
  cooldownEndTime = Date.now() + COOLDOWN_DURATION_MS;
  localStorage.setItem("abyssus_cooldown_end", cooldownEndTime);
  checkCooldownState();
}

function checkCooldownState() {
  const now = Date.now();
  if (cooldownEndTime > now) {
    cooldownScreenEl.classList.remove("hidden");
    startCooldownClock();
  } else {
    if (cooldownEndTime !== 0) {
      playerPV = MAX_PV;
      cooldownEndTime = 0;
      localStorage.removeItem("abyssus_cooldown_end");
      updatePlayerStatsUI();
    }
    cooldownScreenEl.classList.add("hidden");
    clearInterval(cooldownInterval);
  }
}

function startCooldownClock() {
  clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    const remainingMs = cooldownEndTime - Date.now();

    if (remainingMs <= 0) {
      clearInterval(cooldownInterval);
      checkCooldownState();
      return;
    }

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    cooldownTimerEl.textContent = 
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

// ==========================================
// 6. MOTEUR DU QUIZ
// ==========================================
function loadQuestion() {
  checkCooldownState();
  if (cooldownEndTime > Date.now()) return;

  isAnswered = false;
  nextBtn.disabled = true;
  explanationBoxEl.classList.add("hidden");

  const currentData = abyssusQuizData[currentIndex];

  questionNumberEl.textContent = `QUESTION ${currentIndex + 1} / ${abyssusQuizData.length}`;
  difficultyBadgeEl.textContent = currentData.difficulty;
  progressFillEl.style.width = `${((currentIndex + 1) / abyssusQuizData.length) * 100}%`;

  questionTextEl.textContent = currentData.question;
  optionsContainerEl.innerHTML = "";

  currentData.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
    button.onclick = () => selectOption(index);
    optionsContainerEl.appendChild(button);
  });

  startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(questionTimer);
  timeLeft = 5;

  timerBadgeEl.textContent = `⏱️ ${timeLeft}s`;
  timerBadgeEl.classList.remove("danger");

  questionTimer = setInterval(() => {
    timeLeft--;
    timerBadgeEl.textContent = `⏱️ ${timeLeft}s`;

    if (timeLeft <= 2) {
      timerBadgeEl.classList.add("danger");
    }

    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      handleTimeout();
    }
  }, 1000);
}

function selectOption(selectedIndex) {
  if (isAnswered) return;
  isAnswered = true;
  clearInterval(questionTimer);

  const currentData = abyssusQuizData[currentIndex];
  const buttons = optionsContainerEl.querySelectorAll(".option-btn");

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentData.correctAnswer) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedIndex === currentData.correctAnswer) {
    sessionScore++;
    addXP(XP_PER_SUCCESS);
    explanationTextEl.textContent = `✅ Victoire ! +${XP_PER_SUCCESS} XP. ${currentData.explanation}`;
  } else {
    applyDamage(DAMAGE_PER_ERROR);
    explanationTextEl.textContent = `❌ Échec ! (-${DAMAGE_PER_ERROR} PV). ${currentData.explanation}`;
  }

  explanationBoxEl.classList.remove("hidden");
  if (playerPV > 0) nextBtn.disabled = false;
}

function handleTimeout() {
  if (isAnswered) return;
  isAnswered = true;

  const currentData = abyssusQuizData[currentIndex];
  const buttons = optionsContainerEl.querySelectorAll(".option-btn");

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentData.correctAnswer) {
      btn.classList.add("correct");
    }
  });

  applyDamage(DAMAGE_PER_ERROR);

  explanationTextEl.textContent = `⌛ Temps écoulé (-${DAMAGE_PER_ERROR} PV) ! ${currentData.explanation}`;
  explanationBoxEl.classList.remove("hidden");
  if (playerPV > 0) nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < abyssusQuizData.length) {
    loadQuestion();
  } else {
    clearInterval(questionTimer);
    showFinalResults();
  }
});

function showFinalResults() {
  quizContainerEl.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2 style="font-family: var(--font-heading); color: var(--xp-gold); font-size: 2rem; margin-bottom: 15px;">⚔️ ÉPREUVE TERMINÉE</h2>
      <p style="font-size: 1.3rem; margin: 20px 0;">Questions réussies : <strong>${sessionScore} / ${abyssusQuizData.length}</strong></p>
      <button onclick="location.reload()" class="btn-primary">Lancer une nouvelle épreuve</button>
    </div>
  `;
}

// Initialisation au chargement de la page
updatePlayerStatsUI();
loadQuestion();
