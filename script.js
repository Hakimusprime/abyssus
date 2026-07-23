"use strict";

// ============================================================
// ABYSSUS — cœur applicatif (comptes réels, XP, rangs, HP, reliques)
// ============================================================

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

const RANKS = [
  { name: "F", threshold: 0 }, { name: "E", threshold: 100 }, { name: "D", threshold: 250 },
  { name: "C", threshold: 500 }, { name: "B", threshold: 900 }, { name: "A", threshold: 1500 },
  { name: "S", threshold: 2400 }, { name: "SS", threshold: 3600 }, { name: "SSS", threshold: 5200 },
  { name: "Abyss", threshold: 7200 }
];
const AGORA_UNLOCK_RANK = 3;

function getRankIndex(xp) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].threshold) idx = i; }
  return idx;
}

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

function todayStr() { return new Date().toISOString().slice(0, 10); }

const DEFAULT_USER_DOC = () => ({
  pseudo: "Explorateur-" + Math.floor(Math.random() * 1000),
  xp: 0, domainXP: {}, favorites: [], reflections: {}, quizResults: {},
  relics: [], hp: 100, lastHPReset: todayStr(), likesCounted: 0, likesReceived: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

auth.onAuthStateChanged(user => {
  if (user) { currentUid = user.uid; attachUserListener(user.uid); }
  else {
    setConnectionStatus("Création de ton profil d'explorateur...");
    auth.signInAnonymously().catch(err => { setConnectionStatus("Connexion impossible : " + err.message); });
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
    if (!doc.exists) return ref.set(DEFAULT_USER_DOC());
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
      if (!appInitialized) { appInitialized = true; initApp(); }
      else { renderHeaderAndProfile(); displayQuestions(); }
      ensureDailyHP();
    });
  }).catch(err => { setConnectionStatus("Erreur de connexion : " + err.message); });
}

function ensureDailyHP() {
  if (!userData || !currentUid) return;
  if (userData.lastHPReset !== todayStr() && userData.hp < 100)
    db.collection("users").doc(currentUid).update({ hp: 100, lastHPReset: todayStr() });
  else if (userData.lastHPReset !== todayStr())
    db.collection("users").doc(currentUid).update({ lastHPReset: todayStr() });
}

// ── INIT APP ──
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
    db.collection("users").doc(currentUid).update({ pseudo: (e.target.value || "Anonyme").trim().slice(0, 24) });
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
    const a = document.createElement("a"); a.href = url; a.download = "abyssus-save.json"; a.click();
    URL.revokeObjectURL(url);
    notify("Sauvegarde exportée.");
  });
  // Initialiser les nouveaux modules
  initNewModules();
  // Hook événements
  if (typeof AbyssusEvents !== 'undefined') {
    AbyssusEvents.on(AbyssusEvents.EVENTS.QUIZ_ANSWER, () => {
      if (typeof AbyssusEventEngine !== 'undefined') { AbyssusEventEngine.renderEventPanel('eventPanel'); updateEventCount(); }
      if (typeof AbyssusQuestSystem !== 'undefined') { AbyssusQuestSystem.renderQuestPanel('questPanel'); updateQuestCount(); }
      if (typeof AbyssusPlayerStats !== 'undefined') { AbyssusPlayerStats.renderStatsPanel('detailedStatsPanel'); }
      renderHeaderAndProfile();
    });
    AbyssusEvents.on(AbyssusEvents.EVENTS.REFLECTION_SAVED, () => {
      if (typeof AbyssusEventEngine !== 'undefined') { AbyssusEventEngine.renderEventPanel('eventPanel'); updateEventCount(); }
      if (typeof AbyssusQuestSystem !== 'undefined') { AbyssusQuestSystem.renderQuestPanel('questPanel'); updateQuestCount(); }
    });
    AbyssusEvents.on(AbyssusEvents.EVENTS.BOSS_END, () => { renderBossTitles(); renderHeaderAndProfile(); });
  }
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      if (target === "creator" && sessionStorage.getItem("abyssus_admin_ok") !== "1") {
        const code = prompt("Code d'accès Créateur :");
        if (code === null) return;
        if (code !== ADMIN_PASSPHRASE) { notify("Code incorrect."); return; }
        sessionStorage.setItem("abyssus_admin_ok", "1");
      }
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
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
  if (newRank > oldRank) {
    const indexes = [];
    for (let i = oldRank + 1; i <= newRank; i++) indexes.push(i);
    update.relics = firebase.firestore.FieldValue.arrayUnion(...indexes);
  }
  await db.collection("users").doc(currentUid).update(update);
  if (newRank > oldRank) {
    queueNotify(`Montée de Rang : ${RANKS[newRank].name} !`, 3200);
    if (newRank >= AGORA_UNLOCK_RANK && oldRank < AGORA_UNLOCK_RANK)
      queueNotify("L'Agora est débloquée !", 3600);
    indexes.forEach(idx => {
      const relic = RELICS[idx];
      if (relic) queueNotify(`Relique : ${relic.name} (${relic.rarity})`, 3400);
    });
  }
  if (domain) {
    const unlocked = checkDomainTitleUnlock(domain, oldDomainXP, oldDomainXP + amount);
    if (unlocked) queueNotify(`Nouveau titre : ${unlocked} !`, 3200);
  }
}

