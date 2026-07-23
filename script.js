"use strict";

// ============================================================
// ABYSSUS — cœur applicatif (comptes réels, XP, rangs, HP, reliques)
// ============================================================

// ⚠️ Code d'accès Zone Créateur — friction seulement, pas une vraie sécurité
// (visible dans ce fichier). Change-le avant de partager le lien largement.
const ADMIN_PASSPHRASE = "hakimus";

const firebaseConfig = {
  apiKey: "AIzaSyA7OxNqHBiVsCNxdhatWRY1WUHYPaO1AmM",
  authDomain: "abyssus-1eb8b.firebaseapp.com",
  projectId: "abyssus-1eb8b",
  storageBucket: "abyssus-1eb8b.firebasestorage.app",
  messagingSenderId: "801360821944",
  appId: "1:801360821944:web:fb267bd710f067bf027e4d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
try { db.enablePersistence({ synchronizeTabs: true }).catch(() => {}); } catch (e) {}

// --- RANGS ---
const RANKS = [
  { name: "F", threshold: 0 },
  { name: "E", threshold: 100 },
  { name: "D", threshold: 250 },
  { name: "C", threshold: 500 },
  { name: "B", threshold: 900 },
  { name: "A", threshold: 1500 },
  { name: "S", threshold: 2400 },
  { name: "SS", threshold: 3600 },
  { name: "SSS", threshold: 5200 },
  { name: "Abyss", threshold: 7200 }
];
const AGORA_UNLOCK_RANK = 3; // "C"

function getRankIndex(xp) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].threshold) idx = i; }
  return idx;
}

// --- RELIQUES (obtenues à chaque montée de rang) ---
const RELICS = {
  1: { name: "Écho de la Première Page", rarity: "Commune" },
  2: { name: "Chandelle du Veilleur", rarity: "Commune" },
  3: { name: "Clé Rouillée de l'Archiviste", rarity: "Rare" },
  4: { name: "Fragment de Grimoire Interdit", rarity: "Rare" },
  5: { name: "Amulette du Sage Oublié", rarity: "Épique" },
  6: { name: "Miroir des Vérités Voilées", rarity: "Épique" },
  7: { name: "Couronne de l'Esprit Abyssal", rarity: "Légendaire" },
  8: { name: "Sceau du Gardien Ultime", rarity: "Légendaire" },
  9: { name: "Cœur de l'Abîme", rarity: "Mythique" }
};
const RARITY_CLASS = { "Commune": "r-commune", "Rare": "r-rare", "Épique": "r-epique", "Légendaire": "r-legendaire", "Mythique": "r-mythique" };

