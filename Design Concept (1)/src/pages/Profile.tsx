import { PenSquare, Award, Clock, Star, Gem } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { RANKS } from "../firebase";

export function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gold">Synchronisation avec les archives...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="font-display text-2xl mb-4 text-red-400">Accès Refusé</h2>
        <p className="text-muted-foreground mb-6">Vous devez vous connecter pour voir votre profil.</p>
        <Button variant="primary" onClick={loginWithGoogle}>Se connecter avec Google</Button>
      </div>
    );
  }

  const rank = RANKS[user.rankIndex] || RANKS[0];
  const canUploadAvatar = user.rankIndex >= 5; // Rang A (Niv 5) pour débloquer
  
  // Simulation de la régen HP dans l'UI (le vrai calcul se fait côté serveur/firebase)
  const timeRemaining = user.lastDeathAt ? Math.max(0, 3600000 - (Date.now() - user.lastDeathAt)) : 0;
  const minutesLeft = Math.floor(timeRemaining / 60000);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Top Banner & Header */}
      <div className="relative mt-8">
        <div className="absolute -top-12 inset-x-0 h-48 bg-gradient-to-b from-cyan-900/20 to-transparent rounded-t-3xl -z-10 blur-xl" />
        
        <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-gold/40 flex items-center justify-center bg-black shadow-gold-glow relative z-10 overflow-hidden">
              <span className="font-display text-5xl text-gold">{user.pseudo.charAt(0).toUpperCase()}</span>
              {canUploadAvatar ? (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PenSquare className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-col">
                  <div className="text-[10px] text-red-400 font-bold px-2 text-center uppercase tracking-widest">
                    🔒 Débloqué au Rang A
                  </div>
                </div>
              )}
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg border border-yellow-200">
              RANG {rank.name}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-4xl text-white mb-1 flex items-center justify-center md:justify-start gap-3">
                  {user.pseudo}
                  <button className="text-muted-foreground hover:text-white transition-colors">
                    <PenSquare className="w-4 h-4" />
                  </button>
                </h1>
                <p className="text-cyan-400 font-medium tracking-wide">{user.activeTitle || "Scholar of the Deep"}</p>
              </div>
              <Button variant="secondary" className="rounded-full px-6 bg-white/5 border border-white/10 hover:bg-white/10">
                Modifier le profil
              </Button>
            </div>

            <p className="text-muted-foreground text-sm max-w-lg mb-6 leading-relaxed flex items-center justify-center md:justify-start gap-2 group cursor-pointer">
              <span>"Seeking truths in the darkest trenches. Has contributed scrolls to the Archives."</span>
              <PenSquare className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>

            {/* Core Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">HP {user.hp === 0 && `(Régen: ${minutesLeft}m)`}</div>
                <div className="font-mono text-red-400">{user.hp} / 10</div>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">XP Total</div>
                <div className="font-mono text-gold">{user.xp.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Grid Layout for details */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" /> Statistiques de Survie
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-3xl font-display text-white mb-1">1,024</div>
                <div className="text-xs text-muted-foreground">Quiz Terminés</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-3xl font-display text-cyan-400 mb-1">84%</div>
                <div className="text-xs text-muted-foreground">Taux de Réussite</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <div className="text-3xl font-display text-red-400 mb-1">12</div>
                <div className="text-xs text-muted-foreground">Boss Vaincus</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" /> Historique Récent
            </h3>
            <div className="space-y-3">
              {[
                { n: "Philosophie Antique", s: "100%", d: "Il y a 2h", c: "text-amber-400" },
                { n: "Léviathan (Raid)", s: "Échec (0 HP)", d: "Il y a 3h", c: "text-red-400" },
                { n: "Evangelion Lore", s: "80%", d: "Hier", c: "text-cyan-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div>
                    <div className={`font-medium ${item.c}`}>{item.n}</div>
                    <div className="text-xs text-muted-foreground">{item.d}</div>
                  </div>
                  <div className="font-mono text-sm">{item.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Domaines Favoris
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-400">Philosophie</span>
                  <span className="text-muted-foreground font-mono">Niv. 18</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[75%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-400">Manga</span>
                  <span className="text-muted-foreground font-mono">Niv. 12</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-gold/20 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
            <h3 className="font-display text-xl mb-4 text-gold">Reliques Équipées</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-lg bg-black/50 border border-gold/20 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Gem className="w-6 h-6 text-gold/50" />
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">3 emplacements</p>
          </div>
        </div>

      </div>
    </div>
  );
}
