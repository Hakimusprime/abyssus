"use strict";

// ============================================================
// ABYSSUS — cœur applicatif (comptes réels, XP, rangs, HP, reliques)
// ============================================================

// ⚠️ Code d'accès Zone Créateur — friction seulement, pas une vraie sécurité
// (visible dans ce fichier). Change-le avant de partager le lien largement.
const ADMIN_PASSPHRASE = "abyssus-createur";

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

// --- ÉTAT LOCAL ---
let currentUid = null;
let userData = null;           // miroir du document Firestore users/{uid}
let communityPosts = [];       // miroir de la collection posts
let leaderboardData = [];      // miroir top 20 users
let customQuestions = [];      // miroir de la collection customQuestions
let currentQuestion = null;    // question actuellement ouverte
let currentQuestionType = null; // 'reflexion' | 'quiz'
let appInitialized = false;

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
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

// --- AUTHENTIFICATION ---

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

// --- INITIALISATION DE L'APPLICATION (une fois les données prêtes) ---

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

// --- XP, RANGS, RELIQUES ---

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

// --- AFFICHAGE ENTÊTE + PROFIL ---

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
    lockNotice?.classList.add("hidden");
    createForm?.classList.remove("hidden");
  } else {
    lockNotice?.classList.remove("hidden");
    createForm?.classList.add("hidden");
  }

  const domainContainer = document.getElementById("domainTitlesList");
  if (domainContainer) {
    domainContainer.innerHTML = "";
    const domains = Object.keys(userData.domainXP || {}).sort((a, b) => userData.domainXP[b] - userData.domainXP[a]);
    if (domains.length === 0) {
      domainContainer.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Réponds à des épreuves pour débloquer tes premiers titres.</p>`;
    }
    domains.forEach(domain => {
      const dXP = userData.domainXP[domain];
      const info = getDomainTitleInfo(domain, dXP);
      const card = document.createElement("div");
      card.className = "domain-card";
      card.innerHTML = `<strong>${domain}</strong><span>${info.title}</span><small>${dXP} XP</small>`;
      domainContainer.appendChild(card);
    });
  }

  const relicsContainer = document.getElementById("relicsList");
  if (relicsContainer) {
    relicsContainer.innerHTML = "";
    const relics = userData.relics || [];
    if (relics.length === 0) {
      relicsContainer.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Aucune relique trouvée pour l'instant. Monte de rang pour en obtenir.</p>`;
    }
    relics.slice().sort((a, b) => a - b).forEach(idx => {
      const relic = RELICS[idx];
      if (!relic) return;
      const card = document.createElement("div");
      card.className = "relic-card " + (RARITY_CLASS[relic.rarity] || "");
      card.innerHTML = `<strong>${relic.name}</strong><span>${relic.rarity}</span>`;
      relicsContainer.appendChild(card);
    });
  }
}

// --- LISTE DES ÉPREUVES (RÉFLEXIONS + QUIZ) ---

function allQuestions() {
  const customReflexions = customQuestions.filter(q => q.type === "reflexion").map(q => ({ ...q, _type: "reflexion" }));
  const customQuiz = customQuestions.filter(q => q.type === "quiz").map(q => ({ ...q, _type: "quiz" }));
  const baseReflexions = REFLECTION_QUESTIONS.map(q => ({ ...q, _type: "reflexion" }));
  const baseQuiz = QUIZ_QUESTIONS.map(q => ({ ...q, _type: "quiz" }));
  return baseReflexions.concat(customReflexions, baseQuiz, customQuiz);
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Tous les domaines</option>`;
  const categories = [...new Set(allQuestions().map(q => q.category || q.domain))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat; opt.textContent = cat;
    select.appendChild(opt);
  });
  select.value = currentValue;
}

function displayQuestions() {
  const list = document.getElementById("questionList");
  if (!list || !userData) return;
  list.innerHTML = "";

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const cat = document.getElementById("categoryFilter")?.value || "";
  const type = document.getElementById("typeFilter")?.value || "";
  const sort = document.getElementById("sortFilter")?.value || "ranking";

  let filtered = allQuestions().filter(q => {
    const domain = q.category || q.domain;
    const matchesSearch = q.question.toLowerCase().includes(search) || domain.toLowerCase().includes(search);
    const matchesCat = cat === "" || domain === cat;
    const matchesType = type === "" || q._type === type;
    const isDone = q._type === "reflexion" ? !!userData.reflections[q.id] : !!userData.quizResults[q.id];
    const matchesFav = sort !== "favorites" || userData.favorites.includes(q.id);
    return matchesSearch && matchesCat && matchesType && matchesFav;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">Aucune épreuve ne correspond à ta recherche.</div>`;
    return;
  }

  filtered.forEach(q => {
    const domain = q.category || q.domain;
    const isDone = q._type === "reflexion" ? !!userData.reflections[q.id] : !!userData.quizResults[q.id];
    const isFav = userData.favorites.includes(q.id);
    const typeTag = q._type === "quiz" ? `<span class="tag quiz-tag">Quiz · ${q.difficulty || ""}</span>` : `<span class="tag">${domain}</span>`;
    const card = document.createElement("article");
    card.className = "question-card" + (isDone ? " completed" : "");
    card.innerHTML = `
      <div class="question-meta">
        ${q._type === "quiz" ? typeTag : `<span class="tag">${domain}</span>`}
        ${isFav ? '<span class="tag" style="color:var(--gold); border-color:var(--gold);">★</span>' : ""}
      </div>
      <h3>${q.question}</h3>
      <div class="card-footer">
        <span class="score">+${q.xp} XP</span>
        <button class="button sm">${isDone ? "Revoir" : (q._type === "quiz" ? "Affronter" : "Méditer")}</button>
      </div>
    `;
    card.addEventListener("click", () => openQuestion(q, q._type));
    list.appendChild(card);
  });
}

