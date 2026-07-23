/**
 * Abyssus - Player System
 * Handles player progression, levels, XP, and stats
 */

class Player {
  constructor(playerData) {
    this.data = playerData;
  }

  // XP and Leveling
  addXP(amount, domain = null) {
    const oldLevel = this.getLevel();
    this.data.xp += amount;

    if (domain) {
      this.data.domainXP[domain] = (this.data.domainXP[domain] || 0) + amount;
    }

    const newLevel = this.getLevel();
    if (newLevel > oldLevel) {
      this.onLevelUp(newLevel);
    }

    dataManager.savePlayerData();
    return { levelUp: newLevel > oldLevel, newLevel };
  }

  getLevel() {
    return Math.floor(this.data.xp / GAME_CONFIG.XP_PER_LEVEL) + GAME_CONFIG.INITIAL_LEVEL;
  }

  getXPForNextLevel() {
    const currentLevelXP = (this.getLevel() - GAME_CONFIG.INITIAL_LEVEL) * GAME_CONFIG.XP_PER_LEVEL;
    const nextLevelXP = currentLevelXP + GAME_CONFIG.XP_PER_LEVEL;
    return {
      current: this.data.xp - currentLevelXP,
      next: GAME_CONFIG.XP_PER_LEVEL,
      percent: ((this.data.xp - currentLevelXP) / GAME_CONFIG.XP_PER_LEVEL) * 100
    };
  }

  onLevelUp(newLevel) {
    // Heal 10 HP on level up
    this.data.hp = Math.min(this.data.hp + 10, this.data.maxHP);
  }

  // Health System
  takeDamage(amount) {
    this.data.hp = Math.max(0, this.data.hp - amount);
    dataManager.savePlayerData();
    return this.data.hp;
  }

  heal(amount) {
    this.data.hp = Math.min(this.data.maxHP, this.data.hp + amount);
    dataManager.savePlayerData();
    return this.data.hp;
  }

  // Domain Progression
  getDomainLevel(domainId) {
    const domainXP = this.data.domainXP[domainId] || 0;
    return Math.floor(domainXP / GAME_CONFIG.XP_PER_LEVEL) + 1;
  }

  getDomainTitle(domainId) {
    const domainXP = this.data.domainXP[domainId] || 0;
    const thresholds = GAME_CONFIG.TITLE_THRESHOLDS;
    
    if (domainXP >= thresholds.legend) return 'Légende';
    if (domainXP >= thresholds.master) return 'Maître';
    if (domainXP >= thresholds.adept) return 'Adepte';
    if (domainXP >= thresholds.initiate) return 'Initié';
    return 'Apprenti';
  }

  // Stats Summary
  getStats() {
    return {
      level: this.getLevel(),
      xp: this.data.xp,
      hp: this.data.hp,
      maxHP: this.data.maxHP,
      nextLevel: this.getXPForNextLevel(),
      domainCount: Object.keys(this.data.domainXP).length,
      titleCount: this.data.titles.length,
      badgeCount: this.data.badges.length
    };
  }
}

const player = new Player(dataManager.playerData);