// --- TITRES PAR DOMAINE ---
const DOMAIN_TITLES = {
  "Philosophie": [{ threshold: 0, title: "Penseur" }, { threshold: 50, title: "Sage" }, { threshold: 120, title: "Oracle" }, { threshold: 300, title: "Esprit Abyssal" }],
  "Psychologie": [{ threshold: 0, title: "Curieux de l'Esprit" }, { threshold: 50, title: "Observateur des Comportements" }, { threshold: 120, title: "Psychologue en Devenir" }, { threshold: 300, title: "Analyste Freudien" }],
  "Sociologie": [{ threshold: 0, title: "Apprenti Observateur" }, { threshold: 50, title: "Analyste des Foules" }, { threshold: 120, title: "Durkheimien" }, { threshold: 300, title: "Architecte du Lien Social" }],
  "Métaphysique": [{ threshold: 0, title: "Curieux du Réel" }, { threshold: 50, title: "Chercheur d'Absolu" }, { threshold: 120, title: "Kantien du Noumène" }, { threshold: 300, title: "Métaphysicien Accompli" }],
  "Conscience": [{ threshold: 0, title: "Éveillé" }, { threshold: 50, title: "Contemplatif" }, { threshold: 120, title: "Socratique" }, { threshold: 300, title: "Voyant de l'Être" }],
  "Liberté": [{ threshold: 0, title: "Affranchi" }, { threshold: 50, title: "Insoumis" }, { threshold: 120, title: "Sartrien" }, { threshold: 300, title: "Libre Absolu" }],
  "Identité": [{ threshold: 0, title: "Chercheur de Soi" }, { threshold: 50, title: "Masqué Lucide" }, { threshold: 120, title: "Nietzschéen" }, { threshold: 300, title: "Soi Révélé" }],
  "Vérité": [{ threshold: 0, title: "Sceptique" }, { threshold: 50, title: "Rigoureux" }, { threshold: 120, title: "Cartésien" }, { threshold: 300, title: "Oracle" }],
  "Éthique": [{ threshold: 0, title: "Vertueux" }, { threshold: 50, title: "Rigoriste" }, { threshold: 120, title: "Kantien" }, { threshold: 300, title: "Sage Moral" }],
  "Temps": [{ threshold: 0, title: "Contemplateur" }, { threshold: 50, title: "Instant Présent" }, { threshold: 120, title: "Bergsonien" }, { threshold: 300, title: "Maître du Kairos" }],
  "Mort": [{ threshold: 0, title: "Lucide" }, { threshold: 50, title: "Stoïcien" }, { threshold: 120, title: "Camusien" }, { threshold: 300, title: "Face à l'Abîme" }],
  "Amour": [{ threshold: 0, title: "Romantique" }, { threshold: 50, title: "Fidèle" }, { threshold: 120, title: "Platonicien" }, { threshold: 300, title: "Cœur Absolu" }],
  "Société": [{ threshold: 0, title: "Observateur" }, { threshold: 50, title: "Critique Social" }, { threshold: 120, title: "Rousseauiste" }, { threshold: 300, title: "Architecte Social" }],
  "Pouvoir": [{ threshold: 0, title: "Stratège" }, { threshold: 50, title: "Ambitieux" }, { threshold: 120, title: "Machiavélien" }, { threshold: 300, title: "Souverain" }],
  "Ego": [{ threshold: 0, title: "Humble Apprenti" }, { threshold: 50, title: "Miroir Brisé" }, { threshold: 120, title: "Freudien" }, { threshold: 300, title: "Sans-Masque" }],
  "Contradiction": [{ threshold: 0, title: "Ambivalent" }, { threshold: 50, title: "Dialecticien" }, { threshold: 120, title: "Hégélien" }, { threshold: 300, title: "Uni des Contraires" }],
  "Motivation": [{ threshold: 0, title: "Chercheur de Sens" }, { threshold: 50, title: "Volontaire" }, { threshold: 120, title: "Nietzschéen de l'Élan" }, { threshold: 300, title: "Force Motrice" }],
  "Illusion": [{ threshold: 0, title: "Rêveur Lucide" }, { threshold: 50, title: "Désillusionné" }, { threshold: 120, title: "Sorti de la Caverne" }, { threshold: 300, title: "Voile Levé" }],
  "Existence": [{ threshold: 0, title: "Questionneur" }, { threshold: 50, title: "Existentialiste" }, { threshold: 120, title: "Kierkegaardien" }, { threshold: 300, title: "Absurde Assumé" }],
  "Nature humaine": [{ threshold: 0, title: "Curieux de l'Homme" }, { threshold: 50, title: "Réaliste" }, { threshold: 120, title: "Hobbesien" }, { threshold: 300, title: "Miroir de l'Humanité" }],
  "Technologie": [{ threshold: 0, title: "Novice Connecté" }, { threshold: 50, title: "Observateur Numérique" }, { threshold: 120, title: "Posthumaniste" }, { threshold: 300, title: "Visionnaire du Futur" }],
  "Art": [{ threshold: 0, title: "Sensible" }, { threshold: 50, title: "Esthète" }, { threshold: 120, title: "Contemplateur du Beau" }, { threshold: 300, title: "Créateur de Sens" }],
  "Science": [{ threshold: 0, title: "Curieux Empirique" }, { threshold: 50, title: "Rigoureux Méthodique" }, { threshold: 120, title: "Cartésien du Réel" }, { threshold: 300, title: "Chercheur de Vérité Objective" }],
  "Religion": [{ threshold: 0, title: "Questionneur du Sacré" }, { threshold: 50, title: "Chercheur de Sens" }, { threshold: 120, title: "Théologien Douteur" }, { threshold: 300, title: "Mystique Lucide" }],
  "Politique": [{ threshold: 0, title: "Citoyen Éveillé" }, { threshold: 50, title: "Stratège Civique" }, { threshold: 120, title: "Machiavélien de la Cité" }, { threshold: 300, title: "Architecte du Pouvoir" }],
  "Bonheur": [{ threshold: 0, title: "Chercheur de Joie" }, { threshold: 50, title: "Épicurien" }, { threshold: 120, title: "Stoïcien du Contentement" }, { threshold: 300, title: "Sage Serein" }],
  "Peur": [{ threshold: 0, title: "Vigilant" }, { threshold: 50, title: "Brave Timide" }, { threshold: 120, title: "Stoïcien face à l'Effroi" }, { threshold: 300, title: "Sans-Peur Lucide" }],
  "Souffrance": [{ threshold: 0, title: "Endurant" }, { threshold: 50, title: "Résilient" }, { threshold: 120, title: "Nietzschéen de l'Épreuve" }, { threshold: 300, title: "Sage de la Douleur" }],
  "Choix": [{ threshold: 0, title: "Hésitant Lucide" }, { threshold: 50, title: "Décideur" }, { threshold: 120, title: "Sartrien du Choix" }, { threshold: 300, title: "Maître de sa Volonté" }],
  "Désir": [{ threshold: 0, title: "Rêveur" }, { threshold: 50, title: "Épicurien du Désir" }, { threshold: 120, title: "Spinoziste" }, { threshold: 300, title: "Maître de ses Passions" }],
  "Justice": [{ threshold: 0, title: "Équitable" }, { threshold: 50, title: "Rawlsien" }, { threshold: 120, title: "Gardien du Droit" }, { threshold: 300, title: "Sage de la Balance" }],
  "Mémoire": [{ threshold: 0, title: "Archiviste de Soi" }, { threshold: 50, title: "Nostalgique Lucide" }, { threshold: 120, title: "Proustien" }, { threshold: 300, title: "Gardien du Passé" }],
  "Rêve": [{ threshold: 0, title: "Songeur" }, { threshold: 50, title: "Interprète" }, { threshold: 120, title: "Jungien" }, { threshold: 300, title: "Voyageur de l'Inconscient" }],
  "Sagesse": [{ threshold: 0, title: "Apprenti Sage" }, { threshold: 50, title: "Stoïcien en Devenir" }, { threshold: 120, title: "Confucéen" }, { threshold: 300, title: "Sage Accompli" }],
  "Silence": [{ threshold: 0, title: "Contemplatif" }, { threshold: 50, title: "Observateur Silencieux" }, { threshold: 120, title: "Taoïste" }, { threshold: 300, title: "Maître du Vide" }],
  "Solitude": [{ threshold: 0, title: "Solitaire Curieux" }, { threshold: 50, title: "Ermite Lucide" }, { threshold: 120, title: "Nietzschéen de la Solitude" }, { threshold: 300, title: "Maître de Soi" }],
  "Manga": [{ threshold: 0, title: "Lecteur" }, { threshold: 50, title: "Collectionneur" }, { threshold: 120, title: "Maître Otaku" }, { threshold: 300, title: "Archiviste Manga" }],
  "Anime": [{ threshold: 0, title: "Spectateur" }, { threshold: 50, title: "Fan Dévoué" }, { threshold: 120, title: "Otaku Confirmé" }, { threshold: 300, title: "Archiviste Animé" }],
  "Culture générale": [{ threshold: 0, title: "Explorateur" }, { threshold: 50, title: "Savant" }, { threshold: 120, title: "Gardien du Savoir" }, { threshold: 300, title: "Oracle du Savoir" }],
  "Sciences": [{ threshold: 0, title: "Apprenti Scientifique" }, { threshold: 50, title: "Chercheur" }, { threshold: 120, title: "Analyste Rigoureux" }, { threshold: 300, title: "Esprit Cartésien" }],
  "Histoire": [{ threshold: 0, title: "Amateur d'Histoire" }, { threshold: 50, title: "Chroniqueur" }, { threshold: 120, title: "Historien" }, { threshold: 300, title: "Gardien de la Mémoire" }],
  "Littérature": [{ threshold: 0, title: "Lecteur Assidu" }, { threshold: 50, title: "Critique Littéraire" }, { threshold: 120, title: "Érudit des Lettres" }, { threshold: 300, title: "Bibliothécaire de l'Abîme" }],
  "Jeux vidéo": [{ threshold: 0, title: "Joueur Occasionnel" }, { threshold: 50, title: "Gamer Confirmé" }, { threshold: 120, title: "Stratège Virtuel" }, { threshold: 300, title: "Légende du Pixel" }],
  "Cinéma": [{ threshold: 0, title: "Spectateur" }, { threshold: 50, title: "Cinéphile" }, { threshold: 120, title: "Critique Averti" }, { threshold: 300, title: "Archiviste du Septième Art" }]
};

