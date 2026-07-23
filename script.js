// ==========================================
// 1. CONFIGURATION & INITIALISATION FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ==========================================
// 2. ÉTATS DU JEU & PARTICIPANTS PAR DÉFAUT
// ==========================================
let currentQuestions = [];
let currentQuestionIndex = 0;
let sessionXP = 0;
let currentPlayerName = "Hakim";

const BASE_PARTICIPANTS = [
    { name: "Sung_Jinwoo", score: 500, rank: "S-Rank" },
    { name: "Klein_Moretti", score: 460, rank: "Lord" },
    { name: "Saitama_99", score: 420, rank: "Héros" },
    { name: "Fang_Yuan", score: 390, rank: "Vénérable" },
    { name: "Gazo_Fan", score: 310, rank: "Aventurier" }
];

// ==========================================
// 3. SYNCHRONISATION EN TEMPS RÉEL (FIREBASE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initFirebaseLeaderboard();
});

function initFirebaseLeaderboard() {
    db.collection("leaderboard")
      .orderBy("score", "desc")
      .onSnapshot((snapshot) => {
          if (snapshot.empty) {
              seedDefaultParticipants();
              return;
          }

          let leaderboard = [];
          snapshot.forEach((doc) => {
              leaderboard.push(doc.data());
          });

          renderLeaderboardUI(leaderboard);
      }, (error) => {
          console.error("Erreur de synchronisation Firebase :", error);
      });
}

function seedDefaultParticipants() {
    const batch = db.batch();
    BASE_PARTICIPANTS.forEach((player) => {
        const ref = db.collection("leaderboard").doc(player.name);
        batch.set(ref, player, { merge: true });
    });
    batch.commit().catch(err => console.error("Erreur d'initialisation :", err));
}

/**
 * Mise à jour ciblée : préserve la totalité des autres participants dans la base
 */
async function updatePlayerXP(playerName, xpEarned) {
    if (xpEarned <= 0) return;

    const playerRef = db.collection("leaderboard").doc(playerName);

    try {
        const doc = await playerRef.get();
        if (doc.exists) {
            const currentData = doc.data();
            const newTotalScore = (currentData.score || 0) + xpEarned;

            await playerRef.set({
                score: newTotalScore
            }, { merge: true });
        } else {
            await playerRef.set({
                name: playerName,
                score: xpEarned,
                rank: "Joueur"
            }, { merge: true });
        }
    } catch (err) {
        console.error("Erreur de sauvegarde de l'XP :", err);
    }
}

function renderLeaderboardUI(leaderboard) {
    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    container.innerHTML = leaderboard.map((player, index) => `
        <div class="leaderboard-item ${player.name === currentPlayerName ? 'highlight-player' : ''}">
            <span class="rank">#${index + 1}</span>
            <span class="name">${player.name}</span>
            <span class="score">${player.score} XP</span>
        </div>
    `).join('');
}

// ==========================================
// 4. MOTEUR DU QUIZ (+10 XP PAR BONNE RÉPONSE)
// ==========================================
function startNewGame() {
    currentQuestions = getGameQuestions(10);
    currentQuestionIndex = 0;
    sessionXP = 0;

    const quizIntro = document.getElementById('quiz-intro');
    const quizBox = document.getElementById('quiz-box');

    if (quizIntro) quizIntro.style.display = 'none';
    if (quizBox) quizBox.style.display = 'block';

    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const q = currentQuestions[currentQuestionIndex];
    
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressText = document.getElementById('quiz-progress');

    if (questionText) questionText.textContent = q.question;
    if (progressText) progressText.textContent = `Question ${currentQuestionIndex + 1} / ${currentQuestions.length}`;

    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(index, q.correct);
            optionsContainer.appendChild(btn);
        });
    }
}

function handleAnswer(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) {
        sessionXP += 10; // +10 XP par bonne réponse
    }
    currentQuestionIndex++;
    displayQuestion();
}

async function endGame() {
    alert(`Épreuve terminée ! Gain pour cette session : +${sessionXP} XP.`);
    
    await updatePlayerXP(currentPlayerName, sessionXP);

    const quizIntro = document.getElementById('quiz-intro');
    const quizBox = document.getElementById('quiz-box');

    if (quizBox) quizBox.style.display = 'none';
    if (quizIntro) quizIntro.style.display = 'block';
}
