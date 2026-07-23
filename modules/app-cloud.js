/**
 * Abyssus - Enhanced initialization with Firebase
 * Entry point with cloud features
 */

class AbyssusApp {
  constructor() {
    this.initialized = false;
  }

  async init() {
    console.log('🌙 Initialization d\'Abyssus avec Firebase...');
    
    // Wait for auth state
    await this.waitForAuth();
    
    // Update UI with current player data
    uiManager.updatePlayerStatus();
    uiManager.updateDomainCards();

    // Setup auth button
    this.setupAuthButton();
    
    // Load community posts
    if (communitySystem) {
      await communitySystem.loadCommunityPosts();
    }
    
    this.initialized = true;
    console.log('✅ Abyssus initialized');
  }

  waitForAuth() {
    return new Promise((resolve) => {
      if (cloudDataManager) {
        resolve();
      } else {
        setTimeout(() => resolve(), 100);
      }
    });
  }

  setupAuthButton() {
    const authBtn = document.getElementById('authBtn');
    const createPostBtn = document.getElementById('createPostBtn');
    
    if (!authBtn) return;

    if (cloudDataManager.currentUser) {
      authBtn.textContent = 'Déconnexion';
      authBtn.onclick = async () => {
        await cloudDataManager.logout();
        location.reload();
      };
      createPostBtn.style.display = 'block';
      createPostBtn.onclick = () => this.createCommunityPost();
    } else {
      authBtn.textContent = 'Se Connecter';
      authBtn.onclick = () => authUI.showAuthModal();
      createPostBtn.style.display = 'none';
    }
  }

  // Create post from UI
  async createCommunityPost() {
    if (!cloudDataManager.currentUser) {
      authUI.showAuthModal();
      return;
    }
    communitySystem.showPostForm();
  }

  // Add XP with cloud save
  async addXPCloud(amount, domain = null) {
    if (cloudDataManager.currentUser) {
      const result = await cloudDataManager.addXPToPlayer(
        cloudDataManager.currentUser.uid,
        amount,
        domain
      );
      if (result.success) {
        eventsSystem.playerXPGain(amount, domain);
      }
    }
  }

  // Export/Import with cloud
  async exportDataCloud() {
    if (!cloudDataManager.currentUser) {
      alert('Connecte-toi pour exporter');
      return;
    }
    
    const data = cloudDataManager.playerProfile;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abyssus-${data.username}.json`;
    a.click();
  }

  resetData() {
    if (confirm('⚠️ Êtes-vous sûr? Cela réinitialisera toutes vos données.')) {
      dataManager.clearAllData();
      location.reload();
    }
  }
}

const app = new AbyssusApp();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  app.init();
}

// Expose to window for debugging
window.abyssus = {
  app,
  player,
  dataManager,
  cloudDataManager,
  domainsManager,
  uiManager,
  eventsSystem,
  communitySystem,
  authUI,
  addXP: (amount, domain) => app.addXPCloud(amount, domain),
  createPost: () => app.createCommunityPost(),
  export: () => app.exportDataCloud(),
  reset: () => app.resetData()
};

console.log('💎 Bienvenue dans Abyssus! Tape "abyssus" dans la console pour voir les commandes.');