async function loseHP(amount) {
  if (!currentUid || !userData) return;
  const newHP = Math.max(0, (userData.hp != null ? userData.hp : 100) - amount);
  await db.collection("users").doc(currentUid).update({ hp: newHP });
  if (newHP === 0) queueNotify("Tu es épuisé (0 HP).", 3200);
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
    progress.style.width = nextRank ? Math.min(100, Math.round(((xp - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100)) + "%" : "100%";
  }
  const hp = userData.hp != null ? userData.hp : 100;
  document.getElementById("hpLabel").textContent = `${hp}/100 HP`;
  const hpFill = document.getElementById("hpFill");
  if (hpFill) { hpFill.style.width = hp + "%"; hpFill.className = hp <= 20 ? "hp-critical" : (hp <= 50 ? "hp-low" : ""); }
  const lockNotice = document.getElementById("creationLockNotice");
  const createForm = document.getElementById("addQuestionForm");
  if (rankIdx >= AGORA_UNLOCK_RANK) { lockNotice?.classList.add("hidden"); createForm?.classList.remove("hidden"); }
  else { lockNotice?.classList.remove("hidden"); createForm?.classList.add("hidden"); }
  const domainContainer = document.getElementById("domainTitlesList");
  if (domainContainer) {
    domainContainer.innerHTML = "";
    const domains = Object.keys(userData.domainXP || {}).sort((a, b) => userData.domainXP[b] - userData.domainXP[a]);
    if (domains.length === 0) domainContainer.innerHTML = `<p style="color:var(--muted);font-size:0.85rem;">Réponds à des épreuves pour débloquer tes premiers titres.</p>`;
    else domains.forEach(domain => {
      const dXP = userData.domainXP[domain];
      const card = document.createElement("div"); card.className = "domain-card";
      card.innerHTML = `<strong>${domain}</strong><span>${getDomainTitleInfo(domain, dXP).title}</span><small>${dXP} XP</small>`;
      domainContainer.appendChild(card);
    });
  }
  const relicsContainer = document.getElementById("relicsList");
  if (relicsContainer) {
    relicsContainer.innerHTML = "";
    const relics = userData.relics || [];
    if (relics.length === 0) relicsContainer.innerHTML = `<p style="color:var(--muted);font-size:0.85rem;">Aucune relique pour l'instant.</p>`;
    else relics.slice().sort((a, b) => a - b).forEach(idx => {
      const relic = RELICS[idx]; if (!relic) return;
      const card = document.createElement("div"); card.className = "relic-card " + (RARITY_CLASS[relic.rarity] || "");
      card.innerHTML = `<strong>${relic.name}</strong><span>${relic.rarity}</span>`;
      relicsContainer.appendChild(card);
    });
  }
}

function allQuestions() {
  const customRef = customQuestions.filter(q => q.type === "reflexion").map(q => ({ ...q, _type: "reflexion" }));
  const customQ = customQuestions.filter(q => q.type === "quiz").map(q => ({ ...q, _type: "quiz" }));
  const baseRef = REFLECTION_QUESTIONS.map(q => ({ ...q, _type: "reflexion" }));
  const baseQ = QUIZ_QUESTIONS.map(q => ({ ...q, _type: "quiz" }));
  return baseRef.concat(customRef, baseQ, customQ);
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Tous les domaines</option>`;
  [...new Set(allQuestions().map(q => q.category || q.domain))].sort().forEach(cat => {
    const opt = document.createElement("option"); opt.value = cat; opt.textContent = cat;
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
    return (q.question.toLowerCase().includes(search) || domain.toLowerCase().includes(search))
      && (cat === "" || domain === cat) && (type === "" || q._type === type)
      && (sort !== "favorites" || userData.favorites.includes(q.id));
  });
  if (filtered.length === 0) { list.innerHTML = `<div class="empty-state">Aucune épreuve.</div>`; return; }
  filtered.forEach(q => {
    const domain = q.category || q.domain;
    const isDone = q._type === "reflexion" ? !!userData.reflections[q.id] : !!userData.quizResults[q.id];
    const isFav = userData.favorites.includes(q.id);
    const card = document.createElement("article");
    card.className = "question-card" + (isDone ? " completed" : "");
    card.innerHTML = `
      <div class="question-meta">
        ${q._type === "quiz" ? `<span class="tag quiz-tag">Quiz · ${q.difficulty || ""}</span>` : `<span class="tag">${domain}</span>`}
        ${isFav ? '<span class="tag" style="color:var(--gold);border-color:var(--gold);">★</span>' : ""}
      </div>
      <h3>${q.question}</h3>
      <div class="card-footer"><span class="score">+${q.xp} XP</span><button class="button sm">${isDone ? "Revoir" : (q._type === "quiz" ? "Affronter" : "Méditer")}</button></div>`;
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
    notify("Tu es épuisé (0 HP)."); return;
  }
  currentQuestion = q; currentQuestionType = type;
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
  container.innerHTML = ""; feedback.classList.add("hidden"); continueBtn.classList.add("hidden");
  const previousResult = userData.quizResults[q.id];
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button"); btn.className = "quiz-choice-btn"; btn.textContent = choice;
    if (previousResult) { btn.disabled = true; if (idx === q.correct) btn.classList.add("correct"); if (idx === previousResult.chosen && !previousResult.correct) btn.classList.add("incorrect"); }
    else btn.addEventListener("click", () => submitQuizAnswer(q, idx));
    container.appendChild(btn);
  });
  if (previousResult) { feedback.classList.remove("hidden"); feedback.textContent = previousResult.correct ? "Déjà résolu avec succès." : "Déjà tenté."; continueBtn.classList.remove("hidden"); }
}

async function submitQuizAnswer(q, choiceIdx) {
  const isCorrect = choiceIdx === q.correct;
  const domain = q.domain || q.category;
  Array.from(document.getElementById("quizChoices").children).forEach((btn, idx) => {
    btn.disabled = true; if (idx === q.correct) btn.classList.add("correct"); if (idx === choiceIdx && !isCorrect) btn.classList.add("incorrect");
  });
  const feedback = document.getElementById("quizFeedback");
  feedback.classList.remove("hidden"); feedback.textContent = isCorrect ? `Bonne réponse ! +${q.xp} XP` : "Mauvaise réponse... -10 HP";
  document.getElementById("closeQuizResult").classList.remove("hidden");
  await db.collection("users").doc(currentUid).update({ [`quizResults.${q.id}`]: { chosen: choiceIdx, correct: isCorrect } });
  if (isCorrect) await addXP(q.xp, domain); else await loseHP(10);
  if (typeof AbyssusEvents !== 'undefined') AbyssusEvents.emit(AbyssusEvents.EVENTS.QUIZ_ANSWER, { correct: isCorrect, firstAttempt: !userData.quizResults[q.id], questionId: q.id, domain });
  displayQuestions();
}

document.getElementById("closeDialog")?.addEventListener("click", () => document.getElementById("questionDialog").close());
document.getElementById("closeQuizResult")?.addEventListener("click", () => document.getElementById("questionDialog").close());

async function toggleFavorite() {
  if (!currentQuestion) return;
  const id = currentQuestion.id;
  if (userData.favorites.includes(id)) { await db.collection("users").doc(currentUid).update({ favorites: firebase.firestore.FieldValue.arrayRemove(id) }); notify("Retiré des favoris."); }
  else { await db.collection("users").doc(currentUid).update({ favorites: firebase.firestore.FieldValue.arrayUnion(id) }); notify("Ajouté aux favoris."); }
  displayQuestions();
}
document.getElementById("dialogFavorite")?.addEventListener("click", toggleFavorite);
document.getElementById("dialogFavoriteQuiz")?.addEventListener("click", toggleFavorite);

document.getElementById("saveReflection")?.addEventListener("click", async () => {
  if (!currentQuestion) return;
  const text = document.getElementById("reflectionText").value;
  if (!text.trim()) return notify("Écris ta réflexion.");
  const isFirstTime = !userData.reflections[currentQuestion.id];
  await db.collection("users").doc(currentUid).update({ [`reflections.${currentQuestion.id}`]: text });
  await db.collection("posts").add({ uid: currentUid, pseudo: userData.pseudo, questionId: currentQuestion.id, category: currentQuestion.category, question: currentQuestion.question, text, likes: 0, likedBy: [], createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  if (isFirstTime) { await addXP(currentQuestion.xp || 15, currentQuestion.category || "Philosophie"); notify(`Réflexion partagée ! +${currentQuestion.xp || 15} XP`); }
  else notify("Réflexion mise à jour.");
  if (typeof AbyssusEvents !== 'undefined') AbyssusEvents.emit(AbyssusEvents.EVENTS.REFLECTION_SAVED, { questionId: currentQuestion.id, category: currentQuestion.category, firstTime: isFirstTime });
  displayQuestions(); document.getElementById("questionDialog").close();
});

document.getElementById("randomQuestion")?.addEventListener("click", () => {
  const qs = allQuestions(); openQuestion(qs[Math.floor(Math.random() * qs.length)], qs[0]._type);
});
document.getElementById("dailyQuestion")?.addEventListener("click", () => {
  const qs = allQuestions(); openQuestion(qs[Math.floor(Date.now() / 86400000) % qs.length], qs[0]._type);
});

function attachCommunityListener() {
  db.collection("posts").orderBy("createdAt", "desc").limit(100).onSnapshot(snap => {
    communityPosts = snap.docs.map(d => ({ id: d.id, ...d.data() })); renderCommunityFeed(); reconcileLikeXP();
  }, err => console.error("posts:", err));
}

function renderCommunityFeed() {
  const feed = document.getElementById("communityFeed"); if (!feed) return;
  feed.innerHTML = communityPosts.length === 0 ? '<p style="color:var(--muted);font-size:0.85rem;">Aucune réflexion.</p>' :
    communityPosts.map(post => `<div class="community-card"><div class="post-header"><strong>${post.pseudo}</strong></div><p class="post-question">« ${post.question} »</p><p class="post-text">${post.text}</p><div style="margin-top:6px;"><button class="button sm" ${(post.likedBy || []).includes(currentUid) ? "disabled" : ""} onclick="likePost('${post.id}')">👍 ${post.likes || 0}</button></div></div>`).join('');
}

window.likePost = async function(postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post || post.uid === currentUid || (post.likedBy || []).includes(currentUid)) return;
  await db.collection("posts").doc(postId).update({ likes: firebase.firestore.FieldValue.increment(1), likedBy: firebase.firestore.FieldValue.arrayUnion(currentUid) });
  notify("Soutien accordé !");
};

function reconcileLikeXP() {
  if (!userData || !currentUid) return;
  const totalLikes = communityPosts.filter(p => p.uid === currentUid).reduce((s, p) => s + (p.likes || 0), 0);
  const counted = userData.likesCounted || 0;
  if (totalLikes > counted) {
    db.collection("users").doc(currentUid).update({ likesCounted: totalLikes, likesReceived: totalLikes, xp: firebase.firestore.FieldValue.increment((totalLikes - counted) * 5) });
    queueNotify(`+${(totalLikes - counted) * 5} XP pour soutiens !`, 3000);
  }
}

function attachLeaderboardListener() {
  db.collection("users").orderBy("xp", "desc").limit(20).onSnapshot(snap => {
    leaderboardData = snap.docs.map(d => ({ uid: d.id, ...d.data() })); renderLeaderboard();
  }, err => console.error("leaderboard:", err));
}

function renderLeaderboard() {
  const container = document.getElementById("rankingList"); if (!container) return;
  container.innerHTML = leaderboardData.length === 0 ? '<p style="color:var(--muted);font-size:0.85rem;">Classement vide...</p>' :
    leaderboardData.map((u, idx) => `<div class="ranking-row${u.uid === currentUid ? " me" : ""}"><span class="ranking-pos">#${idx + 1}</span><span class="ranking-name">${u.pseudo || "Anonyme"}</span><span class="ranking-rank">Rang ${RANKS[getRankIndex(u.xp || 0)].name}</span><span class="ranking-xp">${u.xp || 0} XP</span></div>`).join('');
}

function attachCustomQuestionsListener() {
  db.collection("customQuestions").orderBy("createdAt", "asc").onSnapshot(snap => {
    customQuestions = snap.docs.map(d => ({ id: d.id, ...d.data() })); populateCategoryFilter(); displayQuestions();
  }, err => console.error("customQuestions:", err));
}

function handleUserQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("customCategory").value.trim();
  const question = document.getElementById("customQuestion").value.trim();
  const paradox = document.getElementById("customParadox").value.trim();
  if (!category || !question || !paradox) return;
  db.collection("customQuestions").add({ type: "reflexion", category, level: 5, xp: 25, question, paradox, submittedBy: userData.pseudo, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  notify("Épreuve ajoutée à l'Agora !"); document.getElementById("addQuestionForm").reset();
}

function handleAdminQuestionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById("adminType").value;
  const category = document.getElementById("adminCategory").value.trim();
  const xp = parseInt(document.getElementById("adminXP").value) || 15;
  if (!category) return;
  if (type === "reflexion") {
    const question = document.getElementById("adminQuestion").value.trim();
    const paradox = document.getElementById("adminParadox").value.trim();
    if (!question || !paradox) return;
    db.collection("customQuestions").add({ type: "reflexion", category, level: parseInt(document.getElementById("adminLevel").value) || 1, xp, question, paradox, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  } else {
    const question = document.getElementById("adminQuizQuestion").value.trim();
    const choices = [0,1,2,3].map(i => document.getElementById("adminChoice" + i).value.trim());
    if (!question || choices.some(c => !c)) return;
    db.collection("customQuestions").add({ type: "quiz", domain: category, difficulty: document.getElementById("adminDifficulty").value, xp, question, choices, correct: parseInt(document.getElementById("adminCorrect").value), createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }
  notify("Épreuve injectée !"); document.getElementById("adminQuestionForm").reset();
}

let notifyQueue = [];
let notifyBusy = false;
function queueNotify(msg, duration = 2500) { notifyQueue.push({ msg, duration }); processNotifyQueue(); }
function processNotifyQueue() {
  if (notifyBusy || notifyQueue.length === 0) return;
  notifyBusy = true;
  const { msg, duration } = notifyQueue.shift();
  const box = document.getElementById("notification");
  if (!box) { notifyBusy = false; return; }
  box.textContent = msg; box.classList.add("visible");
  setTimeout(() => { box.classList.remove("visible"); setTimeout(() => { notifyBusy = false; processNotifyQueue(); }, 300); }, duration);
}
function notify(msg) { queueNotify(msg, 2500); }

// ============================================================
// INTÉGRATION DES NOUVEAUX MODULES SYSTÈMES (V2, V3, V5)
// ============================================================

function initNewModules() {
  if (typeof AbyssusPlayerStats !== 'undefined') { AbyssusPlayerStats.init(userData); AbyssusPlayerStats.renderStatsPanel('detailedStatsPanel'); }
  if (typeof AbyssusEventEngine !== 'undefined') { AbyssusEventEngine.init(userData); AbyssusEventEngine.renderEventPanel('eventPanel'); updateEventCount(); }
  if (typeof AbyssusQuestSystem !== 'undefined') { AbyssusQuestSystem.init(userData); AbyssusQuestSystem.renderQuestPanel('questPanel'); updateQuestCount(); }
  renderBossTitles(); renderEventTitles(); setupBossButton();
}

function updateEventCount() {
  const el = document.getElementById('eventCount');
  if (el && typeof AbyssusEventEngine !== 'undefined') el.textContent = `${AbyssusEventEngine.getActiveEvents().length} actif(s)`;
}
function updateQuestCount() {
  const el = document.getElementById('questCount');
  if (el && typeof AbyssusQuestSystem !== 'undefined') el.textContent = `${AbyssusQuestSystem.getActiveQuests().length} active(s)`;
}

function renderBossTitles() {
  const container = document.getElementById('bossTitlesList'); if (!container || !userData) return;
  container.innerHTML = '';
  const titles = userData.bossTitles;
  if (!titles || Object.keys(titles).length === 0) { container.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">Aucun boss vaincu.</p>'; return; }
  Object.entries(titles).forEach(([bossId, title]) => {
    const boss = ABYSSUS_BOSSES?.find(b => b.id === bossId);
    const card = document.createElement('div'); card.className = 'domain-card';
    card.innerHTML = `<strong>${boss?.name || bossId}</strong><span>${title}</span>`; container.appendChild(card);
  });
}

function renderEventTitles() {
  const container = document.getElementById('eventTitlesList'); if (!container || !userData) return;
  container.innerHTML = '';
  const titles = userData.eventTitles;
  if (!titles || Object.keys(titles).length === 0) { container.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">Aucun titre d\'événement.</p>'; return; }
  Object.entries(titles).forEach(([eventId, title]) => {
    const card = document.createElement('div'); card.className = 'domain-card';
    card.innerHTML = `<strong>${eventId}</strong><span>${title}</span>`; container.appendChild(card);
  });
}

function setupBossButton() {
  const btn = document.getElementById('bossEncounterBtn'); if (!btn) return;
  btn.addEventListener('click', async () => {
    if (typeof AbyssusBossEngine === 'undefined') { notify('Système de combat pas chargé.'); return; }
    if (AbyssusBossEngine.getCurrentBoss()) { notify('Déjà en combat !', 3000); return; }
    const xp = userData?.xp || 0;
    const rankThresholds = [0,100,250,500,900,1500,2400,3600,5200,7200];
    const rankNames = ['F','E','D','C','B','A','S','SS','SSS','Abyss'];
    let userRank = 'F';
    for (let i = rankThresholds.length - 1; i >= 0; i--) { if (xp >= rankThresholds[i]) { userRank = rankNames[i]; break; } }
    const boss = AbyssusBossEngine.checkSpawn(userRank, userData?.hp || 100);
    if (!boss) { notify('Aucun boss ne se manifeste...', 3000); return; }
    notify(`⚔ ${boss.name} apparaît !`, 2500); renderBossEncounter(boss);
  });
}

function renderBossEncounter(boss) {
  const container = document.getElementById('bossEncounterContainer'); if (!container) return;
  container.classList.remove('hidden');
  const state = AbyssusBossEngine.startBoss(boss); if (!state) return;
  container.classList.add('animate-in');

  function renderBossUI() {
    const cs = AbyssusBossEngine.getState(); if (!cs) { container.innerHTML = ''; container.classList.add('hidden'); return; }
    const diffClass = cs.boss.difficulty.toLowerCase().replace(/\s+/g, '-');
    container.innerHTML = `
      <div class="boss-encounter">
        <div class="boss-header"><div class="boss-info">
          <h3 class="boss-name">⚔ ${cs.boss.name}</h3>
          <div class="boss-meta">
            <span class="boss-difficulty ${diffClass}">${cs.boss.difficulty}</span>
            <span class="boss-rarity">${cs.boss.rarity}</span><span>${cs.boss.domain}</span>
          </div>
        </div></div>
        <div class="boss-phase-info">
          <span>Phase ${cs.phase.index + 1}/${cs.phase.total}</span>
          <span class="boss-phase-name">${cs.phase.name}</span>
          <span>Question ${cs.question?.index || 1}/${cs.question?.total || 1}</span>
        </div>
        <div class="boss-hp-bar"><span class="boss-hp-fill" style="width:${(cs.phase.hp / cs.phase.maxHP) * 100}%"></span></div>
        ${cs.phase.dialogIntro ? `<div class="boss-dialogue">${cs.phase.dialogIntro}</div>` : ''}
        ${cs.question ? `<div style="margin-top:12px;"><h4 style="font-family:Georgia,serif;margin:0 0 8px;font-size:1.1rem;">${cs.question.text}</h4>
          <div class="question-meta" style="margin-bottom:8px;"><span class="tag">${cs.question.domain}</span><span class="tag level">+${cs.question.xp} XP</span></div>
          ${cs.question.choices ? `<div class="boss-quiz-actions" style="display:grid;gap:8px;">${cs.question.choices.map((c, i) => `<button class="quiz-choice-btn" data-boss-answer="${i}">${c}</button>`).join('')}</div>` : '<p style="color:var(--muted);font-size:0.85rem;">Réfléchis...</p>'}
        </div>` : ''}
        <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end;"><button class="button sm danger" id="bossAbortBtn">Abandonner</button></div>
      </div>`;
    container.querySelectorAll('[data-boss-answer]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const result = await AbyssusBossEngine.answerQuestion(parseInt(btn.dataset.bossAnswer));
        if (result?.victory !== undefined) renderBossResult(result);
        else if (result?.error) notify(result.error);
        else renderBossUI();
      });
    });
    document.getElementById('bossAbortBtn')?.addEventListener('click', () => { AbyssusBossEngine.abortBoss(); container.innerHTML = ''; container.classList.add('hidden'); notify('Combat abandonné.'); });
  }

  function renderBossResult(result) {
    container.innerHTML = `
      <div class="boss-encounter boss-result ${result.victory ? 'victory' : 'defeat'}">
        <h2>${result.victory ? '⚔ VICTOIRE !' : '💀 DÉFAITE...'}</h2>
        <div class="boss-dialogue">${result.dialogue}</div>
        ${result.rewards ? `<div class="boss-rewards">
          <div class="reward-badge"><strong>+${result.rewards.xp}</strong><span>XP</span></div>
          ${result.rewards.title ? `<div class="reward-badge"><strong>${result.rewards.title}</strong><span>Titre</span></div>` : ''}
          ${result.rewards.relicUnlocked ? `<div class="reward-badge"><strong>✦</strong><span>Relique</span></div>` : ''}
        </div>` : ''}
        <div style="margin-top:12px;color:var(--muted);font-size:0.8rem;">${result.stats ? `${result.stats.correct}/${result.stats.totalQuestions} correct · ${Math.floor(result.stats.time / 1000)}s` : ''}</div>
        <button class="button primary" id="bossCloseResult" style="margin-top:12px;">Retour</button>
      </div>`;
    document.getElementById('bossCloseResult')?.addEventListener('click', () => { container.innerHTML = ''; container.classList.add('hidden'); });
    renderHeaderAndProfile();
    if (typeof AbyssusPlayerStats !== 'undefined') AbyssusPlayerStats.renderStatsPanel('detailedStatsPanel');
  }

  renderBossUI();
}
