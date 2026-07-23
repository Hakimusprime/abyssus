"use strict";

/**
 * Abyssus Boss Engine — Moteur de combat contre les Boss
 *
 * Gère le déroulement des combats : phases, questions, HP, récompenses.
 * S'intègre avec Firestore, AbyssusEvents, et AbyssusAntiCheat.
 * Utilise ABYSSUS_BOSSES (data/bosses.js) et les questions globales.
 */
const AbyssusBossEngine = (() => {
  // ── État du combat ──
  let state = {
    boss: null,             // Le boss actif (objet complet)
    phaseIndex: 0,          // Index de la phase en cours
    phaseHP: 0,             // HP restants de la phase
    questions: [],          // Questions pour la phase en cours [{q, type, domain}]
    questionIndex: 0,       // Index dans le tableau questions
    answered: [],           // [{questionId, correct, time}]
    startedAt: null,        // Timestamp début du combat
    phaseQuestionCount: 0,  // Questions posées dans cette phase
  };

  // ── Configuration ──
  const RANK_MAP = { F: 0, E: 1, D: 2, C: 3, B: 4, A: 5, S: 6, SS: 7, SSS: 8, Abyss: 9 };

  function rankToIndex(rankName) {
    return RANK_MAP[rankName] !== undefined ? RANK_MAP[rankName] : 0;
  }

  // ── Vérifier si un boss peut apparaître ──
  function checkSpawn(userRank, userHP) {
    const eligible = ABYSSUS_BOSSES.filter(boss => {
      const cond = boss.spawnConditions;
      const userRankIdx = rankToIndex(userRank);
      const minIdx = rankToIndex(cond.minRank);
      const maxIdx = rankToIndex(cond.maxRank || "SSS");

      if (userRankIdx < minIdx || userRankIdx > maxIdx) return false;
      if (cond.minHP && userHP < cond.minHP) return false;
      if (cond.requireEvent) {
        // Vérifie si l'événement requis est actif
        if (typeof AbyssusEvents !== 'undefined' && window.AbyssusEventEngine) {
          const events = AbyssusEventEngine.getActiveEvents();
          if (!events.some(e => e.id === cond.requireEvent)) return false;
        }
      }
      return Math.random() < cond.probability;
    });

    return eligible.length > 0
      ? eligible[Math.floor(Math.random() * eligible.length)]
      : null;
  }

  // ── Piocher des questions pour les domaines de la phase ──
  function pickQuestionsForPhase(phase, count) {
    const pool = [];
    const domains = phase.domains || [];

    // Questions de quiz
    if (typeof QUIZ_QUESTIONS !== 'undefined') {
      QUIZ_QUESTIONS.forEach(q => {
        if (domains.length === 0 || domains.includes(q.domain)) {
          pool.push({ q, type: 'quiz' });
        }
      });
    }

    // Questions de réflexion
    if (typeof REFLECTION_QUESTIONS !== 'undefined') {
      REFLECTION_QUESTIONS.forEach(rq => {
        if (domains.length === 0 || domains.includes(rq.category)) {
          pool.push({ q: rq, type: 'reflexion' });
        }
      });
    }

    // Mélanger et prendre le nombre demandé
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count || 3);
  }

  // ── Démarrer un combat ──
  function startBoss(boss) {
    if (state.boss) {
      console.warn('[AbyssusBossEngine] Un combat est déjà en cours.');
      return null;
    }

    state.boss = boss;
    state.phaseIndex = 0;
    state.questionIndex = 0;
    state.answered = [];
    state.startedAt = Date.now();

    // Charger la phase 0
    const phase = boss.phases[0];
    state.phaseHP = phase.hp;
    state.phaseQuestionCount = phase.questionsCount;
    state.questions = pickQuestionsForPhase(phase, phase.questionsCount);

    // Anti-cheat : enregistrer l'ouverture
    if (typeof AbyssusAntiCheat !== 'undefined') {
      AbyssusAntiCheat.onQuestionOpened('boss');
    }

    // Événement système
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.BOSS_START, { boss: boss });
    }

    return buildState();
  }

  // ── Répondre à une question ──
  async function answerQuestion(choiceIndex) {
    if (!state.boss || state.questionIndex >= state.questions.length) {
      return { error: 'Aucune question active.' };
    }

    // Anti-cheat
    if (typeof AbyssusAntiCheat !== 'undefined') {
      const check = AbyssusAntiCheat.validateQuizAnswer();
      if (!check.allowed) {
        return { error: check.reason };
      }
    }

    const current = state.questions[state.questionIndex];
    let correct = false;

    if (current.type === 'quiz') {
      correct = choiceIndex === current.q.correct;
    } else if (current.type === 'reflexion') {
      // Les réflexions sont toujours considérées correctes si soumises
      correct = true;
    }

    // Enregistrer la réponse
    state.answered.push({
      questionId: current.q.id,
      type: current.type,
      correct,
      chosen: choiceIndex,
      time: Date.now() - state.startedAt,
    });

    // Événement quiz answer
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.QUIZ_ANSWER, {
        correct,
        firstAttempt: true,
        boss: state.boss.id,
        phase: state.phaseIndex
      });
    }

    // Anti-cheat: enregistrer le résultat
    if (typeof AbyssusAntiCheat !== 'undefined') {
      if (correct) AbyssusAntiCheat.onCorrectAnswer();
      else AbyssusAntiCheat.onWrongAnswer();
    }

    // Appliquer les effets
    if (!correct) {
      state.phaseHP = Math.max(0, state.phaseHP - 30);
      // Perdre des HP via Firestore
      if (window.currentUid) {
        try {
          const fb = firebase.firestore();
          fb.collection('users').doc(window.currentUid).update({
            hp: firebase.firestore.FieldValue.increment(-10)
          });
        } catch (e) { console.warn('[BossEngine] Erreur HP:', e); }
      }
    }

    // Avancer
    state.questionIndex++;

    // Vérifier si la phase est terminée
    if (state.questionIndex >= state.questions.length || state.phaseHP <= 0) {
      if (state.phaseHP <= 0) {
        // Défaite — phase perdue
        return await endBoss(false);
      }
      // Phase terminée — passer à la suivante si elle existe
      if (state.phaseIndex < state.boss.phases.length - 1) {
        return advancePhase();
      } else {
        // Victoire de toutes les phases
        return await endBoss(true);
      }
    }

    return {
      ...buildState(),
      feedback: { correct, message: correct ? 'Bonne réponse !' : 'Mauvaise réponse...' }
    };
  }

  // ── Avancer à la phase suivante ──
  function advancePhase() {
    state.phaseIndex++;
    const phase = state.boss.phases[state.phaseIndex];
    state.phaseHP = phase.hp;
    state.phaseQuestionCount = phase.questionsCount;
    state.questionIndex = 0;
    state.questions = pickQuestionsForPhase(phase, phase.questionsCount);

    const result = buildState();
    result.transition = true;
    result.dialogue = state.boss.dialogues.phase2;
    return result;
  }

  // ── Terminer le combat ──
  async function endBoss(victory) {
    const boss = state.boss;
    let rewards = null;

    if (victory) {
      rewards = {
        xp: boss.rewards.xp || 50,
        title: boss.rewards.title || null,
        relicChance: boss.rewards.relicChance || 0,
        relicUnlocked: false,
      };

      // Appliquer les récompenses Firestore
      if (window.currentUid) {
        try {
          const fb = firebase.firestore();
          const update = {
            xp: firebase.firestore.FieldValue.increment(rewards.xp),
          };

          // Titre si applicable
          if (rewards.title) {
            update[`bossTitles.${boss.id}`] = rewards.title;
          }

          // Relique chance
          if (Math.random() < rewards.relicChance) {
            const relicIndex = Math.floor(Math.random() * 9) + 1;
            update.relics = firebase.firestore.FieldValue.arrayUnion(relicIndex);
            rewards.relicUnlocked = true;
          }

          await fb.collection('users').doc(window.currentUid).update(update);
        } catch (e) {
          console.warn('[BossEngine] Erreur récompenses:', e);
        }
      }
    }

    const result = {
      victory,
      dialogue: victory ? boss.dialogues.victory : boss.dialogues.defeat,
      boss: { id: boss.id, name: boss.name },
      rewards,
      stats: {
        totalQuestions: state.answered.length,
        correct: state.answered.filter(a => a.correct).length,
        wrong: state.answered.filter(a => !a.correct).length,
        time: Date.now() - state.startedAt,
      }
    };

    // Événement système
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.BOSS_END, {
        boss: boss,
        victory,
        rewards
      });
    }

    // Nettoyer l'état
    state = {
      boss: null, phaseIndex: 0, phaseHP: 0,
      questions: [], questionIndex: 0, answered: [],
      startedAt: null, phaseQuestionCount: 0,
    };

    return result;
  }

  // ── Abandonner le combat ──
  function abortBoss() {
    if (!state.boss) return;
    state = {
      boss: null, phaseIndex: 0, phaseHP: 0,
      questions: [], questionIndex: 0, answered: [],
      startedAt: null, phaseQuestionCount: 0,
    };
  }

  // ── Construire l'état renvoyé au UI ──
  function buildState() {
    if (!state.boss) return null;

    const phase = state.boss.phases[state.phaseIndex];
    const currentQ = state.questions[state.questionIndex] || null;

    return {
      boss: {
        id: state.boss.id,
        name: state.boss.name,
        history: state.boss.history,
        domain: state.boss.domain,
        rarity: state.boss.rarity,
        difficulty: state.boss.difficulty,
        image: state.boss.image,
      },
      phase: {
        index: state.phaseIndex,
        name: phase.name,
        total: state.boss.phases.length,
        hp: state.phaseHP,
        maxHP: phase.hp,
        dialogIntro: state.phaseIndex === 0 ? state.boss.dialogues.intro : null,
      },
      question: currentQ ? {
        index: state.questionIndex + 1,
        total: state.questions.length,
        text: currentQ.q.question,
        type: currentQ.type,
        choices: currentQ.type === 'quiz' ? currentQ.q.choices : null,
        domain: currentQ.q.domain || currentQ.q.category,
        xp: currentQ.q.xp || 10,
      } : null,
      progress: state.answered.length,
    };
  }

  // ── Récupérer le boss actif ──
  function getCurrentBoss() {
    return state.boss;
  }

  // ── API publique ──
  return {
    checkSpawn,
    startBoss,
    answerQuestion,
    abortBoss,
    getCurrentBoss,
    getState: buildState,
  };
})();
