"use strict";

/**
 * ABYSSUS — Quest System
 * Emplacement : /systems/quest-system.js
 * 
 * Système de quêtes modulaire et data-driven (Hybride LocalStorage / Firestore)
 */

const AbyssusQuestSystem = (() => {
  // ── État ──
  let activeQuests = [];
  let completedQuestIds = {};
  let questLog = {};

  // ── Catalogue des quêtes (data-driven) ──
  const QUESTS = [
    // ── Quotidiennes ──
    {
      id: 'quest_daily_reflection',
      name: 'Parole du Jour',
      description: 'Partage 2 réflexions dans le Sanctuaire.',
      type: 'daily',
      icon: '📝',
      steps: [
        { objective: 'reflection', count: 2, xp: 20 }
      ],
      rewards: { xp: 50 },
      dialogue: 'La sagesse se partage. Que ta voix soit entendue.',
    },
    {
      id: 'quest_daily_quizmaster',
      name: 'Maître du Quiz',
      description: 'Réponds correctement à 5 quiz.',
      type: 'daily',
      icon: '🎯',
      steps: [
        { objective: 'quiz_correct', count: 5, xp: 30 }
      ],
      rewards: { xp: 80 },
      dialogue: 'La connaissance est une arme. Manie-la avec précision.',
    },
    {
      id: 'quest_daily_explorer',
      name: 'Explorateur Curieux',
      description: 'Ouvre 3 questions d\'un nouveau domaine.',
      type: 'daily',
      icon: '🗺️',
      steps: [
        { objective: 'new_domain', count: 3, xp: 25 }
      ],
      rewards: { xp: 60 },
      dialogue: 'L\'ignorance est un territoire inexploré. Deviens son cartographe.',
    },

    // ── Hebdomadaires ──
    {
      id: 'quest_weekly_boss_slayer',
      name: 'Pourfendeur de Boss',
      description: 'Vaincs 3 Boss cette semaine.',
      type: 'weekly',
      icon: '🐉',
      steps: [
        { objective: 'boss_kill', count: 3, xp: 100 }
      ],
      rewards: { xp: 300, relicChance: 0.3 },
      dialogue: 'L\'Abîme grouille de créatures. Deviens leur cauchemar.',
    },
    {
      id: 'quest_weekly_philosopher',
      name: 'Philosophe des Profondeurs',
      description: 'Écris des réflexions dans 5 domaines différents.',
      type: 'weekly',
      icon: '📜',
      steps: [
        { objective: 'domain_reflection', count: 5, xp: 50 }
      ],
      rewards: { xp: 200, title: 'Encyclopédiste' },
      dialogue: 'La diversité de la pensée est la plus grande richesse.',
    },
    {
      id: 'quest_weekly_grind',
      name: 'Moissonneur d\'XP',
      description: 'Gagne 500 XP cette semaine.',
      type: 'weekly',
      icon: '⚡',
      steps: [
        { objective: 'xp_gain', count: 500, xp: 10 }
      ],
      rewards: { xp: 400, relicChance: 0.5 },
      dialogue: 'L\'effort paie toujours. Chaque point de savoir te rapproche de l\'absolu.',
    },

    // ── Secrètes ──
    {
      id: 'quest_secret_100',
      name: 'Cent Questions',
      description: 'Réponds à 100 questions (secret).',
      type: 'secret',
      icon: '❓',
      secret: true,
      steps: [
        { objective: 'total_answers', count: 100, xp: 200 }
      ],
      rewards: { xp: 500, title: 'Le Centième' },
      dialogue: 'Cent réponses, cent fragments de vérité. Tu deviens l\'érudit des ombres.',
    },
    {
      id: 'quest_secret_no_hp',
      name: 'Le Survivant',
      description: 'Termine un quiz avec 1 HP restant.',
      type: 'secret',
      icon: '❓',
      secret: true,
      steps: [
        { objective: 'survive_1hp', count: 1, xp: 50 }
      ],
      rewards: { xp: 200, title: 'Survivant de l\'Abîme' },
      dialogue: 'Tu as flirté avec l\'abîme et tu en es revenu. Tu n\'es plus le même.',
    },
    {
      id: 'quest_secret_midnight',
      name: 'Le Veilleur',
      description: 'Joue après minuit.',
      type: 'secret',
      icon: '❓',
      secret: true,
      steps: [
        { objective: 'play_midnight', count: 1, xp: 10 }
      ],
      rewards: { xp: 100, title: 'Veilleur de l\'Abîme' },
      dialogue: 'Les heures les plus sombres révèlent les esprits les plus brillants.',
    },

    // ── Légendaires (multi-étapes) ──
    {
      id: 'quest_legend_beginner',
      name: 'L\'Éveil',
      description: 'Atteins le rang C et écris 10 réflexions.',
      type: 'legendary',
      icon: '👑',
      steps: [
        { objective: 'rank_c', count: 1, xp: 100 },
        { objective: 'reflection', count: 10, xp: 50 }
      ],
      rewards: { xp: 1000, title: 'Éveillé', relicChance: 0.8 },
      dialogue: 'Tout grand voyage commence par un premier pas. Tu as fait les tiens.',
    },
    {
      id: 'quest_legend_master',
      name: 'Le Maître des Abysses',
      description: 'Atteins le rang S, vaincs tous les Boss, écris 50 réflexions.',
      type: 'legendary',
      icon: '👑',
      steps: [
        { objective: 'rank_s', count: 1, xp: 500 },
        { objective: 'all_bosses', count: 5, xp: 200 },
        { objective: 'reflection', count: 50, xp: 50 }
      ],
      rewards: { xp: 5000, title: 'Maître des Abysses', relicChance: 1.0 },
      dialogue: 'Tu as dompté l\'Abîme. Le savoir n\'a plus de secrets pour toi.',
    },
    {
      id: 'quest_legend_perfect',
      name: 'La Perfection',
      description: 'Atteins 95%+ de précision sur 100 quiz.',
      type: 'legendary',
      icon: '👑',
      steps: [
        { objective: 'perfect_95', count: 100, xp: 100 }
      ],
      rewards: { xp: 3000, title: 'Parfait', relicChance: 1.0 },
      dialogue: 'La perfection n\'est pas un but, c\'est une manière de voyager.',
    },
  ];

  // ── Initialisation ──
  function init(userSource) {
    const data = userSource || (typeof userData !== 'undefined' ? userData : {});
    completedQuestIds = data?.quests?.completed || {};
    questLog = data?.quests?.progress || {};
    activeQuests = [];

    // Initialiser les quêtes actives
    QUESTS.forEach(quest => {
      if (completedQuestIds[quest.id]) return;
      if (quest.secret) return; // Secrets : activés manuellement

      activeQuests.push({
        ...quest,
        progress: questLog[quest.id]?.progress || quest.steps.map(() => 0),
        startedAt: questLog[quest.id]?.startedAt || Date.now(),
      });
    });

    // Hook événements (si AbyssusEvents existe)
    if (typeof AbyssusEvents !== 'undefined') {
      try {
        AbyssusEvents.on(AbyssusEvents.EVENTS.QUIZ_ANSWER, onQuizAnswer);
        AbyssusEvents.on(AbyssusEvents.EVENTS.REFLECTION_SAVED, onReflectionSaved);
        AbyssusEvents.on(AbyssusEvents.EVENTS.BOSS_END, onBossEnd);
        AbyssusEvents.on(AbyssusEvents.EVENTS.EVENT_TRIGGER, onEventTriggered);
      } catch (e) {
        console.warn('[QuestSystem] Erreur liaison événements:', e);
      }
    }
  }

  // ── Hooks événements ──
  function onQuizAnswer(data) {
    if (data.correct) {
      progressQuests('quiz_correct', 1);
    }
    progressQuests('total_answers', 1);

    if (data.correct && data.firstAttempt) {
      progressQuests('perfect_95', 1);
    }
  }

  function onReflectionSaved() {
    progressQuests('reflection', 1);
  }

  function onBossEnd(data) {
    if (data.victory) {
      progressQuests('boss_kill', 1);
    }
  }

  function onEventTriggered(data) {
    // Événement générique optionnel
  }

  // ── Progresser les quêtes ──
  function progressQuests(objective, amount = 1) {
    activeQuests.forEach(quest => {
      if (quest.completed || quest.rewardClaimed) return;

      quest.steps.forEach((step, idx) => {
        if (step.objective === objective) {
          quest.progress[idx] = (quest.progress[idx] || 0) + amount;

          if (quest.progress[idx] >= step.count) {
            quest.progress[idx] = step.count;

            const allDone = quest.steps.every((s, i) => (quest.progress[i] || 0) >= s.count);
            if (allDone) {
              completeQuest(quest);
            }
          }
        }
      });
    });

    saveProgress();
  }

  // ── Compléter une quête ──
  async function completeQuest(quest) {
    if (quest.completed) return;
    quest.completed = true;
    completedQuestIds[quest.id] = {
      completedAt: new Date().toISOString(),
    };

    const totalXP = quest.steps.reduce((sum, s) => sum + (s.xp || 0), 0) + (quest.rewards.xp || 0);

    // Notification système
    const notifyFn = window.notify || (msg => { if (typeof notify === 'function') notify(msg); });
    notifyFn(`🏆 Quête terminée : ${quest.name} ! +${totalXP} XP`);

    // 1. Mise à jour Locale (`userData` / `script.js`)
    if (typeof userData !== 'undefined') {
      if (typeof gainXP === 'function') {
        gainXP(totalXP);
      } else {
        userData.xp = (userData.xp || 0) + totalXP;
      }
      
      if (!userData.quests) userData.quests = { completed: {}, progress: {} };
      userData.quests.completed[quest.id] = completedQuestIds[quest.id];

      if (typeof saveUserData === 'function') saveUserData();
    }

    // 2. Persistance Firestore si connecté
    if (typeof firebase !== 'undefined' && window.currentUid) {
      try {
        const fb = firebase.firestore();
        const update = {
          [`quests.completed.${quest.id}`]: completedQuestIds[quest.id],
          xp: firebase.firestore.FieldValue.increment(totalXP),
        };
        if (quest.rewards.title) {
          update[`questTitles.${quest.id}`] = quest.rewards.title;
        }
        if (quest.rewards.relicChance && Math.random() < quest.rewards.relicChance) {
          const relicIndex = Math.floor(Math.random() * 9) + 1;
          update.relics = firebase.firestore.FieldValue.arrayUnion(relicIndex);
        }
        await fb.collection('users').doc(window.currentUid).update(update);
      } catch (e) {
        console.warn('[QuestSystem] Erreur complétion Firestore:', e);
      }
    }

    // Émettre l'événement global
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.EVENT_TRIGGER, {
        type: 'quest',
        questId: quest.id,
        name: quest.name,
      });
    }
  }

  // ── Activer une quête secrète ──
  function activateSecretQuest(questId) {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return false;
    if (completedQuestIds[quest.id]) return false;
    if (activeQuests.some(q => q.id === questId)) return false;

    activeQuests.push({
      ...quest,
      progress: quest.steps.map(() => 0),
      startedAt: Date.now(),
    });

    saveProgress();
    return true;
  }

  // ── Sauvegarder la progression ──
  function saveProgress() {
    const progress = {};
    activeQuests.forEach(quest => {
      progress[quest.id] = {
        progress: quest.progress,
        startedAt: quest.startedAt,
        completed: quest.completed || false,
      };
    });

    // Sauvegarde locale
    if (typeof userData !== 'undefined') {
      if (!userData.quests) userData.quests = {};
      userData.quests.progress = progress;
      userData.quests.completed = completedQuestIds;
      if (typeof saveUserData === 'function') saveUserData();
    }

    // Sauvegarde Firestore optionnelle
    if (typeof firebase !== 'undefined' && window.currentUid) {
      try {
        const fb = firebase.firestore();
        fb.collection('users').doc(window.currentUid).update({
          'quests.progress': progress,
          'quests.completed': completedQuestIds
        });
      } catch (e) {
        // Silencieux pour éviter de saturer la console en cas de rate-limit
      }
    }
  }

  // ── Rendu UI ──
  function renderQuestPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const active = activeQuests.filter(q => !q.completed);
    if (active.length === 0) {
      container.innerHTML = '<p style="color:var(--text-dim, #888); font-size:0.85rem; text-align:center; padding:1rem;">Aucune quête active. Continue d\'explorer l\'Abîme...</p>';
      return;
    }

    container.innerHTML = active.map(quest => {
      const allSteps = quest.steps.map((step, idx) => {
        const progress = quest.progress[idx] || 0;
        const done = progress >= step.count;
        const pct = Math.min(100, (progress / step.count) * 100);
        return `
          <div class="quest-step ${done ? 'done' : ''}" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; font-size:0.8rem;">
            <span class="step-icon">${done ? '✅' : '⬜'}</span>
            <div class="step-info" style="flex:1;">
              <span class="step-text" style="color:var(--text-main);">${step.objective.replace(/_/g, ' ')}</span>
              <div class="step-bar" style="background:var(--bg-card, #222); height:4px; border-radius:2px; margin-top:2px; overflow:hidden;">
                <span style="display:block; height:100%; width:${pct}%; background:var(--accent, #6366f1); transition:width 0.3s;"></span>
              </div>
              <small style="color:var(--text-dim);">${progress}/${step.count}</small>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="quest-card ${quest.type}" style="background:var(--bg-surface, #111); border:1px solid var(--border-color, #333); border-radius:8px; padding:1rem; margin-bottom:0.8rem;">
          <div class="quest-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="quest-icon" style="font-size:1.2rem;">${quest.icon || '📋'}</span>
            <span class="quest-type" style="font-size:0.7rem; text-transform:uppercase; background:var(--bg-card); padding:2px 6px; border-radius:4px; color:var(--text-dim);">${quest.type}</span>
          </div>
          <strong class="quest-name" style="display:block; color:var(--text-main); margin-bottom:0.2rem;">${quest.name}</strong>
          <p class="quest-desc" style="color:var(--text-dim); font-size:0.85rem; margin-bottom:0.6rem;">${quest.description}</p>
          <div class="quest-steps" style="margin-bottom:0.6rem;">${allSteps}</div>
          <div class="quest-reward" style="border-top:1px dashed var(--border-color, #333); padding-top:0.4rem;">
            <small style="color:var(--accent-light, #818cf8);">🏆 ${quest.rewards.xp || 0} XP ${quest.rewards.title ? '· Titre: ' + quest.rewards.title : ''}</small>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── API publique ──
  return {
    init,
    activateSecretQuest,
    progressQuests,
    completeQuest,
    renderQuestPanel,
    getActiveQuests: () => activeQuests.filter(q => !q.completed),
    getCompletedQuests: () => activeQuests.filter(q => q.completed),
  };
})();
