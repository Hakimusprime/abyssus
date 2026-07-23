/**
 * Abyssus - Main Application
 * Entry point and initialization
 */

class AbyssusApp {
  constructor() {
    this.initialized = false;
  }

  init() {
    console.log('🌙 Initialization d\'Abyssus...');
    
    // Update UI with current player data
    uiManager.updatePlayerStatus();
    uiManager.updateDomainCards();
    
    this.initialized = true;
    console.log('✅ Abyssus initialized');
    console.log('Joueur:', dataManager.playerData.name);
    console.log('Niveau:', player.getLevel());
  }

  // Simulate XP gain for testing
  addTestXP() {
    const result = player.addXP(50, 'philosophy');
    if (result.levelUp) {
      eventsSystem.playerLevelUp(result.newLevel);
    } else {
      eventsSystem.playerXPGain(50, 'philosophy');
    }
  }

  // Export player data
  exportData() {
    const data = dataManager.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abyssus-save-${new Date().toISOString()}.json`;
    a.click();
  }

  // Reset all data
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
  domainsManager,
  uiManager,
  eventsSystem,
  addXP: () => app.addTestXP(),
  export: () => app.exportData(),
  reset: () => app.resetData()
};

console.log('💜 Bienvenue dans Abyssus! Tape "abyssus" dans la console pour voir les commandes.');