document.getElementById("searchInput")?.addEventListener("input", displayQuestions);
document.getElementById("categoryFilter")?.addEventListener("change", displayQuestions);
document.getElementById("typeFilter")?.addEventListener("change", displayQuestions);
document.getElementById("sortFilter")?.addEventListener("change", displayQuestions);

function openQuestion(q, type) {
  if (type === "quiz" && !userData.quizResults[q.id] && (userData.hp || 0) <= 0) {
    notify("Tu es épuisé (0 HP). Reviens demain, ou médite dans le Sanctuaire — cela ne coûte pas de HP.");
    return;
  }

  currentQuestion = q;
  currentQuestionType = type;
  const dialog = document.getElementById("questionDialog");
  const domain = q.category || q.domain;
  document.getElementById("dialogMeta").innerHTML = `<span class="tag">${domain}</span>`;
  document.getElementById("dialogQuestion").textContent = q.question;

  const isFav = userData.favorites.includes(q.id);

  if (type === "reflexion") {
    document.getElementById("reflexionMode").classList.remove("hidden");
    document.getElementById("quizMode").classList.add("hidden");
    document.getElementById("dialogParadox").textContent = q.paradox || "";
    document.getElementById("reflectionText").value = userData.reflections[q.id] || "";
    document.getElementById("dialogFavorite").textContent = isFav ? "★ Favori" : "☆ Favori";
  } else {
    document.getElementById("reflexionMode").classList.add("hidden");
    document.getElementById("quizMode").classList.remove("hidden");
    document.getElementById("dialogFavoriteQuiz").textContent = isFav ? "★ Favori" : "☆ Favori";
    renderQuizChoices(q);
  }

  dialog.showModal();
}

function renderQuizChoices(q) {
  const container = document.getElementById("quizChoices");
  const feedback = document.getElementById("quizFeedback");
  const continueBtn = document.getElementById("closeQuizResult");
  container.innerHTML = "";
  feedback.classList.add("hidden");
  continueBtn.classList.add("hidden");

  const previousResult = userData.quizResults[q.id];

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-choice-btn";
    btn.textContent = choice;

    if (previousResult) {
      btn.disabled = true;
      if (idx === q.correct) btn.classList.add("correct");
      if (idx === previousResult.chosen && !previousResult.correct) btn.classList.add("incorrect");
    } else {
      btn.addEventListener("click", () => submitQuizAnswer(q, idx));
    }
    container.appendChild(btn);
  });

  if (previousResult) {
    feedback.classList.remove("hidden");
    feedback.textContent = previousResult.correct ? "Tu avais déjà résolu cette épreuve avec succès." : "Tu avais déjà tenté cette épreuve — voici la bonne réponse.";
    continueBtn.classList.remove("hidden");
  }
}

