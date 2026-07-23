
/**
 * ABYSSUS BANQUE - Banque Master de Questions
 */
const quizQuestions = [
    {
        id: 1,
        question: "Dans quel univers évolue le personnage principal Sung Jinwoo ?",
        options: ["Solo Leveling", "Tower of God", "The Beginning After The End", "Omniscient Reader"],
        correct: 0,
        category: "Manhwa",
        difficulty: "Facile"
    },
    {
        id: 2,
        question: "Quel est le nom de l'organisation secrète dirigée par Klein Moretti dans Lord of the Mysteries ?",
        options: ["L'Ordre de l'Aurore", "Le Club du Tarot", "La Rose Rédemption", "Les Hermétiques"],
        correct: 1,
        category: "Web Novel",
        difficulty: "Moyen"
    },
    {
        id: 3,
        question: "Dans Sakamoto Days, quelle est la profession actuelle de Taro Sakamoto ?",
        options: ["Agent secret", "Tueur à gages en activité", "Gérant d'une supérette", "Policier"],
        correct: 2,
        category: "Manga",
        difficulty: "Facile"
    },
    {
        id: 4,
        question: "Quel Gu légendaire permet à Fang Yuan de remonter le temps dans Reverend Insanity ?",
        options: ["Gu de la Sagesse", "Cicada du Printemps et de l'Automne", "Gu du Mandat Céleste", "Gu d'Ombre"],
        correct: 1,
        category: "Web Novel",
        difficulty: "Difficile"
    },
    {
        id: 5,
        question: "Quel est le premier titre d'Apotheosis dans la hiérarchie des guerriers ?",
        options: ["Maréchal", "Raffinage du Corps", "Domaine Céleste", "Roi Divin"],
        correct: 1,
        category: "Manhua",
        difficulty: "Moyen"
    }
    // Vos 500 questions s'insèrent ici selon la même structure
];

/**
 * Extrait un sous-ensemble aléatoire de questions sans altérer le tableau master
 */
function getGameQuestions(amount = 10) {
    if (!quizQuestions || quizQuestions.length === 0) return [];
    const pool = [...quizQuestions]; 
    return pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(amount, pool.length));
}
