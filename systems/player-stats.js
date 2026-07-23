"use strict";

/**
 * ABYSSUS — Player Stats System
 * Emplacement : /systems/player-stats.js
 * 
 * Gère les statistiques de l'explorateur de manière hybride (LocalStorage / Firestore)
 */

const AbyssusPlayerStats = (() => {
  // Métriques suivies
  const METRICS = {
    totalQuizAttempted: 0,        
    totalQuizCorrect: 0,          
    totalQuizWrong: 0,            
    totalReflections: 0,          
    totalFavorites: 0,            
    longestStreak: 0,             
    currentStreak: 0,             
    dailyQuizDone: 0,             
    dailyReflectionDone: 0,       
    lastActiveDate: null,         
    sessionCount: 1,              
  };

  let cachedStats = {};
  let initialized = false;
  let lastSave = 0;
  const SAVE_THROTTLE = 2000; // Anti-spam de sauvegarde (2 secondes)

  /**
   * Récupère les stats depuis l'objet utilisateur (userData global ou Firestore)
   */
  function getStats(userSource) {
    const data = userSource || (typeof userData !== 'undefined' ? userData : {});
    const stats = data.stats || {};
    return { ...METRICS, ...stats };
  }

  /**
   * Met à jour localement (et dans Firestore si disponible, ou LocalStorage)
   */
  async function updateStats(updates) {
    const now = Date.now();
    
    // Mettre à jour le cache local des stats
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'number' && typeof cachedStats[key] === 'number') {
        cachedStats[key] += value;
      } else {
        cachedStats[key] = value;
      }
    }
    cachedStats.lastActiveDate = new Date().toISOString();

    // Synchronisation avec le `userData` global du script.js si présent
    if (typeof userData !== 'undefined') {
      if (!userData.stats) userData.stats = {};
      userData.stats = { ...userData.stats, ...cachedStats };
      
      // Sauvegarde locale automatique si la fonction existe
      if (typeof saveUserData === 'function') {
        saveUserData();
      }
    }

    // Throttle pour éviter trop d'écritures
    if (now - lastSave < SAVE_THROTTLE) return;
    lastSave = now;

    // Persistance Firestore si connecté
    if (typeof firebase !== 'undefined' && window.currentUid) {
      try {
        const db = firebase.firestore();
        const ref = db.collection('users').doc(window.currentUid);

        const firestoreUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
          if (typeof value === 'number') {
            firestoreUpdates[`stats.${key}`] = firebase.firestore.FieldValue.increment(value);
          } else {
            firestoreUpdates[`stats.${key}`] = value;
          }
        }

        await ref.set({ stats: {} }, { merge: true });
        await ref.update(firestoreUpdates);
      } catch (e) {
        console.warn('[AbyssusPlayerStats] Erreur de sauvegarde Firestore:', e.message);
      }
    }
  }

  /**
   * Calcule les statistiques dérivées
   */
  function computeDerivedStats(stats) {
    const total = stats.totalQuizAttempted || 0;
    const accuracy = total > 0 ? Math.round(((stats.totalQuizCorrect || 0) / total) * 100) : 0;

    return {
      accuracy,                      
      reflectionsWritten: stats.totalReflections || 0,
      quizzesDone: stats.totalQuizAttempted || 0,
      quizzesCorrect: stats.totalQuizCorrect || 0,
      quizzesWrong: stats.totalQuizWrong || 0,
      currentStreak: stats.currentStreak || 0,
      longestStreak: stats.longestStreak || 0,
      sessionCount: stats.sessionCount || 1,
    };
  }

  /**
   * Génère un rapport complet pour affichage
   */
  function buildReport(userSource) {
    const data = userSource || (typeof userData !== 'undefined' ? userData : {});
    const stats = getStats(data);
    const derived = computeDerivedStats(stats);
    const domainXP = data.domainXP || {};

    // Calcul du rang selon l'XP global
    const xp = data.xp || (typeof userData !== 'undefined' ? userData.xp : 0) || 0;
    const rank = (() => {
      const RANKS = [
        { name: "F", threshold: 0 }, { name: "E", threshold: 100 },
        { name: "D", threshold: 250 }, { name: "C", threshold: 500 },
        { name: "B", threshold: 900 }, { name: "A", threshold: 1500 },
        { name: "S", threshold: 2400 }, { name: "SS", threshold: 3600 },
        { name: "SSS", threshold: 5200 }, { name: "Abyss", threshold: 7200 }
      ];
      let idx = 0;
      for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].threshold) idx = i; }
      return RANKS[idx].name;
    })();

    return {
      ...derived,
      domains: Object.keys(domainXP).length,
      topDomain: Object.entries(domainXP).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Général',
      xp: xp,
      rank: rank,
      totalReflections: data.reflectionData ? Object.keys(data.reflectionData).length : 0,
      totalFavorites: (data.favorites || []).length,
    };
  }

  /**
   * Injecte le panneau de statistiques dans l'interface
   */
  function renderStatsPanel(containerId) {
    const container = document.getElementById(containerId);
    const currentData = typeof userData !== 'undefined' ? userData : null;
    if (!container || !currentData) return;

    const report = buildReport(currentData);

    container.innerHTML = `
      <div class="stats-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-family: var(--font-mono, monospace);">
        <div class="catalog-card" style="padding: 1rem; text-align: center;">
          <span class="stat-value" style="font-size: 1.5rem; font-weight:bold; color:var(--text-main);">${report.accuracy}%</span>
          <span class="stat-label" style="display:block; font-size:0.75rem; color:var(--text-dim);">PRÉCISION</span>
        </div>
        <div class="catalog-card" style="padding: 1rem; text-align: center;">
          <span class="stat-value" style="font-size: 1.5rem; font-weight:bold; color:var(--text-main);">${report.quizzesDone}</span>
          <span class="stat-label" style="display:block; font-size:0.75rem; color:var(--text-dim);">QUIZ TENTÉS</span>
        </div>
        <div class="catalog-card" style="padding: 1rem; text-align: center;">
          <span class="stat-value" style="font-size: 1.5rem; font-weight:bold; color:var(--text-main);">${report.reflectionsWritten}</span>
          <span class="stat-label" style="display:block; font-size:0.75rem; color:var(--text-dim);">RÉFLEXIONS</span>
        </div>
        <div class="catalog-card" style="padding: 1rem; text-align: center;">
          <span class="stat-value" style="font-size: 1.5rem; font-weight:bold; color:var(--text-main);">🔥 ${report.longestStreak}</span>
          <span class="stat-label" style="display:block; font-size:0.75rem; color:var(--text-dim);">MEILLEURE SÉRIE</span>
        </div>
      </div>
    `;
  }

  /**
   * Enregistre le résultat d'un quiz
   */
  function onQuizAnswered(isCorrect, wasFirstAttempt = true) {
    if (!wasFirstAttempt) return; 

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastActive = cachedStats.lastActiveDate?.slice(0, 10);

    const updates = { totalQuizAttempted: 1 };

    if (isCorrect) {
      updates.totalQuizCorrect = 1;
      const current = (cachedStats.currentStreak || 0) + 1;
      updates.currentStreak = current;
      updates.longestStreak = Math.max(current, cachedStats.longestStreak || 0);
    } else {
      updates.totalQuizWrong = 1;
      updates.currentStreak = 0; // Reset propre de la série en cas d'erreur
    }

    if (lastActive !== today) {
      updates.dailyQuizDone = 1;
      updates.sessionCount = (cachedStats.sessionCount || 0) + 1;
    } else {
      updates.dailyQuizDone = 1;
    }

    updateStats(updates);
  }

  /**
   * Enregistre l'action d'une réflexion validée/sauvegardée
   */
  function onReflectionSaved() {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastActive = cachedStats.lastActiveDate?.slice(0, 10);

    const updates = { totalReflections: 1 };
    if (lastActive !== today) {
      updates.dailyReflectionDone = 1;
    } else {
      updates.dailyReflectionDone = 1;
    }

    updateStats(updates);
  }

  /**
   * Initialisation du système de stats
   */
  function init(userSource) {
    if (initialized) return;
    cachedStats = getStats(userSource);
    initialized = true;

    // Connexion aux événements système Abyssus si disponibles
    if (typeof AbyssusEvents !== 'undefined') {
      try {
        AbyssusEvents.on(AbyssusEvents.EVENTS.QUIZ_ANSWER, (data) => {
          onQuizAnswered(data.correct, data.firstAttempt);
        });
        AbyssusEvents.on(AbyssusEvents.EVENTS.REFLECTION_SAVED, () => {
          onReflectionSaved();
        });
      } catch (e) {
        console.warn('[AbyssusPlayerStats] Événements non liés:', e);
      }
    }
  }

  return {
    init,
    getStats,
    updateStats,
    buildReport,
    renderStatsPanel,
    onQuizAnswered,
    onReflectionSaved,
  };
})();
