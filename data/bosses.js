"use strict";

/**
 * Banque de Boss pour Abyssus.
 * Chaque Boss possède : id, nom, histoire, difficulté, image, rareté,
 * domaine, conditions d'apparition, récompenses, dialogues, plusieurs phases.
 *
 * Le moteur (boss-engine.js) peut en charger des centaines.
 */
const ABYSSUS_BOSSES = [
  {
    id: "sphinx_oubli",
    name: "Le Sphinx de l'Oubli",
    history: "Gardien de la première strate de l'Abîme, le Sphinx de l'Oubli efface les mémoires des imprudents qui osent descendre sans préparation. Sa voix résonne dans les couloirs du temps perdu.",
    difficulty: "Facile",
    rarity: "Commune",
    domain: "Culture générale",
    image: null, // URL optionnelle — peut être générée plus tard
    spawnConditions: { minRank: "F", maxRank: "D", minHP: 20, probability: 0.4 },
    rewards: { xp: 50, relicChance: 0.1, title: "Réveillé de l'Oubli" },
    dialogues: {
      intro: "Tu oses troubler mon sommeil éternel ? Réponds à mes questions, ou rejoins les ombres.",
      phase2: "Tu commences à m'intéresser... Mais la véritable épreuve ne fait que commencer.",
      victory: "Impossible... Je retourne à l'oubli. Emporte ce savoir, il te servira.",
      defeat: "L'oubli t'engloutit. Reviens quand ta conscience sera plus forte."
    },
    phases: [
      {
        name: "Éveil du Sphinx",
        hp: 100,
        questionsCount: 3,
        timePerQuestion: 30,
        difficulty: "Facile",
        domains: ["Culture générale"]
      },
      {
        name: "Murmures de l'Abîme",
        hp: 80,
        questionsCount: 3,
        timePerQuestion: 20,
        difficulty: "Moyen",
        domains: ["Culture générale", "Histoire"]
      }
    ]
  },

  {
    id: "cerbere_questions",
    name: "Cerbère aux Cent Questions",
    history: "Chacune de ses trois têtes pose des questions différentes. Les réponses doivent être données avant que la prochaine tête ne parle, sans quoi le joueur est dévoré par le doute.",
    difficulty: "Moyen",
    rarity: "Rare",
    domain: "Sciences",
    spawnConditions: { minRank: "D", maxRank: "A", minHP: 30, probability: 0.3 },
    rewards: { xp: 120, relicChance: 0.3, title: "Dompteur de Cerbère" },
    dialogues: {
      intro: "Trois têtes, trois vérités, une seule porte de sortie. Choisis mal, et tu alimenteras ma faim.",
      phase2: "Tu as survécu à la première tête. La seconde est bien plus affamée.",
      victory: "Personne n'avait dompté mes trois voix... Qui es-tu vraiment ?",
      defeat: "Une autre âme avalée par le doute."
    },
    phases: [
      {
        name: "Tête de l'Est",
        hp: 120,
        questionsCount: 3,
        timePerQuestion: 25,
        difficulty: "Moyen",
        domains: ["Sciences", "Technologie"]
      },
      {
        name: "Tête de l'Ouest",
        hp: 100,
        questionsCount: 4,
        timePerQuestion: 20,
        difficulty: "Moyen",
        domains: ["Sciences", "Mathématiques"]
      },
      {
        name: "Tête du Sud",
        hp: 80,
        questionsCount: 5,
        timePerQuestion: 15,
        difficulty: "Difficile",
        domains: ["Sciences", "Philosophie"]
      }
    ]
  },

  {
    id: "minotaure_labyrinthe",
    name: "Le Minotaure du Labyrinthe des Idées",
    history: "Au cœur du labyrinthe des concepts, le Minotaure attend. Il ne pose pas de questions — il oblige le joueur à trouver la sortie en répondant correctement, chaque erreur le rapprochant de ses cornes.",
    difficulty: "Difficile",
    rarity: "Épique",
    domain: "Philosophie",
    spawnConditions: { minRank: "C", maxRank: "S", minHP: 40, probability: 0.2 },
    rewards: { xp: 200, relicChance: 0.5, title: "Architecte du Labyrinthe" },
    dialogues: {
      intro: "L'Abîme t'envoie une nouvelle proie... Les murs du labyrinthe se referment. Trouve la sortie par ta connaissance.",
      phase2: "Tu approches du centre. Les couloirs rétrécissent. Chaque erreur est une corne qui s'enfonce.",
      victory: "Tu as traversé mon labyrinthe. Personne n'y était parvenu depuis des siècles. Prends ce fil d'Ariane.",
      defeat: "Le labyrinthe t'a englouti. Tu te réveilleras à l'entrée, mais plus faible."
    },
    phases: [
      {
        name: "L'Entrée des Ténèbres",
        hp: 150,
        questionsCount: 4,
        timePerQuestion: 25,
        difficulty: "Moyen",
        domains: ["Philosophie", "Éthique"]
      },
      {
        name: "Les Couloirs du Doute",
        hp: 120,
        questionsCount: 4,
        timePerQuestion: 20,
        difficulty: "Difficile",
        domains: ["Philosophie", "Métaphysique"]
      },
      {
        name: "Le Cœur du Labyrinthe",
        hp: 80,
        questionsCount: 5,
        timePerQuestion: 15,
        difficulty: "Très Difficile",
        domains: ["Philosophie", "Existence", "Conscience"]
      }
    ]
  },

  {
    id: "hydre_savante",
    name: "L'Hydre Savante",
    history: "Une créature légendaire dont chaque tête coupée repousse double, avec une question plus complexe. Seuls les plus érudits parviennent à la vaincre complètement.",
    difficulty: "Très Difficile",
    rarity: "Légendaire",
    domain: "Littérature",
    spawnConditions: { minRank: "B", maxRank: "SS", minHP: 50, probability: 0.15 },
    rewards: { xp: 350, relicChance: 0.7, title: "Pourfendeur d'Hydre" },
    dialogues: {
      intro: "Une nouvelle tête, une nouvelle question. Combien pourras-tu trancher avant de t'épuiser ?",
      phase2: "Mes têtes repoussent. Chaque réponse en engendre deux nouvelles. Abandonne !",
      victory: "Impossible... Tu as coupé toutes mes têtes. Que restera-t-il de moi ?",
      defeat: "Mes tiges ont eu raison de toi. Reviens quand ta culture sera plus vaste."
    },
    phases: [
      {
        name: "Tête Primordiale",
        hp: 160,
        questionsCount: 4,
        timePerQuestion: 25,
        difficulty: "Moyen",
        domains: ["Littérature"]
      },
      {
        name: "Double Régénération",
        hp: 130,
        questionsCount: 5,
        timePerQuestion: 20,
        difficulty: "Difficile",
        domains: ["Littérature", "Histoire"]
      },
      {
        name: "Quadruple Menace",
        hp: 90,
        questionsCount: 6,
        timePerQuestion: 15,
        difficulty: "Très Difficile",
        domains: ["Littérature", "Philosophie", "Art"]
      }
    ]
  },

  {
    id: "grand_ancien",
    name: "Le Grand Ancien Endormi",
    history: "Une entité cosmique qui ne se réveille que lorsque le savoir accumulé par l'humanité atteint un seuil critique. Son éveil signifierait la fin de l'ignorance... ou de toute réalité telle que nous la connaissons.",
    difficulty: "Abyssal",
    rarity: "Mythique",
    domain: "Métaphysique",
    spawnConditions: { minRank: "S", minHP: 60, probability: 0.05, requireEvent: "eveil_ancien" },
    rewards: { xp: 1000, relicChance: 1.0, title: "Éveilleur des Abysses" },
    dialogues: {
      intro: "PH'INGLUI MGLW'NAFH CTHULHU R'LYEH WGAH'NAGL FHTAGN... Ta présence a troublé mon sommeil.",
      phase2: "Tu as vu des fragments de la vérité ultime. Le reste te brisera l'esprit.",
      victory: "Tu es plus qu'humain. La connaissance absolue est à toi... pour cette fois.",
      defeat: "Ton esprit n'était pas prêt. Retourne dormir parmi les mortels ignorants."
    },
    phases: [
      {
        name: "Murmures Cosmiques",
        hp: 200,
        questionsCount: 5,
        timePerQuestion: 20,
        difficulty: "Difficile",
        domains: ["Métaphysique", "Conscience"]
      },
      {
        name: "Vision de l'Infini",
        hp: 150,
        questionsCount: 6,
        timePerQuestion: 15,
        difficulty: "Très Difficile",
        domains: ["Métaphysique", "Existence", "Temps"]
      },
      {
        name: "Réalité Fragmentée",
        hp: 100,
        questionsCount: 7,
        timePerQuestion: 10,
        difficulty: "Abyssal",
        domains: ["Métaphysique", "Illusion", "Vérité"]
      }
    ]
  }
];