async function submitQuizAnswer(q, choiceIdx) {
  const isCorrect = choiceIdx === q.correct;
  const domain = q.domain || q.category;

  const container = document.getElementById("quizChoices");
  Array.from(container.children).forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) btn.classList.add("correct");
    if (idx === choiceIdx && !isCorrect) btn.classList.add("incorrect");
  });

  const feedback = document.getElementById("quizFeedback");
  feedback.classList.remove("hidden");
  feedback.textContent = isCorrect ? `Bonne réponse ! +${q.xp} XP` : "Mauvaise réponse... -10 HP";
  document.getElementById("closeQuizResult").classList.remove("hidden");

  await db.collection("users").doc(currentUid).update({
    [`quizResults.${q.id}`]: { chosen: choiceIdx, correct: isCorrect }
  });

  if (isCorrect) {
    await addXP(q.xp, domain);
  } else {
    await loseHP(10);
  }

  communityPosts; // no post created for quiz answers (kept for the Sanctuaire only)
  displayQuestions();
}

document.getElementById("closeDialog")?.addEventListener("click", () => document.getElementById("questionDialog").close());
document.getElementById("closeQuizResult")?.addEventListener("click", () => document.getElementById("questionDialog").close());

async function toggleFavorite() {
  if (!currentQuestion) return;
  const id = currentQuestion.id;
  const isFav = userData.favorites.includes(id);
  if (isFav) {
    await db.collection("users").doc(currentUid).update({ favorites: firebase.firestore.FieldValue.arrayRemove(id) });
    notify("Retiré des favoris.");
  } else {
    await db.collection("users").doc(currentUid).update({ favorites: firebase.firestore.FieldValue.arrayUnion(id) });
    notify("Ajouté aux favoris.");
  }
  displayQuestions();
}
document.getElementById("dialogFavorite")?.addEventListener("click", toggleFavorite);
document.getElementById("dialogFavoriteQuiz")?.addEventListener("click", toggleFavorite);

