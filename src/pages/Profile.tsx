import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Zap, Trophy, Clock, TrendingUp, Award, Edit3, Save, Loader2, Heart, Lock, Gem } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RANKS, getRankIndex } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [saving, setSaving] = useState(false);
  const [hpTimer, setHpTimer] = useState('');

  useEffect(() => {
    if (user) setPseudo(user.pseudo);
  }, [user]);

  useEffect(() => {
    if (!user || user.hp > 0 || !user.lastDeathAt) {
      setHpTimer('');
      return;
    }
    const updateTimer = () => {
      const elapsed = Date.now() - user.lastDeathAt!;
      const remaining = Math.max(0, 3600000 - elapsed);
      if (remaining <= 0) {
        setHpTimer('Regeneration...');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setHpTimer(`${mins}m ${String(secs).padStart(2, '0')}s`);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { pseudo: pseudo.trim() });
    } catch (err) {
      console.error('Update error:', err);
    }
    setEditing(false);
    setSaving(false);
  };

  if (!user) return null;

  const rank = RANKS[user.rankIndex] || RANKS[0];
  const nextRank = RANKS[user.rankIndex + 1] || RANKS[RANKS.length - 1];
  const xpProgress = Math.max(0, user.xp - rank.threshold);
  const xpNeeded = nextRank.threshold - rank.threshold;
  const xpPercent = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 100;
  const hpPercent = (user.hp / 10) * 100;
  const canChangeAvatar = user.rankIndex >= 5;

  const stats = [
    { icon: Zap, label: 'XP Total', value: user.xp.toLocaleString(), color: 'text-gold-500' },
    { icon: Trophy, label: 'Rang', value: rank.name, color: 'text-cyan-400' },
    { icon: Heart, label: 'HP', value: `${user.hp}/10`, color: 'text-red-400' },
    { icon: Gem, label: 'Reliques', value: user.relics.length, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-black/50 border-2 border-gold/30 flex items-center justify-center text-3xl font-display font-bold text-gold-500 shadow-gold-glow shrink-0">
              {user.pseudo.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-display font-bold text-cyan-400">{rank.name}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} className="input-field" placeholder="Pseudo" />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Sauvegarder
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-ghost text-sm">Annuler</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-white">{user.pseudo}</h1>
                  <button onClick={() => setEditing(true)} className="text-slate-600 hover:text-cyan-400 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-cyan-400/80 mt-1 flex items-center gap-1.5"><Award className="w-4 h-4" /> Rang {rank.name}</p>
              </>
            )}

            {/* XP bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>XP</span>
                <span className="text-gold-500 font-mono">{user.xp.toLocaleString()} / {nextRank.threshold.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-white/5">
                <div className="h-full bg-gold-500 transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: `${xpPercent}%` }} />
              </div>
              <p className="text-xs text-slate-600 mt-1">Prochain rang: {nextRank.name} ({xpNeeded - xpProgress} XP restant)</p>
            </div>

            {/* HP bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600">HP</span>
                <span className="text-red-400 font-mono">{user.hp} / 10</span>
              </div>
              <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-white/5">
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${hpPercent}%` }} />
              </div>
              {user.hp <= 0 && hpTimer && (
                <p className="text-xs text-red-400/70 mt-1.5">Regeneration dans {hpTimer}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Avatar unlock */}
      {!canChangeAvatar && (
        <div className="flex items-center gap-3 rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-sm text-slate-500">
          <Lock className="w-4 h-4 text-slate-600" />
          Photo de profil personnalisee debloquee au Rang A (Niv 5). Rang actuel: {rank.name}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-xl p-4 sm:p-5">
              <Icon className={`w-5 h-5 mb-2 ${s.color}`} />
              <p className="font-display text-xl sm:text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Reliques */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-white">Reliques</h2>
          <span className="text-sm text-slate-600">{user.relics.length} objet{user.relics.length !== 1 ? 's' : ''}</span>
        </div>
        {user.relics.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Gem className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">Aucune relique pour le moment. Gagnez-les lors d'evenements speciaux !</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Reliques: {user.relics.join(', ')}</p>
        )}
      </section>

      {/* Call to action */}
      <section className="glass-card rounded-2xl p-8 text-center">
        <User className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-400">Continuez votre exploration des abysses</p>
        <Link to="/catalog" className="btn-primary mt-4 inline-flex">Explorer les Quiz</Link>
      </section>
    </div>
  );
}
