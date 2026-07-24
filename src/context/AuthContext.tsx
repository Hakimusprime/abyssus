import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseAuthUser, signInWithPopup } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

interface AppUser {
  uid: string;
  pseudo: string;
  email: string;
  xp: number;
  hp: number;
  rankIndex: number;
  role: string;
  titles: string[];
  activeTitle: string;
  relics: number[];
  joinedAt: number;
  lastDeathAt?: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  loginWithGoogle: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = doc(db, "users", result.user.uid);
      const snap = await getDoc(userDoc);
      
      if (!snap.exists()) {
        // Initialiser un nouveau joueur
        await setDoc(userDoc, {
          pseudo: result.user.displayName || "Novice Abyssal",
          email: result.user.email,
          xp: 0,
          hp: 10,
          rankIndex: 0,
          role: "user",
          joinedAt: Date.now()
        });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const logout = () => {
    auth.signOut();
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        // Subscribe to real-time updates for the user profile
        const unsubscribeDoc = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUser({
              uid: firebaseUser.uid,
              pseudo: data.pseudo || "Inconnu",
              email: data.email || "",
              xp: data.xp || 0,
              hp: data.hp ?? 10,
              rankIndex: data.rankIndex || 0,
              role: data.role || "user",
              titles: data.titles || [],
              activeTitle: data.activeTitle || "",
              relics: data.relics || [],
              joinedAt: data.joinedAt || Date.now(),
              lastDeathAt: data.lastDeathAt
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
        
        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
