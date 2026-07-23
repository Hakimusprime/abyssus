/**
 * ABYSSUS — Systems Engine (Boss & Événements)
 * Emplacement : /systems/engines.js
 */

const AbyssusBossEngine = {
  bosses: [
    { id: 'boss_monolith', name: 'Le Monolithe d\'Ombre', rewardTitle: 'Dompteur du Néant' },
    { id: 'boss_archivist', name: 'L\'Archiviste Maudit', rewardTitle: 'Maître des Savoirs Interdits' }
  ],

  getBossById(id) {
    return this.bosses.find(b => b.id === id);
  },

  openBossModal() {
    if (typeof notify === 'function') {
      notify("Combat engagé contre Le Monolithe d'Ombre !");
    } else {
      alert("Combat contre le Boss initialisé.");
    }
  }
};

const AbyssusEventEngine = {
  activeEvents: [
    { id: 'evt_1', title: 'Éclipse de Volonté', description: 'Alignement astral : la validation par cœur apporte une attention doublée.' }
  ],

  getActiveEvents() {
    return this.activeEvents;
  }
};
