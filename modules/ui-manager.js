/**
 * Abyssus - UI Manager
 * Handles all UI updates and rendering
 */

class UIManager {
  constructor() {
    this.currentSection = 'home';
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.switchSection(section);
      });
    });

    // Domain cards
    this.updateDomainCards();

    // Hero CTA
    document.querySelector('[data-action="start-exploration"]')?.addEventListener('click', () => {
      this.switchSection('domains');
    });
  }

  switchSection(sectionId) {
    // Deactivate current section
    document.querySelectorAll('.section').forEach(s => {
      s.classList.remove('active');
    });

    // Deactivate nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Activate new section
    const newSection = document.getElementById(sectionId);
    if (newSection) {
      newSection.classList.add('active');
      this.currentSection = sectionId;
    }

    // Activate nav link
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

    // Update content based on section
    if (sectionId === 'domains') {
      this.renderDomainsSection();
    } else if (sectionId === 'profile') {
      this.renderProfileSection();
    } else if (sectionId === 'rankings') {
      this.renderRankingsSection();
    }

    window.scrollTo(0, 0);
  }

  updatePlayerStatus() {
    const stats = player.getStats();
    const nextLevel = stats.nextLevel;

    // Navbar
    document.getElementById('navLevel').textContent = stats.level;
    document.getElementById('navXP').textContent = stats.xp;

    // Home section
    document.getElementById('profileLevel').textContent = stats.level;
    document.getElementById('profileXP').textContent = stats.xp;
    document.getElementById('profileHP').textContent = stats.hp;
    document.getElementById('profileDomains').textContent = domainsManager.getExploredDomains();
    document.getElementById('levelProgress').style.width = nextLevel.percent + '%';
    document.getElementById('progressText').textContent = `${Math.round(nextLevel.current)} / ${nextLevel.next} XP jusqu'au prochain niveau`;

    // Stats
    document.getElementById('questionsAnswered').textContent = dataManager.gameState.questsCompleted;
    document.getElementById('titlesUnlocked').textContent = stats.titleCount;
    document.getElementById('relicsCollected').textContent = dataManager.inventory.relics.length;
  }

  updateDomainCards() {
    const grid = document.getElementById('domainsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    domainsManager.getAllDomains().forEach(domain => {
      const progress = domainsManager.getDomainProgress(domain.id);
      const card = document.createElement('div');
      card.className = 'domain-card';
      card.innerHTML = `
        <div class="domain-icon">${domain.icon}</div>
        <div class="domain-name">${domain.name}</div>
        <div class="domain-meta">Niv. ${progress.level} • ${progress.title}</div>
      `;
      card.addEventListener('click', () => {
        domainsManager.selectDomain(domain.id);
        alert(`Tu as sélectionné ${domain.name}!`);
      });
      grid.appendChild(card);
    });
  }

  renderDomainsSection() {
    const list = document.getElementById('domainsList');
    if (!list) return;

    list.innerHTML = '';

    domainsManager.getAllDomains().forEach(domain => {
      const progress = domainsManager.getDomainProgress(domain.id);
      const item = document.createElement('div');
      item.className = 'card';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3>${domain.icon} ${domain.name}</h3>
            <p>${domain.description}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent);">Niv. ${progress.level}</div>
            <div style="color: var(--text-muted); font-size: 0.875rem;">${progress.title}</div>
          </div>
        </div>
        <div class="progress-bar" style="margin: 1rem 0;">
          <div class="progress-fill" style="width: ${progress.progressPercent}%"></div>
        </div>
        <button class="btn btn-primary" style="width: 100%;">Explorer ce domaine</button>
      `;
      list.appendChild(item);
    });
  }

  renderProfileSection() {
    const stats = player.getStats();
    document.getElementById('profileLevelFull').textContent = stats.level;
    document.getElementById('profileXPFull').textContent = stats.xp;
    document.getElementById('profileHPFull').textContent = `${stats.hp} / ${stats.maxHP}`;
    document.getElementById('profileDomainsMastered').textContent = `${stats.domainCount} / 10`;
  }

  renderRankingsSection() {
    const list = document.getElementById('rankingsList');
    if (!list) return;

    // Mock rankings data
    const rankings = [
      { position: 1, name: 'Écho de l\'Abîme', xp: 5200, level: 53 },
      { position: 2, name: 'Voyageur des Ombres', xp: 4800, level: 49 },
      { position: 3, name: 'Gardien du Savoir', xp: 4200, level: 43 },
      { position: 4, name: 'Explorateur Novice', xp: player.data.xp, level: stats.level }
    ];

    list.innerHTML = rankings.map((rank, index) => `
      <div class="ranking-item">
        <div class="rank-position top${Math.min(index + 1, 3)}">#${rank.position}</div>
        <div class="rank-info">
          <h4>${rank.name}</h4>
          <small style="color: var(--text-muted);">Niveau ${rank.level}</small>
        </div>
        <div class="rank-points">
          <strong>${rank.xp} XP</strong>
        </div>
      </div>
    `).join('');
  }
}

const uiManager = new UIManager();