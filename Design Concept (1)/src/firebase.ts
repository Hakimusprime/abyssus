import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7OxNqHBiVsCNxdhatWRY1WUHYPaO1AmM",
  authDomain: "abyssus-1eb8b.firebaseapp.com",
  projectId: "abyssus-1eb8b",
  storageBucket: "abyssus-1eb8b.firebasestorage.app",
  messagingSenderId: "801360821944",
  appId: "1:801360821944:web:fb267bd710f067bf027e4d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db).catch(() => {});
} catch (e) {}

// --- RANKS ---
export const RANKS = [
  { name: "F", threshold: 0 },
  { name: "E", threshold: 100 },
  { name: "D", threshold: 250 },
  { name: "C", threshold: 500 },
  { name: "B", threshold: 900 },
  { name: "A", threshold: 1500 },
  { name: "S", threshold: 2400 },
  { name: "SS", threshold: 3600 },
  { name: "SSS", threshold: 5200 },
  { name: "Abyss", threshold: 7200 }
];

export function getRankIndex(xp: number) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].threshold) idx = i;
  }
  return idx;
}
