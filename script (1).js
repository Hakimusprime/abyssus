"use strict";

// --- BASE DE DONNÉES DES QUESTIONS ---
window.questions = [
  { id: 1, category: "Psychologie", level: 1, xp: 15, question: "Sommes-nous vraiment maîtres de nos pensées ou simplement témoins de nos automatismes inconscients ?", paradox: "Si nous observons nos pensées, qui est réellement l'observateur ?" },
  { id: 2, category: "Psychologie", level: 2, xp: 20, question: "Nos traumatismes définissent-ils notre identité ou ne sont-ils que des obstacles sur notre trajectoire ?", paradox: "Peut-on guérir d'une blessure qui est devenue le pilier de notre personnalité ?" },
  { id: 3, category: "Psychologie", level: 3, xp: 25, question: "L'empathie pure existe-t-elle, ou cherchons-nous toujours à soulager notre propre inconfort face à la souffrance d'autrui ?", paradox: "Aider l'autre est-il un acte altruiste ou un moyen de calmer sa propre anxiété ?" },
  { id: 4, category: "Psychologie", level: 4, xp: 30, question: "Est-il possible d'aimer quelqu'un sans chercher inconsciemment à le façonner à notre image ?", paradox: "Aime-t-on l'autre pour ce qu'il est ou pour l'écho qu'il produit en nous ?" },
  { id: 5, category: "Philosophie", level: 1, xp: 15, question: "Une vérité qui détruit vaut-elle mieux qu'un mensonge qui préserve ?", paradox: "La vérité est-elle une valeur absolue ou doit-elle être soumise aux conséquences ?" },
  { id: 6, category: "Philosophie", level: 2, xp: 20, question: "Si le destin existe, nos choix ont-ils le moindre sens ?", paradox: "Peut-on être tenu responsable d'une action inévitable ?" },
  { id: 7, category: "Philosophie", level: 3, xp: 25, question: "La liberté est-elle l'absence de contraintes ou la maîtrise absolue de ses propres désirs ?", paradox: "Être libre de tout faire, n'est-ce pas devenir esclave de ses pulsions ?" },
  { id: 8, category: "Philosophie", level: 5, xp: 40, question: "L'existence a-t-elle un sens intrinsèque, ou sommes-nous condamnés à en inventer un pour ne pas sombrer ?", paradox: "Si le sens est inventé, conserve-t-il une valeur réelle ?" },
  { id: 9, category: "Sociologie", level: 1, xp: 15, question: "La société nous civilise-t-elle ou nous réprime-t-elle ?", paradox: "La paix sociale s'achète-t-elle par l'extinction de notre authenticité ?" },
  { id: 10, category: "Sociologie", level: 3, xp: 25, question: "Le pouvoir révèle-t-il la véritable nature d'un individu ou le corrompt-il systématiquement ?", paradox: "Est-ce l'homme qui déforme le pouvoir ou le pouvoir qui transforme l'homme ?" },
  { id: 11, category: "Métaphysique", level: 2, xp: 20, question: "Le temps existe-t-il réellement sans une conscience pour le mesurer ?", paradox: "Le passé et le futur ont-ils une réalité en dehors de notre mémoire ?" },
  { id: 12, category: "Métaphysique", level: 4, xp: 35, question: "Si une intelligence artificielle acquiert la conscience de sa propre mort, devient-elle humaine ?", paradox: "La peur de disparaître est-elle le critère ultime du vivant ?" }
];

// --- APPLICATION SCRIPT ---
function getOrCreateDeviceId() {
  let id = localStorage.getItem("abyssus_device_id");
  if (!id) {
    id = "DEV-" + Math.random().toString(36).substr(2, 7).toUpperCase();
    localStorage.setItem("abyssus_device_id", id);
  }
  return id;
}

let userData = JSON.parse(localStorage.getItem("abyssusData")) || {
  username: "Penseur-" + Math.floor(Math.random() * 1000),
  xp: 0,
  domainXP: {},
  favorites: [],
  completed: {},
  reflections: {},
  likesReceived: 0
};

let communityPosts = JSON.parse(localStorage.getItem("abyssusCommunity")) || [];
let currentQuestion = null;

