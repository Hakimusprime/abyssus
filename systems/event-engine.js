"use strict";

/**
 * Abyssus Event Engine — Système d'événements modulaire
 *
 * Types d'événements :
 * - Quotidiens : se répètent chaque jour
 * - Hebdomadaires : se répètent chaque semaine
 * - Mensuels : se répètent chaque mois
 * - Cachés : déclenchés par des conditions spéciales
 * - Mondiaux : synchronisés pour tous les joueurs
 *
 * Le système est entièrement data-driven : ajouter un événement = ajouter un objet.
 * Chaque événement peut avoir des récompenses, des conditions, et des dialogues.
 */
const AbyssusEventEngine = (() => {
  // ── État ──
  let activeEvents = [];
  let completedEvents = {};
  let eventTimers = [];

  // ── Configuration des événements ──
  const EVENT_CATALOG = [
    // ── Quotidiens ──
    {
      id: 'daily_reflection',
      name: 'Méditation du Jour',
      description: 'Partage une réflexion dans le Sanctuaire de Pensée.',
      type: 'daily',
      icon: '🧘',
      conditions: { minRank: 'F', requiredAction: 'reflection' },
      rewards: { xp: 30, bonusXP: 10 },
      dialogue: 'Un esprit tranquille est un esprit fort. Prends un moment pour réfléchir.',
    },
    {
      id: 'daily_quiz',
      name: 'Épreuve Quotidienne',
      description: 'Réponds correctement à 3 quiz.',
      type: 'daily',
      icon: '📚',
      conditions: { minRank: 'F', requiredAction: 'quiz', count: 3 },
      rewards: { xp: 50, bonusXP: 20 },
      dialogue: 'La connaissance se forge chaque jour. Montre ta maîtrise.',
    },
    {
      id: 'daily_streak',
      name: 'Chaîne du Savoir',
      description: 'Obtiens une série de 3 bonnes réponses consécutives.',
      type: 'daily',
      icon: '🔥',
      conditions: { minRank: 'E', requiredAction: 'streak', count: 3 },
      rewards: { xp: 40, bonusXP: 15 },
      dialogue: 'La constance est la clé de la sagesse.',
    },

    // ── Hebdomadaires ──
    {
      id: 'weekly_boss_hunter',
      name: 'Chasseur de Boss',
      description: 'Vaincs 2 Boss cette semaine.',
      type: 'weekly',
      icon: '⚔️',
      conditions: { minRank: 'D', requiredAction: 'boss_kill', count: 2 },
      rewards: { xp: 200, relicChance: 0.3, title: 'Chasseur de l\'Abîme' },
      dialogue: 'Les créatures de l\'Abîme se font plus nombreuses. Montre-leur qui est le prédateur.',
    },
    {
      id: 'weekly_domain_master',
      name: 'Maître d\'un Domaine',
      description: 'Gagne 150 XP dans un même domaine cette semaine.',
      type: 'weekly',
      icon: '🏛️',
      conditions: { minRank: 'C', requiredAction: 'domain_xp', domainXP: 150 },
      rewards: { xp: 150, relicChance: 0.2 },
      dialogue: 'La spécialisation est la voie vers l\'excellence. Choisis ton domaine.',
    },
    {
      id: 'weekly_community',
      name: 'Voix de l\'Agora',
      description: 'Reçois 5 soutiens sur tes réflexions.',
      type: 'weekly',
      icon: '💬',
      conditions: { minRank: 'C', requiredAction: 'likes', count: 5 },
      rewards: { xp: 120, bonusXP: 30 },
      dialogue: 'La communauté est ton miroir. Partage et tu recevras.',
    },

    // ── Mensuels ──
    {
      id: 'monthly_legend',
      name: 'Légende Vivante',
      description: 'Atteins le premier rang du classement.',
      type: 'monthly',
      icon: '👑',
      conditions: { minRank: 'A', requiredAction: 'rank_first' },
      rewards: { xp: 1000, relicChance: 0.8, title: 'Légende du Mois' },
      dialogue: 'La gloire est éphémère, mais la légende demeure. Gravis l\'Olympe.',
    },
    {
      id: 'monthly_collector',
      name: 'Collectionneur d\'Abysses',
      description: 'Collecte 5 reliques différentes.',
      type: 'monthly',
      icon: '💎',
      conditions: { minRank: 'B', requiredAction: 'relics', count: 5 },
      rewards: { xp: 800, relicChance: 0.5, title: 'Collectionneur Légendaire' },
      dialogue: 'Chaque relique raconte une histoire. Devient l\'archiviste de l\'Abîme.',
    },
    {
      id: 'monthly_perfection',
      name: 'Perfection Abyssale',
      description: 'Atteins 100% de précision sur 20 quiz en un mois.',
      type: 'monthly',
      icon: '⭐',
      conditions: { minRank: 'A', requiredAction: 'perfect_quiz', count: 20 },
      rewards: { xp: 1500, relicChance: 1.0, title: 'Parfait Absolu' },
      dialogue: 'La perfection n\'est pas un hasard. C\'est une discipline.',
    },

    // ── Cachés ──
    {
      id: 'secret_first_step',
      name: 'Le Premier Pas',
      description: 'Un événement secret...',
      type: 'secret',
      icon: '❓',
      secret: true,
      conditions: { requiredAction: 'secret_first', hidden: true },
      rewards: { xp: 100, title: 'Éveillé des Ombres' },
      dialogue: 'Tu as trouvé le premier secret de l\'Abîme. Mais ce n\'est que le début...',
    },
    {
      id: 'secret_philosophy',
      name: 'Le Philosophe Solitaire',
      description: 'Réponds à 10 réflexions sans en partager aucune.',
      type: 'secret',
      icon: '❓',
      secret: true,
      conditions: { requiredAction: 'silent_reflections', count: 10, hidden: true },
      rewards: { xp: 200, title: 'Philosophe Solitaire' },
      dialogue: 'Parfois, la plus grande sagesse est celle qu\'on garde pour soi.',
    },
    {
      id: 'secret_resilient',
      name: 'L\'Indomptable',
      description: 'Perds 50 HP en combat de Boss sans mourir.',
      type: 'secret',
      icon: '❓',
      secret: true,
      conditions: { requiredAction: 'boss_HP_loss', count: 50, hidden: true },
      rewards: { xp: 300, title: 'Indomptable' },
      dialogue: 'La douleur forge l\'esprit. Tu as prouvé ta résilience.',
    },

    // ── Mondiaux ──
    {
      id: 'world_knowledge',
      name: 'Explosion du Savoir',
      description: 'Événement mondial : 1000 questions doivent être répondues par la communauté.',
      type: 'world',
      icon: '🌍',
      conditions: { requiredAction: 'global_answers', count: 1000, global: true },
      rewards: { xp: 500, relicChance: 0.5, title: 'Participant Mondial' },
      dialogue: 'L\'humanité unie par la connaissance. Chaque réponse compte.',
    },
    {
      id: 'world_boss_rush',
      name: 'Ruée vers les Boss',
      description: 'Événement mondial : 50 Boss doivent être vaincus collectivement.',
      type: 'world',
      icon: '🌍',
      conditions: { requiredAction: 'global_boss_kills', count: 50, global: true },
      rewards: { xp: 800, relicChance: 0.7, title: 'Chasseur Mondial' },
      dialogue: 'Les Boss de l\'Abîme se sont multipliés. Unissons nos forces !',
    },
  ];

  // ── Initialisation ──
  function init(userData) {
    completedEvents = userData?.completedEvents || {};
    activeEvents = [];
    eventTimers = [];

    // Activer les événements programmés
    scheduleEvents();

    // Récompenser les événements déjà complétés silencieusement
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.on(AbyssusEvents.EVENTS.QUIZ_ANSWER, (data) => {
        checkEventCondition('quiz', data);
      });
      AbyssusEvents.on(AbyssusEvents.EVENTS.REFLECTION_SAVED, () => {
        checkEventCondition('reflection');
      });
      AbyssusEvents.on(AbyssusEvents.EVENTS.BOSS_END, (data) => {
        if (data.victory) checkEventCondition('boss_kill', data);
      });
    }
  }

  // ── Planification des événements ──
  function scheduleEvents() {
    const now = new Date();
    activeEvents = [];

    EVENT_CATALOG.forEach(event => {
      // Skip déjà complété
      if (completedEvents[event.id]) return;
      if (event.secret) return; // Les secrets sont déclenchés manuellement

      // Vérifier le type et la date
      switch (event.type) {
        case 'daily':
          activeEvents.push({
            ...event,
            expiresAt: getEndOfDay(now),
            progress: 0,
            completed: false,
          });
          break;
        case 'weekly':
          activeEvents.push({
            ...event,
            expiresAt: getEndOfWeek(now),
            progress: 0,
            completed: false,
          });
          break;
        case 'monthly':
          activeEvents.push({
            ...event,
            expiresAt: getEndOfMonth(now),
            progress: 0,
            completed: false,
          });
          break;
        case 'world':
          activeEvents.push({
            ...event,
            expiresAt: getEndOfWeek(now),
            progress: 0,
            completed: false,
            global: true,
            globalProgress: 0,
          });
          break;
      }
    });
  }

  function getEndOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function getEndOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + (7 - d.getDay()));
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function getEndOfMonth(date) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  // ── Vérifier les conditions d'un événement ──
  function checkEventCondition(action, data) {
    activeEvents.forEach(event => {
      if (event.completed) return;
      if (event.conditions.requiredAction !== action) return;

      // Vérifier le rank minimum
      if (event.conditions.minRank && window.userData) {
        const RANKS = ['F','E','D','C','B','A','S','SS','SSS','Abyss'];
        const userIdx = RANKS.indexOf(window.userData.xp >= 7200 ? 'Abyss' :
          RANKS.find((r, i) => window.userData.xp < [0,100,250,500,900,1500,2400,3600,5200,7200][i+1]) || 'F');
        const reqIdx = RANKS.indexOf(event.conditions.minRank);
        if (userIdx < reqIdx) return;
      }

      // Incrémenter le progrès
      event.progress = (event.progress || 0) + 1;

      // Vérifier si complété
      if (event.progress >= (event.conditions.count || 1)) {
        completeEvent(event);
      }
    });
  }

  // ── Compléter un événement ──
  async function completeEvent(event) {
    if (event.completed) return;
    event.completed = true;

    // Marquer dans Firestore
    if (window.currentUid) {
      try {
        const fb = firebase.firestore();
        const update = {
          [`completedEvents.${event.id}`]: {
            completedAt: new Date().toISOString(),
            rewards: event.rewards,
          }
        };
        if (event.rewards.xp) {
          update.xp = firebase.firestore.FieldValue.increment(event.rewards.xp);
        }
        if (event.rewards.title) {
          update[`eventTitles.${event.id}`] = event.rewards.title;
        }
        await fb.collection('users').doc(window.currentUid).update(update);
      } catch (e) {
        console.warn('[EventEngine] Erreur completion:', e);
      }
    }

    // Notification
    const notifyFn = window.notify || (msg => { if (window.queueNotify) window.queueNotify(msg); });
    notifyFn(`✨ Événement complété : ${event.name} ! +${event.rewards.xp || 0} XP`);

    // Émettre l'événement système
    if (typeof AbyssusEvents !== 'undefined') {
      AbyssusEvents.emit(AbyssusEvents.EVENTS.EVENT_TRIGGER, {
        event: event.id,
        name: event.name,
        rewards: event.rewards,
      });
    }
  }

  // ── Déclencher un événement secret ──
  function triggerSecret(eventId) {
    const event = EVENT_CATALOG.find(e => e.id === eventId);
    if (!event || !event.secret) return false;
    if (completedEvents[eventId]) return false;

    completeEvent(event);
    return true;
  }

  // ── Récupérer les événements actifs ──
  function getActiveEvents() {
    return activeEvents.filter(e => !e.completed);
  }

  // ── Récupérer les événements complétés ──
  function getCompletedEvents() {
    return activeEvents.filter(e => e.completed);
  }

  // ── Rendre les événements dans le DOM ──
  function renderEventPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const active = getActiveEvents();
    if (active.length === 0) {
      container.innerHTML = '<p style="color:var(--muted); font-size:0.85rem;">Aucun événement actif pour le moment.</p>';
      return;
    }

    container.innerHTML = active.map(event => `
      <div class="event-card ${event.type}">
        <div class="event-header">
          <span class="event-icon">${event.icon || '📌'}</span>
          <span class="event-type-label">${event.type}</span>
        </div>
        <strong class="event-name">${event.name}</strong>
        <p class="event-desc">${event.description}</p>
        ${event.conditions.count ? `
          <div class="event-progress">
            <div class="event-bar">
              <span style="width:${Math.min(100, (event.progress / event.conditions.count) * 100)}%"></span>
            </div>
            <span class="event-progress-text">${event.progress}/${event.conditions.count}</span>
          </div>
        ` : ''}
        ${event.expiresAt ? `<small class="event-expires">Expire : ${event.expiresAt.toLocaleDateString()}</small>` : ''}
      </div>
    `).join('');
  }

  // ── Réinitialisation quotidienne ──
  function resetDailyEvents() {
    const now = new Date();
    activeEvents = activeEvents.filter(e => {
      if (e.type === 'daily' && e.completed) return false;
      if (e.expiresAt && now > e.expiresAt) return false;
      return true;
    });
    scheduleEvents();
  }

  return {
    init,
    getActiveEvents,
    getCompletedEvents,
    checkEventCondition,
    triggerSecret,
    renderEventPanel,
    resetDailyEvents,
    completeEvent,
  };
})();
