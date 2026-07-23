/**
 * Abyssus - Cloud Data Manager
 * Handles Firebase authentication and real-time database operations
 */

import { 
  auth, 
  database, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  onValue, 
  push 
} from './firebase-config.js';

class CloudDataManager {
  constructor() {
    this.currentUser = null;
    this.playerProfile = null;
    this.listeners = new Map();
    this.initAuthListener();
  }

  // Authentication
  initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        console.log('✅ Utilisateur connecté:', user.email);
        await this.loadPlayerProfile(user.uid);
        this.setupRealtimeListeners(user.uid);
      } else {
        this.currentUser = null;
        this.playerProfile = null;
        console.log('❌ Utilisateur déconnecté');
      }
    });
  }

  async register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create player profile
      const playerProfile = {
        uid: user.uid,
        email: email,
        username: username,
        level: GAME_CONFIG.INITIAL_LEVEL,
        xp: GAME_CONFIG.INITIAL_XP,
        hp: GAME_CONFIG.INITIAL_HP,
        maxHP: GAME_CONFIG.HP_MAX,
        domainXP: {},
        titles: [],
        badges: [],
        inventory: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      await set(ref(database, `players/${user.uid}`), playerProfile);
      console.log('✅ Profil créé:', username);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erreur inscription:', error.message);
      return { success: false, error: error.message };
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie:', email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Erreur connexion:', error.message);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Player Profile
  async loadPlayerProfile(uid) {
    try {
      const snapshot = await get(ref(database, `players/${uid}`));
      if (snapshot.exists()) {
        this.playerProfile = snapshot.val();
        console.log('✅ Profil chargé');
        return this.playerProfile;
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error.message);
    }
  }

  async updatePlayerProfile(uid, updates) {
    try {
      await update(ref(database, `players/${uid}`), {
        ...updates,
        lastActive: new Date().toISOString()
      });
      this.playerProfile = { ...this.playerProfile, ...updates };
      console.log('✅ Profil mis à jour');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error.message);
      return { success: false, error: error.message };
    }
  }

  async addXPToPlayer(uid, amount, domain) {
    try {
      const playerRef = ref(database, `players/${uid}`);
      const snapshot = await get(playerRef);
      const player = snapshot.val();

      const newXP = (player.xp || 0) + amount;
      const domainXP = player.domainXP || {};
      if (domain) {
        domainXP[domain] = (domainXP[domain] || 0) + amount;
      }

      await update(playerRef, {
        xp: newXP,
        domainXP: domainXP
      });

      console.log(`✅ +${amount} XP (${domain || 'Général'})`);
      return { success: true, newXP };
    } catch (error) {
      console.error('❌ Erreur XP:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Community Posts
  async createCommunityPost(uid, username, postData) {
    try {
      const postsRef = ref(database, 'community/posts');
      const newPostRef = push(postsRef);

      await set(newPostRef, {
        uid: uid,
        username: username,
        title: postData.title,
        content: postData.content,
        domain: postData.domain,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Post créé');
      return { success: true, postId: newPostRef.key };
    } catch (error) {
      console.error('❌ Erreur création post:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getCommunityPosts(domain = null) {
    try {
      const snapshot = await get(ref(database, 'community/posts'));
      if (snapshot.exists()) {
        const posts = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
        const filtered = domain 
          ? posts.filter(p => p.domain === domain)
          : posts;
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return [];
    } catch (error) {
      console.error('❌ Erreur chargement posts:', error.message);
      return [];
    }
  }

  async likePost(postId) {
    try {
      const postRef = ref(database, `community/posts/${postId}`);
      const snapshot = await get(postRef);
      const post = snapshot.val();
      
      await update(postRef, {
        likes: (post.likes || 0) + 1
      });

      console.log('✅ Post aimé');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur like:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Real-time Listeners
  setupRealtimeListeners(uid) {
    // Listen to player profile updates
    const playerRef = ref(database, `players/${uid}`);
    const playerListener = onValue(playerRef, (snapshot) => {
      if (snapshot.exists()) {
        this.playerProfile = snapshot.val();
        this.notifyListeners('player:updated', this.playerProfile);
      }
    });
    this.listeners.set('player', playerListener);

    // Listen to community posts
    const postsRef = ref(database, 'community/posts');
    const postsListener = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const posts = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data
        }));
        this.notifyListeners('posts:updated', posts);
      }
    });
    this.listeners.set('posts', postsListener);
  }

  // Global Rankings
  async getGlobalRankings(limit = 50) {
    try {
      const snapshot = await get(ref(database, 'players'));
      if (snapshot.exists()) {
        const players = Object.entries(snapshot.val()).map(([uid, data]) => ({
          uid,
          ...data
        }));
        return players
          .sort((a, b) => b.xp - a.xp)
          .slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('❌ Erreur classement:', error.message);
      return [];
    }
  }

  // Event System
  notifyListeners(eventName, data) {
    if (window.eventsSystem) {
      window.eventsSystem.emit(eventName, data);
    }
  }

  // Inventory Management
  async addRelic(uid, relic) {
    try {
      const playerRef = ref(database, `players/${uid}`);
      const snapshot = await get(playerRef);
      const player = snapshot.val();
      const inventory = player.inventory || [];

      inventory.push({
        id: `relic_${Date.now()}`,
        ...relic,
        obtainedAt: new Date().toISOString()
      });

      await update(playerRef, { inventory });
      console.log('✅ Relique obtenue');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur ajout relique:', error.message);
      return { success: false, error: error.message };
    }
  }
}

const cloudDataManager = new CloudDataManager();

export default cloudDataManager;