// ==========================================
// 1. BASES DE DONNÉES DU CATALOGUE PAR DOMAINES
// ==========================================
const CATALOG_DATA = {
  penseurs: {
    title: "🧠 PENSEURS",
    subdomains: ["Tous", "Philosophie", "Psychologie", "Histoire", "Sciences", "Littérature"],
    items: [
      { id: "P01", title: "Nietzsche & Le Surhomme", sub: "Philosophie", rating: "4.9", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" },
      { id: "P02", title: "Les Abysses de Freud", sub: "Psychologie", rating: "4.7", image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400" },
      { id: "P03", title: "L'Empire Romain", sub: "Histoire", rating: "4.8", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400" }
    ]
  },
  otaku: {
    title: "🎌 OTAKU",
    subdomains: ["Tous", "Manga", "Anime", "Jeux vidéo", "Light Novel", "Webtoon"],
    items: [
      { id: "O01", title: "Berserk : L'Éclipse", sub: "Manga", rating: "5.0", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400" },
      { id: "O02", title: "Monster & Johan Liebert", sub: "Anime", rating: "4.9", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400" },
      { id: "O03", title: "Solo Leveling & Monarques", sub: "Webtoon", rating: "4.8", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" },
      { id: "O04", title: "Elden Ring & Lore", sub: "Jeux vidéo", rating: "4.9", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400" }
    ]
  },
  culture: {
    title: "🌍 CULTURE GÉNÉRALE",
    subdomains: ["Tous", "Géographie", "Cinéma", "Musique", "Technologies", "Sports"],
    items: [
      { id: "C01", title: "Cinéma Dark & Thrillers", sub: "Cinéma", rating: "4.8", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
      { id: "C02", title: "Intelligence Artificielle", sub: "Technologies", rating: "4.7", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" }
    ]
  }
};

// Questions d'épreuves exemple
const quizQuestions = [
  {
    question: "Dans Monster de Naoki Urasawa, quel orphelinat expérimental a vu grandir Johan Liebert ?",
    options: ["L'Espace 47", "Le Kindergarten 511", "La Rose Rouge", "La Clinique des Ombres"],
    correct: 1,
    explanation: "Le Kindergarten 511 visait à créer des soldats idéaux dénués d'émotions."
  },
  {
    question: "Dans Berserk, quel est le talisman qui invoque la Main de Dieu lors de l'Éclipse ?",
    options: ["L'Œuf du Roi Suprême", "La Clé de l'Abysse", "Le Sceau Céleste", "L'Œil du Néant"],
    correct: 0,
    explanation: "Le Béhélit pourpre réagit au désespoir ultime de son porteur."
  }
];

// ==========================================
// 2. GESTION DE LA NAVIGATION & VUES (SPA)
// ==========================================
let currentCategory = 'otaku';
let currentSubdomain = 'Tous';

function switchView(viewId) {
  document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add('active');

  // Fermer la sidebar sur mobile
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchCategory(catKey) {
  currentCategory = catKey;
  currentSubdomain = 'Tous';
  const data = CATALOG_DATA[catKey];

  if (!data) return;

  document.getElementById('catalog-title').textContent = data.title;
  renderSubdomainsBar(data.subdomains);
  renderPosters();
  switchView('view-catalog');
}

function renderSubdomainsBar(subdomains) {
  const container = document.getElementById('subdomains-bar');
  container.innerHTML = '';

  subdomains.forEach(sub => {
    const btn = document.createElement('button');
    btn.className = `sub-tab ${sub === currentSubdomain ? 'active' : ''}`;
    btn.textContent = sub;
    btn.onclick = () => {
      currentSubdomain = sub;
      renderSubdomainsBar(subdomains);
      renderPosters();
    };
    container.appendChild(btn);
  });
}

function renderPosters() {
  const container = document.getElementById('posters-grid');
  container.innerHTML = '';

  const data = CATALOG_DATA[currentCategory];
  if (!data) return;

  const filteredItems = currentSubdomain === 'Tous' 
    ? data.items 
    : data.items.filter(item => item.sub === currentSubdomain);

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'poster-card';
    card.onclick = () => startQuizFromCatalog(item.title);

    card.innerHTML = `
      <div class="poster-image-wrapper">
        <img src="${item.image}" alt="${item.title}">
        <span class="poster-tag">${item.sub}</span>
        <span class="poster-rating">★ ${item.rating}</span>
      </div>
      <div class="poster-info">
        <h4 class="poster-title">${item.title}</h4>
        <span class="poster-sub">5 Questions • 1000 XP</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================
// 3. MENU LATÉRAL (DRAWER)
// ==========================================
const menuToggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

menuToggleBtn.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ==========================================
// 4. MOTEUR D'ÉPREUVE (QUIZ INTEGRATION)
// ==========================================
let currentQuizIndex = 0;
let isQuestionAnswered = false;

function startQuizFromCatalog(title) {
  document.getElementById('quiz-category-tag').textContent = title.toUpperCase();
  currentQuizIndex = 0;
  switchView('view-quiz');
  loadQuizQuestion();
}

function loadQuizQuestion() {
  isQuestionAnswered = false;
  const q = quizQuestions[currentQuizIndex];
  
  document.getElementById('question-number').textContent = `QUESTION ${currentQuizIndex + 1} / ${quizQuestions.length}`;
  document.getElementById('question-text').textContent = q.question;
  document.getElementById('explanation-box').classList.add('hidden');

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${String.fromCharCode(65 + idx)}) ${opt}`;
    btn.onclick = () => handleSelectOption(idx);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('next-btn').disabled = true;
}

function handleSelectOption(selectedIndex) {
  if (isQuestionAnswered) return;
  isQuestionAnswered = true;

  const q = quizQuestions[currentQuizIndex];
  const buttons = document.querySelectorAll('#options-container .option-btn');

  buttons.forEach((btn, idx) => {
    if (idx === q.correct) btn.classList.add('correct');
    else if (idx === selectedIndex) btn.classList.add('wrong');
  });

  const expBox = document.getElementById('explanation-box');
  document.getElementById('explanation-text').textContent = q.explanation;
  expBox.classList.remove('hidden');

  document.getElementById('next-btn').disabled = false;
}

document.getElementById('next-btn').onclick = () => {
  currentQuizIndex++;
  if (currentQuizIndex < quizQuestions.length) {
    loadQuizQuestion();
  } else {
    showToast('🎉 Épreuve terminée avec succès !');
    switchView('view-home');
  }
};

function confirmExitQuiz() {
  if (confirm("Voulez-vous vraiment quitter l'épreuve ?")) {
    switchView('view-home');
  }
}

// ==========================================
// 5. PROFIL & MODAL
// ==========================================
function openEditModal() {
  document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('active');
}

function saveProfileChanges() {
  const newUsername = document.getElementById('edit-input-username').value;
  const newSeed = document.getElementById('edit-input-avatar').value;
  const newBio = document.getElementById('edit-input-bio').value;

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newSeed)}`;

  document.getElementById('home-username').textContent = newUsername;
  document.getElementById('menu-user-name').textContent = newUsername;
  document.getElementById('profile-page-name').textContent = newUsername;

  document.getElementById('header-avatar').src = avatarUrl;
  document.getElementById('menu-user-avatar').src = avatarUrl;
  document.getElementById('home-avatar').src = avatarUrl;
  document.getElementById('profile-page-avatar').src = avatarUrl;

  document.getElementById('profile-page-bio').textContent = newBio;

  closeEditModal();
  showToast('Profil mis à jour !');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
