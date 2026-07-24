import { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, Award, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RANKS } from '@/lib/firebase';

export default function Leaderboard() {
  const { user } = useAuth();
  const [loading] = useState(false);

  const getMedal = (idx: number) => {
    if (idx === 0) return { icon: Crown, color: 'text-gold-500', bg: 'from-gold-500/15 to-transparent', border: 'border-gold-600/30' };
    if (idx === 1) return { icon: Medal, color: 'text-slate-300', bg: 'from-slate-400/15 to-transparent', border: 'border-slate-500/30' };
    if (idx === 2) return { icon: Award, color: 'text-amber-700', bg: 'from-amber-800/15 to-transparent', border: 'border-amber-800/30' };
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-gold-500" />
          <h1 className="font-display text-3xl font-bold text-white">Classements</h1>
        </div>
        <p className="text-slate-500 mt-1">Les plongeurs les plus profonds, ranges par XP</p>
      </div>

      {user && (
        <div className="glass-card rounded-2xl p-6 border border-cyan-600/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black/50 border-2 border-gold/30 flex items-center justify-center text-xl font-display font-bold text-gold-500 shadow-gold-glow shrink-0">
              {user.pseudo.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-display text-lg text-white">{user.pseudo}</p>
              <p className="text-sm text-cyan-400">Rang {RANKS[user.rankIndex]?.name}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-gold-500">{user.xp.toLocaleString()}</p>
              <p className="text-xs text-slate-600">XP Total</p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-8 text-center">
        <Trophy className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500">Le classement global sera disponible prochainement.</p>
        <p className="text-sm text-slate-600 mt-2">Connectez-vous et gagnez de l'XP pour grimper dans le classement !</p>
      </div>
    </div>
  );
}
