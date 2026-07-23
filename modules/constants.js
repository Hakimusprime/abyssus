/**
 * Abyssus - Game Constants
 * Centralized configuration for game mechanics, domains, and progression
 */

const GAME_CONFIG = {
  // Player progression
  INITIAL_LEVEL: 1,
  INITIAL_XP: 0,
  INITIAL_HP: 100,
  XP_PER_LEVEL: 100,
  HP_MAX: 100,
  
  // Domain system
  DOMAINS: [
    { id: 'philosophy', name: 'Philosophie', icon: '🧠', color: '#7c3aed', description: 'Explore les grands penseurs' },
    { id: 'manga', name: 'Manga', icon: '📚', color: '#f59e0b', description: 'Découvre les univers manga' },
    { id: 'anime', name: 'Anime', icon: '🎬', color: '#3b82f6', description: 'Plonge dans les anime' },
    { id: 'culture', name: 'Culture Générale', icon: '🌍', color: '#10b981', description: 'Élargis tes connaissances' },
    { id: 'history', name: 'Histoire', icon: '📖', color: '#8b5cf6', description: 'Remonte le temps' },
    { id: 'science', name: 'Sciences', icon: '🔬', color: '#06b6d4', description: 'Découvre les mystères' },
    { id: 'literature', name: 'Littérature', icon: '✍️', color: '#ec4899', description: 'Explore les œuvres' },
    { id: 'gaming', name: 'Jeux Vidéo', icon: '🎮', color: '#f97316', description: 'Maîtrise les jeux' },
    { id: 'technology', name: 'Technologie', icon: '⚙️', color: '#6366f1', description: 'Comprends le futur' },
    { id: 'arts', name: 'Arts', icon: '🎨', color: '#f43f5e', description: 'Célèbre la créativité' }
  ],
  
  // Rarity system for relics
  RARITY_LEVELS: [
    { name: 'Commun', color: '#94a3b8', multiplier: 1 },
    { name: 'Rare', color: '#3b82f6', multiplier: 1.5 },
    { name: 'Légendaire', color: '#fbbf24', multiplier: 2 },
    { name: 'Mythique', color: '#a78bfa', multiplier: 3 }
  ],
  
  // Boss difficulty tiers
  BOSS_DIFFICULTY: [
    { level: 1, name: 'Facile', multiplier: 1 },
    { level: 2, name: 'Normal', multiplier: 1.5 },
    { level: 3, name: 'Difficile', multiplier: 2 },
    { level: 4, name: 'Cauchemar', multiplier: 3 }
  ],
  
  // Titles progression tiers
  TITLE_THRESHOLDS: {
    apprentice: 0,
    initiate: 50,
    adept: 150,
    master: 300,
    legend: 500
  }
};

const STORAGE_KEYS = {
  PLAYER_DATA: 'abyssus_player_data',
  GAME_STATE: 'abyssus_game_state',
  INVENTORY: 'abyssus_inventory',
  ACHIEVEMENTS: 'abyssus_achievements',
  COMMUNITY_POSTS: 'abyssus_community_posts'
};