document.getElementById("saveReflection")?.addEventListener("click", async () => {
  if (!currentQuestion) return;
  const text = document.getElementById("reflectionText").value;
  if (!text.trim()) return notify("Écris ta réflexion avant de valider.");

  const isFirstTime = !userData.reflections[currentQuestion.id];

  await db.collection("users").doc(currentUid).update({
    [`reflections.${currentQuestion.id}`]: text
  });

  db.collection("posts").add({
    uid: currentUid,
    pseudo: userData.pseudo,
    questionId: currentQuestion.id,
    category: currentQuestion.category,
    question: currentQuestion.question,
    text: text,
    likes: 0,
    likedBy: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  if (isFirstTime) {
    const gainedXP = currentQuestion.xp || 15;
    await addXP(gainedXP, currentQuestion.category || "Philosophie");
    notify(`Réflexion partagée ! +${gainedXP} XP`);
  } else {
    notify("Réflexion mise à jour.");
  }

  displayQuestions();
  document.getElementById("questionDialog").close();
});

document.getElementById("randomQuestion")?.addEventListener("click", () => {
  const qs = allQuestions();
  const q = qs[Math.floor(Math.random() * qs.length)];
  openQuestion(q, q._type);
});
document.getElementById("dailyQuestion")?.addEventListener("click", () => {
  const qs = allQuestions();
  const day = Math.floor(Date.now() / 86400000);
  const q = qs[day % qs.length];
  openQuestion(q, q._type);
});

// --- COMMUNAUTÉ (posts partagés en temps réel) ---

function attachCommunityListener() {
  db.collection("posts").orderBy("createdAt", "desc").limit(100).onSnapshot(snap => {
    communityPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCommunityFeed();
    reconcileLikeXP();
  }, err => console.error("posts listener:", err));
}

function renderCommunityFeed() {
  const feed = document.getElementById("communityFeed");
  if (!feed) return;
  feed.innerHTML = "";
  if (communityPosts.length === 0) {
    feed.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Aucune réflexion partagée pour le moment.</p>`;
    return;
  }
  communityPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "community-card";
    const alreadyLiked = (post.likedBy || []).includes(currentUid);
    card.innerHTML = `
      <div class="post-header">
        <strong>${post.pseudo}</strong>
      </div>
      <p class="post-question">« ${post.question} »</p>
      <p class="post-text">${post.text}</p>
      <div style="margin-top:6px;">
        <button class="button sm" ${alreadyLiked ? "disabled" : ""} onclick="likePost('${post.id}')">👍 ${post.likes || 0}</button>
      </div>
    `;
    feed.appendChild(card);
  });
}

window.likePost = async function (postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;
  if (post.uid === currentUid) return notify("Tu ne peux pas soutenir ta propre réflexion.");
  if ((post.likedBy || []).includes(currentUid)) return notify("Tu as déjà soutenu cette réflexion.");

  await db.collection("posts").doc(postId).update({
    likes: firebase.firestore.FieldValue.increment(1),
    likedBy: firebase.firestore.FieldValue.arrayUnion(currentUid)
  });
  notify("Soutien accordé !");
};

function reconcileLikeXP() {
  if (!userData || !currentUid) return;
  const myPosts = communityPosts.filter(p => p.uid === currentUid);
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const counted = userData.likesCounted || 0;
  if (totalLikes > counted) {
    const delta = totalLikes - counted;
    db.collection("users").doc(currentUid).update({
      likesCounted: totalLikes,
      likesReceived: totalLikes,
      xp: firebase.firestore.FieldValue.increment(delta * 5)
    });
    queueNotify(`Tu as reçu ${delta} nouveau(x) soutien(s) ! (+${delta * 5} XP)`, 3000);
  }
}

// --- CLASSEMENT ---

function attachLeaderboardListener() {
  db.collection("users").orderBy("xp", "desc").limit(20).onSnapshot(snap => {
    leaderboardData = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    renderLeaderboard();
  }, err => console.error("leaderboard listener:", err));
}

function renderLeaderboard() {
  const container = document.getElementById("rankingList");
  if (!container) return;
  container.innerHTML = "";
  if (leaderboardData.length === 0) {
    container.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Le classement se remplit à mesure que des penseurs progressent.</p>`;
    return;
  }
  leaderboardData.forEach((u, idx) => {
    const rank = RANKS[getRankIndex(u.xp || 0)];
    const row = document.createElement("div");
    row.className = "ranking-row" + (u.uid === currentUid ? " me" : "");
    row.innerHTML = `
      <span class="ranking-pos">#${idx + 1}</span>
      <span class="ranking-name">${u.pseudo || "Anonyme"}</span>
      <span class="ranking-rank">Rang ${rank.name}</span>
      <span class="ranking-xp">${u.xp || 0} XP</span>
    `;
    container.appendChild(row);
  });
}

// --- QUESTIONS PERSONNALISÉES (AGORA + CRÉATEUR, PARTAGÉES) ---

function attachCustomQuestionsListener() {
  db.collection("customQuestions").orderBy("createdAt", "asc").onSnapshot(snap => {
    customQuestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    populateCategoryFilter();
    displayQuestions();
  }, err => console.error("customQuestions listener:", err));
}

function handleUserQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("customCategory").value.trim();
  const question = document.getElementById("customQuestion").value.trim();
  const paradox = document.getElementById("customParadox").value.trim();
  if (!category || !question || !paradox) return;

  db.collection("customQuestions").add({
    type: "reflexion", category, level: 5, xp: 25, question, paradox,
    submittedBy: userData.pseudo, createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  notify("Épreuve ajoutée à l'Agora !");
  document.getElementById("addQuestionForm").reset();
}

function handleAdminQuestionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById("adminType").value;
  const category = document.getElementById("adminCategory").value.trim();
  const xp = parseInt(document.getElementById("adminXP").value) || 15;
  if (!category) return;

  if (type === "reflexion") {
    const level = parseInt(document.getElementById("adminLevel").value) || 1;
    const question = document.getElementById("adminQuestion").value.trim();
    const paradox = document.getElementById("adminParadox").value.trim();
    if (!question || !paradox) return;
    db.collection("customQuestions").add({
      type: "reflexion", category, level, xp, question, paradox,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } else {
    const question = document.getElementById("adminQuizQuestion").value.trim();
    const choices = [0, 1, 2, 3].map(i => document.getElementById("adminChoice" + i).value.trim());
    const correct = parseInt(document.getElementById("adminCorrect").value);
    const difficulty = document.getElementById("adminDifficulty").value;
    if (!question || choices.some(c => !c)) return;
    db.collection("customQuestions").add({
      type: "quiz", domain: category, difficulty, xp, question, choices, correct,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  notify("Épreuve injectée dans la base !");
  document.getElementById("adminQuestionForm").reset();
}

// --- NOTIFICATIONS ---

let notifyQueue = [];
let notifyBusy = false;

function queueNotify(msg, duration = 2500) {
  notifyQueue.push({ msg, duration });
  processNotifyQueue();
}
function processNotifyQueue() {
  if (notifyBusy || notifyQueue.length === 0) return;
  notifyBusy = true;
  const { msg, duration } = notifyQueue.shift();
  const box = document.getElementById("notification");
  if (!box) { notifyBusy = false; return; }
  box.textContent = msg;
  box.classList.add("visible");
  setTimeout(() => {
    box.classList.remove("visible");
    setTimeout(() => { notifyBusy = false; processNotifyQueue(); }, 300);
  }, duration);
}
function notify(msg) { queueNotify(msg, 2500); }
