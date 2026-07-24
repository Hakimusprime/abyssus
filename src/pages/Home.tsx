import { Link } from 'react-router-dom';
import { Brain, Gamepad2, Globe, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const categories = [
  {
    id: 'penseurs',
    title: 'Penseurs',
    desc: "Philosophie, Psychologie, Histoire, Sciences, Litterature.",
    icon: Brain,
    color: 'text-amber-400',
    bg: 'from-amber-900/20 to-black',
    border: 'group-hover:border-amber-500/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    path: '/penseurs',
  },
  {
    id: 'otaku',
    title: 'Otaku',
    desc: 'Manga, Anime, Jeux video, Light Novel, Webtoon.',
    icon: Gamepad2,
    color: 'text-cyan-400',
    bg: 'from-cyan-900/20 to-black',
    border: 'group-hover:border-cyan-500/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    path: '/otaku',
  },
  {
    id: 'culture',
    title: 'Culture Generale',
    desc: 'Geographie, Cinema, Musique, Technologies, Sports.',
    icon: Globe,
    color: 'text-emerald-400',
    bg: 'from-emerald-900/20 to-black',
    border: 'group-hover:border-emerald-500/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    path: '/culture',
  },
];

export default function Home() {
  const { user, loginWithGoogle } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center md:text-left py-8 md:py-12 relative">
        <h1 className="font-display text-5xl md:text-7xl gradient-gold tracking-wider mb-4">
          ABYSSUS
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
          Plongez dans les profondeurs de la connaissance. Affrontez les epreuves, survivez aux abysses.
        </p>

        {/* Portal Event Notification */}
        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/30 bg-red-950/20 text-red-200 text-sm backdrop-blur-md animate-pulse-portal">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Un portail vers le Leviathan s'est ouvert dans les abysses...
        </div>

        {!user && (
          <div className="mt-8">
            <button onClick={loginWithGoogle} className="btn-primary">
              Se connecter avec Google
            </button>
          </div>
        )}
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.id} to={cat.path} className="block group">
              <div className={`relative h-full overflow-hidden rounded-2xl glass-card transition-all duration-500 transform group-hover:-translate-y-2 ${cat.border} ${cat.glow}`}>
                <div className={`absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100 ${cat.bg}`} />

                <div className="relative p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                    <Icon className={`w-7 h-7 ${cat.color}`} />
                  </div>

                  <h2 className="font-display text-2xl mb-3 text-white">{cat.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{cat.desc}</p>

                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto">
                    <span>Explorer le domaine</span>
                    <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      {user && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[
            { label: 'XP Total', value: user.xp.toLocaleString(), color: 'text-gold-500' },
            { label: 'Rang', value: RANKS_LABEL[user.rankIndex] ?? 'F', color: 'text-cyan-400' },
            { label: 'HP', value: `${user.hp}/10`, color: 'text-red-400' },
            { label: 'Reliques', value: user.relics.length, color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RANKS_LABEL = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Abyss'];
