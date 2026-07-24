// import_quiz_batch.js
// Usage: node import_quiz_batch.js ./new_questions.json
// Pré-requis: GOOGLE_APPLICATION_CREDENTIALS pointant vers la clé du service account

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node import_quiz_batch.js ./new_questions.json");
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
if (!fs.existsSync(filePath)) {
  console.error("Fichier introuvable:", filePath);
  process.exit(1);
}

// Initialisation Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

// Validation stricte du schéma d'une question
function validateQuestion(q) {
  const errors = [];
  if (!q.domain || typeof q.domain !== "string") errors.push("domain manquant");
  if (!q.question || typeof q.question !== "string" || q.question.trim().length < 8) errors.push("question trop courte");
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push("choices doit être un tableau de 4 éléments");
  else {
    q.choices.forEach((c, i) => {
      if (!c || String(c).trim().length === 0) errors.push(`choice ${i} vide`);
    });
  }
  if (typeof q.correct !== "number" || q.correct < 0 || q.correct > 3) errors.push("correct doit être un indice entre 0 et 3");
  if (q.xp !== undefined && (typeof q.xp !== "number" || q.xp <= 0)) errors.push("xp invalide");
  return errors;
}

async function runImport() {
  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("JSON invalide:", e.message);
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error("Le fichier doit contenir un tableau de questions.");
    process.exit(1);
  }

  const importRef = db.collection("imports").doc();
  const report = {
    fileName: path.basename(filePath),
    total: data.length,
    imported: 0,
    rejected: 0,
    errors: [],
    importedIds: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  const validPayloads = [];

  // 1. Phase de validation
  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    const errs = validateQuestion(q);
    if (errs.length) {
      report.rejected++;
      report.errors.push({
        index: i,
        question: q.question ? q.question.slice(0, 80) : "",
        reasons: errs
      });
      continue;
    }

    const docRef = db.collection("customQuestions").doc();
    const payload = {
      domain: q.domain,
      difficulty: q.difficulty || "Débutant",
      xp: q.xp || 10,
      question: q.question,
      choices: q.choices,
      correct: q.correct,
      source: q.source || "import",
      createdBy: q.createdBy || "import-script",
      status: q.status || "approved", // "approved" par défaut pour un import admin (ou "pending" selon besoin)
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    validPayloads.push({ ref: docRef, data: payload });
  }

  // 2. Phase d'écriture par lots (max 400 opérations par batch)
  const BATCH_SIZE = 400;
  for (let i = 0; i < validPayloads.length; i += BATCH_SIZE) {
    const chunk = validPayloads.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach((item) => {
      batch.set(item.ref, item.data);
      report.importedIds.push(item.ref.id);
      report.imported++;
    });

    await batch.commit();
    console.log(`Lot importé : ${report.imported}/${validPayloads.length}`);
  }

  // 3. Sauvegarde du rapport d'importation
  await importRef.set(report);

  console.log("\n==========================================");
  console.log(`Import terminé : ${report.imported} importées, ${report.rejected} rejetées.`);
  if (report.errors.length) {
    console.log("Détail des erreurs :", JSON.stringify(report.errors, null, 2));
  }
  console.log("Rapport sauvegardé sous le ID :", importRef.id);
  console.log("==========================================\n");
}

runImport().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
