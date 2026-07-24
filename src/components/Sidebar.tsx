import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, User, Brain, Gamepad2, Globe, Trophy,
  Gem, Target, Backpack, Users, Settings, LogOut,
  Menu, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RANKS } from '@/lib/firebase';

type NavItem = {
  to?: string;
  icon?: typeof Home;
  label?: string;
  color?: string;
  type?: 'divider';
};

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/profile', icon: User, label: 'Mon Profil' },
  { type: 'divider' },
  { to: '/penseurs', icon: Brain, label: 'Penseurs', color: 'text-amber-400' },
  { to: '/otaku', icon: Gamepad2, label: 'Otaku', color: 'text-cyan-400' },
  { to: '/culture', icon: Globe, label: 'Culture Generale', color: 'text-emerald-400' },
  { type: 'divider' },
  { to: '/leaderboards', icon: Trophy, label: 'Classements' },
  { to: '/relics', icon: Gem, label: 'Reliques' },
  { to: '/inventory', icon: Backpack, label: 'Inventaire' },
  { to: '/community', icon: Users, label: 'Communaute' },
  { type: 'divider' },
  { to: '/settings', icon: Settings, label: 'Parametres' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loginWithGoogle, logout } = useAuth();

  const rank = user ? (RANKS[user.rankIndex] || RANKS[0]) : RANKS[0];
  const maxHp = 10;
  const hpPercent = user ? (user.hp / maxHp) * 100 : 0;
  const nextRank = RANKS[user?.rankIndex ? user.rankIndex + 1 : 1] || RANKS[RANKS.length - 1];
  const prevRankThreshold = rank.threshold;
  const nextRankThreshold = nextRank.threshold;
  const xpProgress = user ? Math.max(0, user.xp - prevRankThreshold) : 0;
  const xpNeeded = nextRankThreshold - prevRankThreshold;
  const xpPercent = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 100;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 md:pb-0 scrollbar-thin">
      {/* Profile Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center bg-black/50 shadow-gold-glow shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-500/10 animate-pulse" />
            <span className="font-display text-2xl text-gold-500 relative z-10">
              {user ? user.pseudo.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-white truncate">{user ? user.pseudo : 'Invite'}</h3>
            <p className="text-xs text-cyan-400 font-medium tracking-wide">Rang {rank.name}</p>
          </div>
        </div>

        {user && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">HP</span>
                <span className="text-red-400 font-mono">{user.hp} / {maxHp}</span>
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${hpPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">XP</span>
                <span className="text-gold-500 font-mono">{user.xp.toLocaleString()}</span>
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-gold-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {navItems.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={`div-${idx}`} className="h-px bg-white/5 my-2 mx-2" />;
          }
          const Icon = item.icon!;
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className={`w-5 h-5 shrink-0 ${item.color ?? ''}`} />
              <span className="font-medium tracking-wide text-sm">{item.label}</span>
            </NavLink>
          );
        })}

        {user ? (
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 text-left mt-auto">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium tracking-wide text-sm">Deconnexion</span>
          </button>
        ) : (
          <button onClick={loginWithGoogle} className="flex items-center gap-4 px-4 py-3 rounded-xl text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 text-left mt-auto">
            <User className="w-5 h-5 shrink-0" />
            <span className="font-medium tracking-wide text-sm">Se connecter</span>
          </button>
        )}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 border-b border-white/5">
        <div className="font-display font-bold text-xl text-gold-500 tracking-widest">ABYSSUS</div>
        <button onClick={toggle} className="p-2 rounded-lg bg-white/5 text-white">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={toggle} />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 w-72 glass transform transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-white/5 mt-16 md:mt-0 h-screen shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent onNavigate={() => setIsOpen(false)} />
      </aside>
    </>
  );
}
