/**
 * Abyssus - Domains System
 * Manages domains, categories, and area exploration
 */

class DomainsManager {
  constructor() {
    this.domains = GAME_CONFIG.DOMAINS;
    this.selectedDomain = null;
  }

  getDomain(domainId) {
    return this.domains.find(d => d.id === domainId);
  }

  getAllDomains() {
    return this.domains;
  }

  getDomainProgress(domainId) {
    const domainXP = dataManager.playerData.domainXP[domainId] || 0;
    const level = player.getDomainLevel(domainId);
    const title = player.getDomainTitle(domainId);
    const progressPercent = (domainXP % GAME_CONFIG.XP_PER_LEVEL) / GAME_CONFIG.XP_PER_LEVEL * 100;

    return {
      domainId,
      level,
      title,
      xp: domainXP,
      progressPercent
    };
  }

  selectDomain(domainId) {
    this.selectedDomain = domainId;
    dataManager.gameState.currentDomain = domainId;
    dataManager.saveGameState();
  }

  getExploredDomains() {
    return Object.keys(dataManager.playerData.domainXP).length;
  }
}

const domainsManager = new DomainsManager();