window.addEventListener("load", () => {
  document.getElementById("deviceSignature").textContent = getOrCreateDeviceId();
  document.getElementById("usernameInput").value = userData.username;
  
  setupTabs();
  populateCategoryFilter();
  updateLevelAndTitles();
  displayQuestions();
  renderCommunityFeed();

  document.getElementById("usernameInput").addEventListener("change", (e) => {
    userData.username = e.target.value || "Anonyme";
    saveData();
    notify("Pseudo mis à jour !");
  });

  document.getElementById("addQuestionForm").addEventListener("submit", handleUserQuestionSubmit);
  document.getElementById("adminQuestionForm").addEventListener("submit", handleAdminQuestionSubmit);
});

function saveData() {
  localStorage.setItem("abyssusData", JSON.stringify(userData));
  localStorage.setItem("abyssusCommunity", JSON.stringify(communityPosts));
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + tab.getAttribute("data-tab")).classList.add("active");
    });
  });
}

const DOMAIN_TITLES = {
  "Psychologie": [
    { threshold: 0, title: "Curieux de l'Esprit" },
    { threshold: 50, title: "Observateur des Comportements" },
    { threshold: 100, title: "Psychologue en Devenir" },
    { threshold: 250, title: "Analyste Freudien" }
  ],
  "Philosophie": [
    { threshold: 0, title: "Initié" },
    { threshold: 50, title: "Pro Socratique" },
    { threshold: 120, title: "Dialecticien" },
    { threshold: 300, title: "Visionnaire Dostoïevskien" }
  ]
};

function getDomainTitle(domain, xp) {
  const titles = DOMAIN_TITLES[domain] || [{ threshold: 0, title: "Penseur en " + domain }];
  let currentTitle = titles[0].title;
  for (let t of titles) { if (xp >= t.threshold) currentTitle = t.title; }
  return currentTitle;
}

function updateLevelAndTitles() {
  const xp = userData.xp;
  let level = Math.floor(xp / 100) + 1;
  let levelName = level >= 5 ? "Penseur Accompli (Agora Débloquée)" : "Chercheur d'Ombres";

  document.getElementById("levelLabel").textContent = `Niv. ${level} — ${levelName}`;
  document.getElementById("xpLabel").textContent = `${xp} XP`;
  document.getElementById("userLevelDisplay").textContent = level;
  document.getElementById("xpCount").textContent = xp;
  document.getElementById("completedCount").textContent = Object.keys(userData.completed).length;
  document.getElementById("likesCount").textContent = userData.likesReceived;
  document.getElementById("userTagDisplay").textContent = userData.username;

  const progress = document.getElementById("levelProgress");
  if (progress) progress.style.width = `${Math.min((xp % 100), 100)}%`;

  const lockNotice = document.getElementById("creationLockNotice");
  const createForm = document.getElementById("addQuestionForm");
  if (level >= 5) {
    if (lockNotice) lockNotice.classList.add("hidden");
    if (createForm) createForm.classList.remove("hidden");
  } else {
    if (lockNotice) lockNotice.classList.remove("hidden");
    if (createForm) createForm.classList.add("hidden");
  }

  const domainContainer = document.getElementById("domainTitlesList");
  if (domainContainer) {
    domainContainer.innerHTML = "";
    Object.keys(userData.domainXP).forEach(domain => {
      const dXP = userData.domainXP[domain];
      const title = getDomainTitle(domain, dXP);
      const card = document.createElement("div");
      card.className = "domain-card";
      card.innerHTML = `<strong>${domain}</strong><span>${title}</span><small>${dXP} XP</small>`;
      domainContainer.appendChild(card);
    });
  }
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const categories = [...new Set(window.questions.map(q => q.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function displayQuestions() {
  const list = document.getElementById("questionList");
  if (!list) return;
  list.innerHTML = "";

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const cat = document.getElementById("categoryFilter")?.value || "";

  let filtered = window.questions.filter(q => {
    return (q.question.toLowerCase().includes(search) || q.category.toLowerCase().includes(search)) && (cat === "" || q.category === cat);
  });

  filtered.forEach(q => {
    const isDone = !!userData.completed[q.id];
    const card = document.createElement("article");
    card.className = "question-card" + (isDone ? " completed" : "");
    card.innerHTML = `
      <div class="question-meta">
        <span class="tag">${q.category}</span>
        <span class="tag level">Niv. ${q.level}</span>
      </div>
      <h3>${q.question}</h3>
      <div class="card-footer">
        <span class="score">+${q.xp} XP</span>
        <button class="button sm">${isDone ? "Revoir" : "Méditer"}</button>
      </div>
    `;
    card.addEventListener("click", () => openQuestion(q));
    list.appendChild(card);
  });
}

function openQuestion(q) {
  currentQuestion = q;
  const dialog = document.getElementById("questionDialog");
  document.getElementById("dialogMeta").innerHTML = `<span class="tag">${q.category}</span>`;
  document.getElementById("dialogQuestion").textContent = q.question;
  document.getElementById("dialogParadox").textContent = q.paradox;
  document.getElementById("reflectionText").value = userData.reflections[q.id] || "";
  dialog.showModal();
}

document.getElementById("closeDialog")?.addEventListener("click", () => {
  document.getElementById("questionDialog").close();
});

document.getElementById("saveReflection")?.addEventListener("click", () => {
  if (!currentQuestion) return;
  const text = document.getElementById("reflectionText").value;
  if (!text.trim()) return notify("Veuillez saisir votre pensée.");

  const isFirstTime = !userData.completed[currentQuestion.id];
  userData.reflections[currentQuestion.id] = text;
  userData.completed[currentQuestion.id] = true;

  if (isFirstTime) {
    const gainedXP = currentQuestion.xp || 15;
    userData.xp += gainedXP;
    const domain = currentQuestion.category || "Général";
    userData.domainXP[domain] = (userData.domainXP[domain] || 0) + gainedXP;
    notify(`Réflexion enregistrée ! +${gainedXP} XP`);
  } else {
    notify("Réflexion mise à jour.");
  }

  communityPosts.unshift({
    id: Date.now(),
    author: userData.username,
    deviceId: getOrCreateDeviceId(),
    question: currentQuestion.question,
    text: text,
    likes: 0
  });

  saveData();
  updateLevelAndTitles();
  displayQuestions();
  renderCommunityFeed();
  document.getElementById("questionDialog").close();
});

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
    card.innerHTML = `
      <div class="post-header">
        <strong>${post.author}</strong>
        <small>${post.deviceId}</small>
      </div>
      <p class="post-question">« ${post.question} »</p>
      <p class="post-text">${post.text}</p>
      <div style="margin-top:6px;">
        <button class="button sm" onclick="likePost(${post.id})">👍 ${post.likes}</button>
      </div>
    `;
    feed.appendChild(card);
  });
}

window.likePost = function(postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    if (post.author === userData.username) {
      userData.likesReceived += 1;
      userData.xp += 5;
      notify("Soutien reçu ! (+5 XP)");
    } else {
      notify("Soutien accordé.");
    }
    saveData();
    updateLevelAndTitles();
    renderCommunityFeed();
  }
};

function handleUserQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("customCategory").value;
  const question = document.getElementById("customQuestion").value;
  const paradox = document.getElementById("customParadox").value;

  window.questions.push({ id: Date.now(), category, level: 5, xp: 25, question, paradox });
  notify("Question ajoutée à l'Agora !");
  document.getElementById("addQuestionForm").reset();
  displayQuestions();
}

function handleAdminQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("adminCategory").value;
  const level = parseInt(document.getElementById("adminLevel").value);
  const xp = parseInt(document.getElementById("adminXP").value);
  const question = document.getElementById("adminQuestion").value;
  const paradox = document.getElementById("adminParadox").value;

  window.questions.push({ id: Date.now(), category, level, xp, question, paradox });
  notify("Question injectée !");
  document.getElementById("adminQuestionForm").reset();
  displayQuestions();
}

function notify(msg) {
  const box = document.getElementById("notification");
  if (!box) return;
  box.textContent = msg;
  box.classList.add("visible");
  setTimeout(() => box.classList.remove("visible"), 2500);
}

document.getElementById("randomQuestion")?.addEventListener("click", () => {
  const q = window.questions[Math.floor(Math.random() * window.questions.length)];
  openQuestion(q);
});

document.getElementById("dailyQuestion")?.addEventListener("click", () => {
  const day = Math.floor(Date.now() / 86400000);
  const q = window.questions[day % window.questions.length];
  openQuestion(q);
});

document.getElementById("exportData")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "abyssus-save.json";
  a.click();
  URL.revokeObjectURL(url);
  notify("Sauvegarde exportée.");
});

document.getElementById("resetData")?.addEventListener("click", () => {
  if (!confirm("Réinitialiser vos données ?")) return;
  localStorage.clear();
  location.reload();
});
