"use strict";

/**
 * Abyssus Anti-Cheat — Système anti-triche modulaire
 *
 * Détecte et prévient :
 * - Réponses trop rapides
 * - Anomalies de comportement
 * - Actions suspectes répétées
 *
 * Tient un journal des sanctions.
 * Émet des événements sur AbyssusEvents.
 */
const AbyssusAntiCheat = (() => {
  // Configuration des seuils (ajustables)
  const CONFIG = {
    MIN_RESPONSE_TIME: 2000,      // 2 secondes minimum pour lire la question
    MIN_QUIZ_TIME: 3000,          // 3 secondes minimum pour répondre à un quiz
    MAX_RAPID_FIRE: 5,            // 5 actions max dans la fenêtre
    RAPID_FIRE_WINDOW: 10000,     // Fenêtre de 10 secondes
    MAX_CONSECUTIVE_FAIL: 8,      // 8 échecs consécutifs avant alerte
    ANOMALY_BAN_THRESHOLD: 3,     // 3 anomalies = suspension temporaire
    BAN_DURATION_MS: 30 * 60 * 1000, // 30 minutes de suspension
  };

  // État interne
  let state = {
    actions: [],                  // Timestamps des actions récentes
    questionOpenTime: null,       // Quand la question a été ouverte
    lastQuizTime: null,           // Dernière réponse quiz
    consecutiveFailures: 0,       // Échecs consécutifs
    anomalyCount: 0,              // Compte d'anomalies dans la session
    bannedUntil: null,            // Timestamp de fin de ban
    actionLog: [],                // Historique complet des actions suspectes
    warningCount: 0,              // Avertissements dans la session
  };

  /**
   * Vérifie si l'utilisateur est actuellement suspendu
   */
  function isBanned() {
    if (!state.bannedUntil) return false;
    if (Date.now() < state.bannedUntil) return true;
    state.bannedUntil = null;
    return false;
  }

  /**
   * Vérifie que l'utilisateur n'est pas banni avant une action critique
   */
  function checkBan() {
    if (isBanned()) {
      const remaining = Math.ceil((state.bannedUntil - Date.now()) / 1000 / 60);
      throw new Error(`Action suspendue. Réessaie dans ${remaining} min.`);
    }
  }

  /**
   * Enregistre une ouverture de question (quiz ou réflexion)
   */
  function onQuestionOpened(type) {
    try { checkBan(); } catch (e) { return { allowed: false, reason: e.message }; }

    state.questionOpenTime = Date.now();
    recordAction('question_opened', { type });
    return { allowed: true };
  }

  /**
   * Valide une réponse de quiz avant de l'autoriser
   */
  function validateQuizAnswer() {
    try { checkBan(); } catch (e) { return { allowed: false, reason: e.message }; }

    const now = Date.now();

    // Temps minimum depuis l'ouverture de la question
    if (state.questionOpenTime && (now - state.questionOpenTime) < CONFIG.MIN_QUIZ_TIME) {
      return recordAnomaly('Réponse trop rapide au quiz', {
        elapsed: now - state.questionOpenTime,
        threshold: CONFIG.MIN_QUIZ_TIME
      });
    }

    // Temps minimum depuis la dernière réponse au même quiz
    if (state.lastQuizTime && (now - state.lastQuizTime) < CONFIG.MIN_RESPONSE_TIME) {
      return recordAnomaly('Clic répété trop rapide', {
        elapsed: now - state.lastQuizTime,
        threshold: CONFIG.MIN_RESPONSE_TIME
      });
    }

    // Vérification de rapid-fire (trop d'actions dans le temps imparti)
    const recentActions = state.actions.filter(t => now - t < CONFIG.RAPID_FIRE_WINDOW);
    if (recentActions.length >= CONFIG.RAPID_FIRE_MAX) {
      return recordAnomaly('Rapid-fire détecté', {
        count: recentActions.length,
        window: CONFIG.RAPID_FIRE_WINDOW
      });
    }

    state.lastQuizTime = now;
    recordAction('quiz_answered');
    return { allowed: true };
  }

  /**
   * Enregistre une soumission de réflexion
   */
  function validateReflectionSubmission() {
    try { checkBan(); } catch (e) { return { allowed: false, reason: e.message }; }

    const now = Date.now();

    if (state.questionOpenTime && (now - state.questionOpenTime) < CONFIG.MIN_RESPONSE_TIME) {
      return recordAnomaly('Réflexion soumise trop rapidement', {
        elapsed: now - state.questionOpenTime
      });
    }

    recordAction('reflection_submitted');
    return { allowed: true };
  }

  /**
   * Appelé après une bonne réponse
   */
  function onCorrectAnswer() {
    state.consecutiveFailures = 0;
  }

  /**
   * Appelé après une mauvaise réponse
   */
  function onWrongAnswer() {
    state.consecutiveFailures++;

    if (state.consecutiveFailures >= CONFIG.MAX_CONSECUTIVE_FAIL) {
      const result = recordAnomaly('Échecs consécutifs suspects', {
        count: state.consecutiveFailures,
        threshold: CONFIG.MAX_CONSECUTIVE_FAIL
      });
      state.consecutiveFailures = 0; // Reset après l'alerte
      return result;
    }

    return { allowed: true };
  }

  /**
   * Enregistre une anomalie et applique des sanctions si nécessaire
   */
  function recordAnomaly(reason, details = {}) {
    state.anomalyCount++;
    state.warningCount++;

    const entry = {
      timestamp: Date.now(),
      reason,
      details,
      anomalyCount: state.anomalyCount,
    };
    state.actionLog.push(entry);

    // Émettre l'événement pour que d'autres modules réagissent
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.ANOMALY_DETECTED, entry);
    }

    console.warn('[AbyssusAntiCheat] Anomalie:', reason, details);

    // Seuil de ban
    if (state.anomalyCount >= CONFIG.ANOMALY_BAN_THRESHOLD) {
      state.bannedUntil = Date.now() + CONFIG.BAN_DURATION_MS;
      const banEntry = {
        timestamp: Date.now(),
        reason: 'Suspension temporaire pour anomalies répétées',
        duration: CONFIG.BAN_DURATION_MS,
        anomalyCount: state.anomalyCount,
      };
      state.actionLog.push(banEntry);
      console.warn('[AbyssusAntiCheat] BAN TEMPORAIRE jusqu\'à', new Date(state.bannedUntil).toLocaleTimeString());
      return { allowed: false, reason: `Action suspendue (${CONFIG.BAN_DURATION_MS / 60000} min) pour comportement suspect.` };
    }

    return { allowed: false, reason: `Action suspecte détectée : ${reason}` };
  }

  /**
   * Enregistre une action normale dans l'historique
   */
  function recordAction(type, details = {}) {
    state.actions.push(Date.now());
    // Garde la fenêtre propre
    const cutoff = Date.now() - CONFIG.RAPID_FIRE_WINDOW * 2;
    state.actions = state.actions.filter(t => t > cutoff);

    state.actionLog.push({
      timestamp: Date.now(),
      type,
      details
    });
  }

  /**
   * Récupère l'historique des actions suspectes
   */
  function getActionLog() {
    return state.actionLog.slice();
  }

  /**
   * Récupère les statistiques anti-triche de la session
   */
  function getStats() {
    return {
      actionsToday: state.actions.length,
      anomalyCount: state.anomalyCount,
      warningCount: state.warningCount,
      banned: isBanned(),
      consecutiveFailures: state.consecutiveFailures,
    };
  }

  /**
   * Réinitialise l'état anti-triche (ex: nouvelle session)
   */
  function reset() {
    state = {
      actions: [],
      questionOpenTime: null,
      lastQuizTime: null,
      consecutiveFailures: 0,
      anomalyCount: 0,
      bannedUntil: null,
      actionLog: [],
      warningCount: 0,
    };
  }

  return {
    onQuestionOpened,
    validateQuizAnswer,
    validateReflectionSubmission,
    onCorrectAnswer,
    onWrongAnswer,
    getActionLog,
    getStats,
    isBanned,
    reset,
    CONFIG, // Exposé pour configuration avancée
  };
})();