// Pour ajouter facilement des centaines de Boss : exporter une fonction génératrice
function createBossFromTemplate(template) {
  return {
    id: template.id || `boss_${Date.now()}`,
    name: template.name || "Boss Inconnu",
    history: template.history || "Un mystère ancien...",
    difficulty: template.difficulty || "Moyen",
    rarity: template.rarity || "Commune",
    domain: template.domain || "Culture générale",
    image: template.image || null,
    spawnConditions: {
      minRank: template.spawnConditions?.minRank || "F",
      maxRank: template.spawnConditions?.maxRank || "SSS",
      minHP: template.spawnConditions?.minHP || 10,
      probability: template.spawnConditions?.probability || 0.3,
      requireEvent: template.spawnConditions?.requireEvent || null
    },
    rewards: {
      xp: template.rewards?.xp || 50,
      relicChance: template.rewards?.relicChance || 0.1,
      title: template.rewards?.title || null
    },
    dialogues: {
      intro: template.dialogues?.intro || "Tu oses m'affronter ?",
      phase2: template.dialogues?.phase2 || "Pas mal... Mais ce n'est pas fini.",
      victory: template.dialogues?.victory || "Tu es digne.",
      defeat: template.dialogues?.defeat || "Échoue et médite."
    },
    phases: template.phases || [
      {
        name: "Phase Unique",
        hp: 100,
        questionsCount: 3,
        timePerQuestion: 30,
        difficulty: "Moyen",
        domains: [template.domain || "Culture générale"]
      }
    ]
  };
}
