"use strict";

/**
 * Abyssus Event Bus — Communication inter-modules
 * Permet aux modules de communiquer sans couplage direct.
 * Les modules existants (`script.js`) peuvent envoyer et écouter des événements.
 */
const AbyssusEvents = (() => {
  const listeners = {};

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    // Retourne une fonction pour se désabonner
    return () => {
      listeners[event] = listeners[event].filter(fn => fn !== callback);
    };
  }

  function emit(event, data) {
    const fns = listeners[event] || [];
    for (const fn of fns) {
      try { fn(data); } catch (e) { console.error(`[AbyssusEvents] Error in handler for "${event}":`, e); }
    }
  }

  function once(event, callback) {
    const unsub = on(event, (...args) => {
      unsub();
      callback(...args);
    });
    return unsub;
  }

  // Événements standards du système
  const EVENTS = {
    USER_READY: 'user:ready',           // Données utilisateur chargées
    XP_GAINED: 'xp:gained',             // XP gagné
    RANK_UP: 'rank:up',                 // Montée de rang
    HP_CHANGED: 'hp:changed',           // HP modifiés
    BOSS_START: 'boss:start',           // Combat de Boss commencé
    BOSS_END: 'boss:end',               // Combat de Boss terminé
    EVENT_TRIGGER: 'event:trigger',     // Événement déclenché
    QUIZ_ANSWER: 'quiz:answer',         // Réponse à un quiz
    REFLECTION_SAVED: 'reflection:saved', // Réflexion partagée
    ANOMALY_DETECTED: 'anomaly:detected', // Anomalie détectée (anti-triche)
    TOURNAMENT_START: 'tournament:start',
    TOURNAMENT_END: 'tournament:end',
  };

  return { on, emit, once, EVENTS };
})();
