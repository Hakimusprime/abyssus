"use strict";

/**
 * ABYSSUS — Boss Engine
 * Emplacement : /systems/boss-engine.js
 * 
 * Adapté pour l'intégration hybride (Firestore / LocalStorage)
 * Gère le déroulement des combats : phases, questions, HP, récompenses.
 */

// Sécurité : Déclaration par défaut si data/bosses.js n'est pas encore intégré
const ABYSSUS_BOSSES = typeof window.ABYSSUS_BOSSES !== 'undefined' ? window.ABYSSUS_BOSSES : [
  {
    id: 'boss_monolith',
    name: "Le Monolithe d'Ombre",
    spawnConditions: { minRank: 'F', probability: 1.0 },
    phases: [{ name: "Phase 1", hp: 100, questionsCount: 3, domains: [] }],
    dialogues: { 
      intro: "La structure vibre d'une énergie sombre...", 
      victory: "Le monolithe se fissure et s'effondre.", 
      defeat: "Votre volonté a été consumée." 
    },
    rewards: { xp: 150, title: 'Dompteur du Néant', relicChance: 0.1 }
  }
];

const AbyssusBossEngine = (() => {
  // ── État du combat ──
  let state = {
    boss: null,             
    phaseIndex: 0,          
    phaseHP: 0,             
    questions: [],          
    questionIndex: 0,       
    answered: [],           
    startedAt: null,        
    phaseQuestionCount: 0,  
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

    // Questions de quiz (Adaptation à la variable quizQuestions du script)
    if (typeof quizQuestions !== 'undefined') {
      quizQuestions.forEach(q => {
        if (domains.length === 0 || domains.includes(q.domain)) {
          pool.push({ q, type: 'quiz' });
        }
      });
    }

    // Questions de réflexion (Adaptation à la variable reflectionQuestions du script)
    if (typeof reflectionQuestions !== 'undefined') {
      reflectionQuestions.forEach(rq => {
        if (domains.length === 0 || domains.includes(rq.category)) {
          pool.push({ q: rq, type: 'reflexion' });
        }
      });
    }

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

    const phase = boss.phases[0];
    state.phaseHP = phase.hp;
    state.phaseQuestionCount = phase.questionsCount;
    state.questions = pickQuestionsForPhase(phase, phase.questionsCount);

    if (typeof AbyssusAntiCheat !== 'undefined') {
      AbyssusAntiCheat.onQuestionOpened('boss');
    }

    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.BOSS_START, { boss: boss });
    }

    if (typeof notify === 'function') notify(`COMBAT ENGAGÉ : ${boss.name}`);

    return buildState();
  }

  // ── Répondre à une question ──
  async function answerQuestion(choiceIndex) {
    if (!state.boss || state.questionIndex >= state.questions.length) {
      return { error: 'Aucune question active.' };
    }

    if (typeof AbyssusAntiCheat !== 'undefined') {
      const check = AbyssusAntiCheat.validateQuizAnswer();
      if (!check.allowed) return { error: check.reason };
    }

    const current = state.questions[state.questionIndex];
    let correct = false;

    if (current.type === 'quiz') {
      // Ajustement : vérifier 'correctIndex' au lieu de 'correct' selon votre fichier quiz_questions.js
      correct = choiceIndex === (current.q.correctIndex !== undefined ? current.q.correctIndex : current.q.correct);
    } else if (current.type === 'reflexion') {
      correct = true;
    }

    state.answered.push({
      questionId: current.q.id,
      type: current.type,
      correct,
      chosen: choiceIndex,
      time: Date.now() - state.startedAt,
    });

    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.QUIZ_ANSWER, {
        correct,
        firstAttempt: true,
        boss: state.boss.id,
        phase: state.phaseIndex
      });
    }

    if (typeof AbyssusAntiCheat !== 'undefined') {
      if (correct) AbyssusAntiCheat.onCorrectAnswer();
      else AbyssusAntiCheat.onWrongAnswer();
    }

    // Dommages
    if (!correct) {
      state.phaseHP = Math.max(0, state.phaseHP - 30);
      
      // Sécurité Firestore
      if (typeof firebase !== 'undefined' && window.currentUid) {
        try {
          const fb = firebase.firestore();
          fb.collection('users').doc(window.currentUid).update({
            hp: firebase.firestore.FieldValue.increment(-10)
          });
        } catch (e) { console.warn('[BossEngine] Erreur HP:', e); }
      }
    }

    state.questionIndex++;

    if (state.questionIndex >= state.questions.length || state.phaseHP <= 0) {
      if (state.phaseHP <= 0) {
        return await endBoss(false);
      }
      if (state.phaseIndex < state.boss.phases.length - 1) {
        return advancePhase();
      } else {
        return await endBoss(true);
      }
    }

    return {
      ...buildState(),
      feedback: { correct, message: correct ? 'ANALYSE CORRECTE' : 'ÉCHEC DE L\'ANALYSE' }
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

      // 1. Essai de mise à jour Firestore
      if (typeof firebase !== 'undefined' && window.currentUid) {
        try {
          const fb = firebase.firestore();
          const update = { xp: firebase.firestore.FieldValue.increment(rewards.xp) };
          if (rewards.title) update[`bossTitles.${boss.id}`] = rewards.title;
          if (Math.random() < rewards.relicChance) {
            const relicIndex = Math.floor(Math.random() * 9) + 1;
            update.relics = firebase.firestore.FieldValue.arrayUnion(relicIndex);
            rewards.relicUnlocked = true;
          }
          await fb.collection('users').doc(window.currentUid).update(update);
        } catch (e) {
          console.warn('[BossEngine] Erreur Firestore:', e);
        }
      } 
      // 2. Fallback LocalStorage (Architecture script.js actuelle)
      else if (typeof userData !== 'undefined') {
        if (typeof gainXP === 'function') gainXP(rewards.xp);
        if (rewards.title) {
          if (!userData.defeatedBosses.includes(boss.id)) {
            userData.defeatedBosses.push(boss.id);
            if (typeof saveUserData === 'function') saveUserData();
            if (typeof renderBossTitles === 'function') renderBossTitles();
          }
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

    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.BOSS_END, { boss: boss, victory, rewards });
    }

    if (typeof notify === 'function') {
      notify(victory ? `VICTOIRE : +${rewards.xp} XP` : `DÉFAITE FACE À ${boss.name}`);
    }

    abortBoss(); // Nettoyer l'état
    return result;
  }

  // ── Abandonner le combat ──
  function abortBoss() {
    state = {
      boss: null, phaseIndex: 0, phaseHP: 0,
      questions: [], questionIndex: 0, answered: [],
      startedAt: null, phaseQuestionCount: 0,
    };
  }

  // ── Construire l'état ──
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
        choices: currentQ.type === 'quiz' ? (currentQ.q.options || currentQ.q.choices) : null,
        domain: currentQ.q.domain || currentQ.q.category,
        xp: currentQ.q.xpReward || currentQ.q.xp || 10,
      } : null,
      progress: state.answered.length,
    };
  }

  // ── Connecteur UI pour script.js ──
  function openBossModal() {
    const bossToSpawn = checkSpawn("F", 100) || ABYSSUS_BOSSES[0];
    startBoss(bossToSpawn);
    
    // Raccourci pour tester la victoire instantanée si vous le souhaitez en dev
    // answerQuestion(0).then(() => answerQuestion(1)).then(() => answerQuestion(2)); 
  }

  // ── API publique ──
  return {
    checkSpawn,
    startBoss,
    answerQuestion,
    abortBoss,
    getCurrentBoss: () => state.boss,
    getState: buildState,
    openBossModal // Ajout pour compatibilité avec le bouton UI
  };
})();