function getDomainTitleInfo(domain, xp) {
  const titles = DOMAIN_TITLES[domain] || [{ threshold: 0, title: "Explorateur de " + domain }];
  let current = titles[0];
  for (const t of titles) { if (xp >= t.threshold) current = t; }
  return current;
}

function checkDomainTitleUnlock(domain, oldXP, newXP) {
  const titles = DOMAIN_TITLES[domain];
  if (!titles) return null;
  let unlocked = null;
  for (const t of titles) { if (t.threshold > 0 && oldXP < t.threshold && newXP >= t.threshold) unlocked = t.title; }
  return unlocked;
}

let currentUid = null;
let userData = null;
let communityPosts = [];
let leaderboardData = [];
let customQuestions = [];
let currentQuestion = null;
let currentQuestionType = null;
let appInitialized = false;

// --- GESTION DU CHRONOMÈTRE DE RÉFLEXION (< 10 SECONDES) ---
let questionLoadedTime = 0;

function markQuestionLoaded() {
  questionLoadedTime = Date.now();
}

function validateReflectionSpeed() {
  const TEN_SECONDS = 10000;
  const elapsed = Date.now() - questionLoadedTime;
  if (elapsed < TEN_SECONDS) {
    // Moins de 10 secondes : pénalité de -50 XP et refus de validation
    addXP(-50, currentQuestion ? currentQuestion.domain : null);
    queueNotify("L'Abîme condamne la précipitation (-50 XP). Prends le temps de penser.", 4000);
    return false; // Bloque la soumission
  }
  return true; // Temps respecté, valide
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

const DEFAULT_USER_DOC = () => ({
  pseudo: "Explorateur-" + Math.floor(Math.random() * 1000),
  xp: 0,
  domainXP: {},
  favorites: [],
  reflections: {},
  quizResults: {},
  relics: [],
  hp: 100,
  lastHPReset: todayStr(),
  likesCounted: 0,
  likesReceived: 0,
  lastPlayTime: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
auth.onAuthStateChanged(user => {
  if (user) {
    currentUid = user.uid;
    attachUserListener(user.uid);
  } else {
    setConnectionStatus("Création de ton profil d'explorateur...");
    auth.signInAnonymously().catch(err => {
      setConnectionStatus("Connexion impossible : " + err.message);
    });
  }
});

function setConnectionStatus(text) {
  const el = document.getElementById("connectionStatus");
  if (el) el.textContent = text;
}

function hideConnectionOverlay() {
  const overlay = document.getElementById("connectionOverlay");
  if (overlay) overlay.style.display = "none";
}

function attachUserListener(uid) {
  const ref = db.collection("users").doc(uid);
  ref.get().then(doc => {
    if (!doc.exists) {
      const fresh = DEFAULT_USER_DOC();
      return ref.set(fresh);
    }
  }).then(() => {
    ref.onSnapshot(snap => {
      if (!snap.exists) return;
      userData = snap.data();
      if (!userData.domainXP) userData.domainXP = {};
      if (!userData.favorites) userData.favorites = [];
      if (!userData.reflections) userData.reflections = {};
      if (!userData.quizResults) userData.quizResults = {};
      if (!userData.relics) userData.relics = [];
      if (userData.hp === undefined) userData.hp = 100;
      if (userData.lastPlayTime === undefined) userData.lastPlayTime = 0;

      if (!appInitialized) {
        appInitialized = true;
        initApp();
      } else {
        renderHeaderAndProfile();
        displayQuestions();
      }

      ensureDailyHP();
    });
  }).catch(err => {
    setConnectionStatus("Erreur de connexion : " + err.message);
  });
}

function ensureDailyHP() {
  if (!userData || !currentUid) return;
  if (userData.lastHPReset !== todayStr() && userData.hp < 100) {
    db.collection("users").doc(currentUid).update({ hp: 100, lastHPReset: todayStr() });
  } else if (userData.lastHPReset !== todayStr()) {
    db.collection("users").doc(currentUid).update({ lastHPReset: todayStr() });
  }
}

function checkAndApplyCooldown() {
  const ONE_HOUR = 60 * 60 * 1000;
  const lastPlay = userData.lastPlayTime || 0;
  const now = Date.now();

  if (now - lastPlay < ONE_HOUR) {
    const remainingMinutes = Math.ceil((ONE_HOUR - (now - lastPlay)) / 60000);
    queueNotify(`L'Abîme exige du repos. Veuillez patienter encore ${remainingMinutes} minute(s).`, 3500);
    return false;
  }
  
  db.collection("users").doc(currentUid).update({ lastPlayTime: now });
  return true;
}

function initApp() {
  document.getElementById("deviceSignature").textContent = currentUid.slice(0, 10).toUpperCase();
  document.getElementById("usernameInput").value = userData.pseudo;

  setupTabs();
  populateCategoryFilter();
  renderHeaderAndProfile();
  displayQuestions();
  attachCommunityListener();
  attachLeaderboardListener();
  attachCustomQuestionsListener();

  queueNotify(`Bienvenue, ${userData.pseudo}. L'Abîme t'attend.`, 3000);
  hideConnectionOverlay();

  document.getElementById("usernameInput").addEventListener("change", (e) => {
    const val = (e.target.value || "Anonyme").trim().slice(0, 24);
    db.collection("users").doc(currentUid).update({ pseudo: val });
    notify("Pseudo mis à jour !");
  });

  document.getElementById("addQuestionForm").addEventListener("submit", handleUserQuestionSubmit);
  document.getElementById("adminQuestionForm").addEventListener("submit", handleAdminQuestionSubmit);

  document.getElementById("adminType").addEventListener("change", (e) => {
    const isQuiz = e.target.value === "quiz";
    document.getElementById("adminReflexionFields").classList.toggle("hidden", isQuiz);
    document.getElementById("adminQuizFields").classList.toggle("hidden", !isQuiz);
  });

  document.getElementById("exportData")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "abyssus-save.json"; a.click();
    URL.revokeObjectURL(url);
    notify("Sauvegarde exportée.");
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      if (target === "creator" && sessionStorage.getItem("abyssus_admin_ok") !== "1") {
        const code = prompt("Code d'accès Créateur :");
        if (code === null) return;
        if (code !== ADMIN_PASSPHRASE) { notify("Code incorrect."); return; }
        sessionStorage.setItem("abyssus_admin_ok", "1");
      }
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");
    });
  });
}

