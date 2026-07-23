"use strict";

/**
 * ABYSSUS — Anti-Cheat System
 * Emplacement : /systems/anti-cheat.js
 * 
 * Détecte les comportements anormaux (réponses trop rapides, spam, etc.)
 */

const AbyssusAntiCheat = (() => {
  let lastActionTimestamp = 0;
  let suspiciousCount = 0;
  
  // Paramètres de tolérance
  const MIN_TIME_BETWEEN_ACTIONS = 800; // en millisecondes (0.8s)
  const MAX_SUSPICIOUS_TOLERANCE = 5;   // nombre de fautes avant alerte

  function onQuestionOpened(context = 'quiz') {
    lastActionTimestamp = Date.now();
  }

  function validateQuizAnswer() {
    const now = Date.now();
    const elapsedTime = now - lastActionTimestamp;

    // Vérification de vitesse surhumaine (réponse en moins de 0.8 seconde)
    if (elapsedTime < MIN_TIME_BETWEEN_ACTIONS && lastActionTimestamp !== 0) {
      suspiciousCount++;
      console.warn(`[Anti-Cheat] Action suspecte détectée (Temps de réponse : ${elapsedTime}ms).`);
      
      if (suspiciousCount >= MAX_SUSPICIOUS_TOLERANCE) {
        return {
          allowed: false,
          reason: "Sécurité Abysse : Validation bloquée (rythme d'exécution anormalement rapide)."
        };
      }
    }

    lastActionTimestamp = now;
    return { allowed: true };
  }

  function onCorrectAnswer() {
    // Réduction progressive du compteur de suspicion en cas de bonne réponse légitime
    if (suspiciousCount > 0) suspiciousCount--;
  }

  function onWrongAnswer() {
    // Une mauvaise réponse réinitialise partiellement la suspicion
    lastActionTimestamp = Date.now();
  }

  return {
    onQuestionOpened,
    validateQuizAnswer,
    onCorrectAnswer,
    onWrongAnswer,
    getSuspiciousCount: () => suspiciousCount
  };
})();
