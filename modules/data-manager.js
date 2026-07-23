/**
 * Abyssus - Data Manager
 * Handles all data persistence and retrieval
 */

class DataManager {
  constructor() {
    this.playerData = this.loadPlayerData();
    this.gameState = this.loadGameState();
    this.inventory = this.loadInventory();
    this.achievements = this.loadAchievements();
    this.communityPosts = this.loadCommunityPosts();
  }

  // Player Data
  loadPlayerData() {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    if (saved) return JSON.parse(saved);
    
    return {
      id: this.generatePlayerId(),
      name: `Explorateur-${Math.floor(Math.random() * 9999)}`,
      level: GAME_CONFIG.INITIAL_LEVEL,
      xp: GAME_CONFIG.INITIAL_XP,
      hp: GAME_CONFIG.INITIAL_HP,
      maxHP: GAME_CONFIG.HP_MAX,
      domainXP: {},
      domainLevels: {},
      titles: [],
      badges: [],
      createdAt: new Date().toISOString()
    };
  }

  savePlayerData() {
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(this.playerData));
  }

  // Game State
  loadGameState() {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (saved) return JSON.parse(saved);
    
    return {
      currentDomain: null,
      questsCompleted: 0,
      questsStarted: 0,
      bossesDefeated: [],
      eventsParticipated: [],
      lastActive: new Date().toISOString()
    };
  }

  saveGameState() {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(this.gameState));
  }

  // Inventory
  loadInventory() {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) return JSON.parse(saved);
    
    return {
      relics: [],
      consumables: [],
      capacity: 20
    };
  }

  saveInventory() {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(this.inventory));
  }

  // Achievements
  loadAchievements() {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (saved) return JSON.parse(saved);
    
    return {
      unlocked: [],
      progress: {}
    };
  }

  saveAchievements() {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(this.achievements));
  }

  // Community Posts
  loadCommunityPosts() {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (saved) return JSON.parse(saved);
    return [];
  }

  saveCommunityPosts() {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(this.communityPosts));
  }

  // Utility Methods
  generatePlayerId() {
    return 'PLAYER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  saveAllData() {
    this.savePlayerData();
    this.saveGameState();
    this.saveInventory();
    this.saveAchievements();
    this.saveCommunityPosts();
  }

  clearAllData() {
    localStorage.clear();
    this.playerData = this.loadPlayerData();
    this.gameState = this.loadGameState();
    this.inventory = this.loadInventory();
    this.achievements = this.loadAchievements();
    this.communityPosts = this.loadCommunityPosts();
  }

  exportData() {
    return {
      playerData: this.playerData,
      gameState: this.gameState,
      inventory: this.inventory,
      achievements: this.achievements,
      communityPosts: this.communityPosts,
      exportDate: new Date().toISOString()
    };
  }

  importData(data) {
    this.playerData = data.playerData || this.playerData;
    this.gameState = data.gameState || this.gameState;
    this.inventory = data.inventory || this.inventory;
    this.achievements = data.achievements || this.achievements;
    this.communityPosts = data.communityPosts || this.communityPosts;
    this.saveAllData();
  }
}

const dataManager = new DataManager();