async function addXP(amount, domain) {
  if (!currentUid || !userData) return;
  const oldXP = userData.xp;
  const oldRank = getRankIndex(oldXP);
  const oldDomainXP = domain ? (userData.domainXP[domain] || 0) : 0;

  const update = { xp: firebase.firestore.FieldValue.increment(amount) };
  if (domain) update["domainXP." + domain] = firebase.firestore.FieldValue.increment(amount);

  const newXPLocal = oldXP + amount;
  const newRank = getRankIndex(newXPLocal);
  const newRelicIndexes = [];
  if (newRank > oldRank) {
    for (let i = oldRank + 1; i <= newRank; i++) newRelicIndexes.push(i);
    update.relics = firebase.firestore.FieldValue.arrayUnion(...newRelicIndexes);
  }

  await db.collection("users").doc(currentUid).update(update);

  if (newRank > oldRank) {
    queueNotify(`Montée de Rang : ${RANKS[newRank].name} !`, 3200);
    if (newRank >= AGORA_UNLOCK_RANK && oldRank < AGORA_UNLOCK_RANK) {
      queueNotify("L'Agora est débloquée : tu peux proposer tes propres épreuves.", 3600);
    }
    newRelicIndexes.forEach(idx => {
      const relic = RELICS[idx];
      if (relic) queueNotify(`Relique obtenue : ${relic.name} (${relic.rarity})`, 3400);
    });
  }

  if (domain) {
    const newDomainXPLocal = oldDomainXP + amount;
    const unlocked = checkDomainTitleUnlock(domain, oldDomainXP, newDomainXPLocal);
    if (unlocked) queueNotify(`Nouveau titre en ${domain} : ${unlocked} !`, 3200);
  }
}

