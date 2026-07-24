import type { LucideIcon } from 'lucide-react';
import {
  Waves, Fish, Shell, Anchor, Compass, Brain, Globe2, FlaskConical,
  Mountain, Leaf, Dna, Atom, BookOpen, Microscope, Zap, Droplet, Skull, Telescope,
  Sword, Shield, Gem, FlaskRound, Crown, Sparkles, Gamepad2, Globe,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Waves, Fish, Shell, Anchor, Compass, Brain, Globe2, FlaskConical,
  Mountain, Leaf, Dna, Atom, BookOpen, Microscope, Zap, Droplet, Skull, Telescope,
  Sword, Shield, Gem, FlaskRound, Crown, Sparkles, Gamepad2, Globe,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Waves;
}

export const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Peu Profond', color: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40' },
  normal: { label: 'Moyen', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40' },
  hard: { label: 'Profond', color: 'text-amber-400 bg-amber-950/30 border-amber-800/40' },
  abyssal: { label: 'Abyssal', color: 'text-red-400 bg-red-950/30 border-red-800/40' },
};

export function difficultyBadge(diff: string) {
  const cfg = difficultyConfig[diff] ?? difficultyConfig.normal;
  return <span className={`badge border ${cfg.color}`}>{cfg.label}</span>;
}

export const rarityConfig: Record<string, { label: string; color: string; border: string; glow: string }> = {
  common: { label: 'Commun', color: 'text-slate-300', border: 'border-slate-600', glow: '' },
  rare: { label: 'Rare', color: 'text-cyan-400', border: 'border-cyan-600/60', glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' },
  epic: { label: 'Epique', color: 'text-amber-400', border: 'border-amber-600/60', glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]' },
  legendary: { label: 'Legendaire', color: 'text-gold-500', border: 'border-gold-600/60', glow: 'shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)]' },
  abyssal: { label: 'Abyssal', color: 'text-red-400', border: 'border-red-600/60', glow: 'shadow-[0_0_25px_-3px_rgba(239,68,68,0.4)]' },
};

export function rarityBadge(rarity: string) {
  const cfg = rarityConfig[rarity] ?? rarityConfig.common;
  return <span className={`badge border ${cfg.color} bg-slate-900/40 ${cfg.border}`}>{cfg.label}</span>;
}
