/**
 * Abyssus - Events System
 * Centralized event handling for game actions
 */

class EventsSystem {
  constructor() {
    this.listeners = {};
  }

  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    }
  }

  emit(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => {
        callback(data);
      });
    }
  }

  // Game Events
  playerLevelUp(newLevel) {
    this.emit('player:levelup', { level: newLevel });
  }

  playerXPGain(amount, domain) {
    this.emit('player:xp', { amount, domain });
  }

  questionAnswered(questionId, correct) {
    this.emit('question:answered', { questionId, correct });
  }

  domainSelected(domainId) {
    this.emit('domain:selected', { domainId });
  }

  bossDefeated(bossId) {
    this.emit('boss:defeated', { bossId });
  }

  relicObtained(relic) {
    this.emit('relic:obtained', { relic });
  }

  achievementUnlocked(achievementId) {
    this.emit('achievement:unlocked', { achievementId });
  }
}

const eventsSystem = new EventsSystem();

// Event Listeners
eventsSystem.on('player:levelup', (data) => {
  console.log(`✨ Niveau ${data.level} atteint!`);
  uiManager.updatePlayerStatus();
});

eventsSystem.on('player:xp', (data) => {
  console.log(`+${data.amount} XP ${data.domain ? `en ${data.domain}` : ''}`);
  uiManager.updatePlayerStatus();
  uiManager.updateDomainCards();
});