async function loseHP(amount) {
  if (!currentUid || !userData) return;
  const newHP = Math.max(0, (userData.hp != null ? userData.hp : 100) - amount);
  await db.collection("users").doc(currentUid).update({ hp: newHP });
  if (newHP === 0) queueNotify("Tu es épuisé (0 HP). Le Sanctuaire de Pensée reste ouvert.", 3200);
}

function renderHeaderAndProfile() {
  if (!userData) return;
  const xp = userData.xp || 0;
  const rankIdx = getRankIndex(xp);
  const rank = RANKS[rankIdx];
  const nextRank = RANKS[rankIdx + 1];

  document.getElementById("levelLabel").textContent = `Rang ${rank.name}`;
  document.getElementById("xpLabel").textContent = `${xp} XP`;
  document.getElementById("userLevelDisplay").textContent = rank.name;
  document.getElementById("xpCount").textContent = xp;
  document.getElementById("completedCount").textContent = Object.keys(userData.reflections || {}).length + Object.keys(userData.quizResults || {}).length;
  document.getElementById("likesCount").textContent = userData.likesReceived || 0;
  document.getElementById("userTagDisplay").textContent = userData.pseudo;

  const progress = document.getElementById("levelProgress");
  if (progress) {
    if (!nextRank) { progress.style.width = "100%"; }
    else {
      const span = nextRank.threshold - rank.threshold;
      const pct = Math.min(100, Math.round(((xp - rank.threshold) / span) * 100));
      progress.style.width = pct + "%";
    }
  }

  const hp = userData.hp != null ? userData.hp : 100;
  document.getElementById("hpLabel").textContent = `${hp}/100 HP`;
  const hpFill = document.getElementById("hpFill");
  if (hpFill) {
    hpFill.style.width = hp + "%";
    hpFill.className = hp <= 20 ? "hp-critical" : (hp <= 50 ? "hp-low" : "");
  }

  const lockNotice = document.getElementById("creationLockNotice");
  const createForm = document.getElementById("addQuestionForm");
  if (rankIdx >= AGORA_UNLOCK_RANK) {
    if (lockNotice) lockNotice.classList.add("hidden");
    if (createForm) createForm.classList.remove("locked-form");
  } else {
    if (lockNotice) lockNotice.classList.remove("hidden");
    if (createForm) createForm.classList.add("locked-form");
  }

  renderDomainList();
  renderRelicsList();
}
