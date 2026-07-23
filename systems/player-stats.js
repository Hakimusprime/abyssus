"use strict";

/**
 * Abyssus Player Stats — Statistiques détaillées et historique des parties
 *
 * S'appuie sur le document Firestore utilisateur existant sans le casser.
 * Ajoute des données statistiques sous le champ `stats` du document user.
 * Toutes les stats sont optionnelles et rétrocompatibles.
 *
 * Hookée sur les événements AbyssusEvents pour se mettre à jour automatiquement.
 */
const AbyssusPlayerStats = (() => {
  // Métriques suivies
  const METRICS = {
    totalQuizAttempted: 0,        // Quiz tentés
    totalQuizCorrect: 0,          // Quiz réussis
    totalQuizWrong: 0,            // Quiz ratés
    totalReflections: 0,          // Réflexions partagées
    totalFavorites: 0,            // Favoris utilisés
    longestStreak: 0,             // Plus longue série de bonnes réponses
    currentStreak: 0,             // Série en cours
    dailyQuizDone: 0,             // Quiz faits aujourd'hui
    dailyReflectionDone: 0,       // Réflexions aujourd'hui
    lastActiveDate: null,         // Dernière date d'activité
    sessionCount: 0,              // Nombre de sessions
  };

  let cachedStats = {};
  let initialized = false;
  let lastSave = 0;
  const SAVE_THROTTLE = 2000; // Sauvegarde maximum toutes les 2 secondes

  /**
   * Initialise ou récupère les stats depuis le document Firestore
   */
  function getStats(userData) {
    if (!userData) return { ...METRICS };
    const stats = userData.stats || {};
    return { ...METRICS, ...stats };
  }

  /**
   * Met à jour localement et persiste dans Firestore (throttled)
   */
  async function updateStats(updates) {
    if (!window.currentUid || !window.userData) return;

    const now = Date.now();
    cachedStats = { ...cachedStats, ...updates };
    cachedStats.lastActiveDate = new Date().toISOString();

    // Throttle pour éviter trop d'écritures Firestore
    if (now - lastSave < SAVE_THROTTLE) return;
    lastSave = now;

    try {
      const db = firebase.firestore();
      const ref = db.collection('users').doc(window.currentUid);

      // Mise à jour incrémentale via Firestore — ne touche que le champ `stats`
      const firestoreUpdates = {};
      for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'number') {
          firestoreUpdates[`stats.${key}`] = firebase.firestore.FieldValue.increment(value);
        } else {
          firestoreUpdates[`stats.${key}`] = value;
        }
      }

      // S'assurer que l'objet stats existe
      await ref.set({ stats: {} }, { merge: true });
      await ref.update(firestoreUpdates);
    } catch (e) {
      console.warn('[AbyssusPlayerStats] Erreur de sauvegarde:', e.message);
    }
  }

  /**
   * Calcule et retourne des statistiques dérivées
   */
  function computeDerivedStats(stats) {
    const total = stats.totalQuizAttempted || 1;
    const accuracy = Math.round(((stats.totalQuizCorrect || 0) / total) * 100);

    return {
      accuracy,                      // Précision en %
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
   * Génère un rapport complet pour affichage (profil / tableau de bord)
   */
  function buildReport(userData) {
    const stats = getStats(userData);
    const derived = computeDerivedStats(stats);
    const domainXP = userData.domainXP || {};

    return {
      ...derived,
      domains: Object.keys(domainXP).length,
      topDomain: Object.entries(domainXP).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun',
      xp: userData.xp || 0,
      rank: userData.xp ? (() => {
        const RANKS = [
          { name: "F", threshold: 0 }, { name: "E", threshold: 100 },
          { name: "D", threshold: 250 }, { name: "C", threshold: 500 },
          { name: "B", threshold: 900 }, { name: "A", threshold: 1500 },
          { name: "S", threshold: 2400 }, { name: "SS", threshold: 3600 },
          { name: "SSS", threshold: 5200 }, { name: "Abyss", threshold: 7200 }
        ];
        const xp = userData.xp || 0;
        let idx = 0;
        for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].threshold) idx = i; }
        return RANKS[idx].name;
      })() : 'F',
      progress: userData.xp || 0,
      totalReflections: Object.keys(userData.reflections || {}).length,
      totalFavorites: (userData.favorites || []).length,
    };
  }

  /**
   * Enrichit le DOM avec le panneau de statistiques (à insérer où besoin)
   */
  function renderStatsPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !window.userData) return;

    const report = buildReport(window.userData);

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${report.accuracy}%</span>
          <span class="stat-label">Précision</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.quizzesDone}</span>
          <span class="stat-label">Quiz tentés</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.reflectionsWritten}</span>
          <span class="stat-label">Réflexions</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.currentStreak}</span>
          <span class="stat-label">Série actuelle</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">🔥 ${report.longestStreak}</span>
          <span class="stat-label">Meilleure série</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.domains}</span>
          <span class="stat-label">Domaines explorés</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.topDomain}</span>
          <span class="stat-label">Domaine principal</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${report.sessionCount}</span>
          <span class="stat-label">Sessions</span>
        </div>
      </div>
    `;
  }

  /**
   * Hook à appeler après une réponse de quiz
   */
  function onQuizAnswered(isCorrect, wasFirstAttempt) {
    if (!wasFirstAttempt) return; // Ne compte que la première tentative

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastActive = cachedStats.lastActiveDate?.slice(0, 10);

    const updates = { totalQuizAttempted: 1 };

    if (isCorrect) {
      updates.totalQuizCorrect = 1;
      updates.currentStreak = (cachedStats.currentStreak || 0) + 1;
      updates.longestStreak = Math.max(updates.currentStreak, cachedStats.longestStreak || 0);
    } else {
      updates.totalQuizWrong = 1;
      updates.currentStreak = -(cachedStats.currentStreak || 0) + 1; // Série négative = reset
    }

    // Compteur quotidien
    if (lastActive !== today) {
      updates.dailyQuizDone = 1;
      if (lastActive !== today) {
        updates.sessionCount = 1;
      }
    } else {
      updates.dailyQuizDone = 1; // Incremental — Firestore additionne
    }

    updateStats(updates);
  }

  /**
   * Hook après une réflexion partagée
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
   * Chemise les stats au démarrage avec les données Firestore
   */
  function init(userData) {
    if (initialized) return;
    cachedStats = getStats(userData);
    initialized = true;

    // Écouter les événements du système
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.on(AbyssusEvents.EVENTS.QUIZ_ANSWER, (data) => {
        onQuizAnswered(data.correct, data.firstAttempt);
      });
      AbyssusEvents.on(AbyssusEvents.EVENTS.REFLECTION_SAVED, () => {
        onReflectionSaved();
      });
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
