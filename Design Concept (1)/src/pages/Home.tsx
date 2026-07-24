import { Link } from "react-router";
import { Brain, Gamepad2, Globe, ChevronRight } from "lucide-react";
import { cn } from "../components/ui/Button";

const categories = [
  {
    id: "penseurs",
    title: "Penseurs",
    desc: "Philosophie, Psychologie, Histoire, Sciences, Littérature.",
    icon: Brain,
    color: "text-amber-400",
    bg: "from-amber-900/20 to-black",
    border: "group-hover:border-amber-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    path: "/penseurs"
  },
  {
    id: "otaku",
    title: "Otaku",
    desc: "Manga, Anime, Jeux vidéo, Light Novel, Webtoon.",
    icon: Gamepad2,
    color: "text-cyan-400",
    bg: "from-cyan-900/20 to-black",
    border: "group-hover:border-cyan-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    path: "/otaku"
  },
  {
    id: "culture",
    title: "Culture Générale",
    desc: "Géographie, Cinéma, Musique, Technologies, Sports.",
    icon: Globe,
    color: "text-emerald-400",
    bg: "from-emerald-900/20 to-black",
    border: "group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    path: "/culture"
  }
];

export function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center md:text-left py-8 md:py-12 relative">
        <h1 className="font-display text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold tracking-wider mb-4 drop-shadow-sm">
          ABYSSUS
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Plongez dans les profondeurs de la connaissance. Affrontez les épreuves, survivez aux abysses.
        </p>
        
        {/* Subtle Portal Event Notification (Mock) */}
        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/30 bg-red-950/20 text-red-200 text-sm backdrop-blur-md animate-pulse-portal">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Un portail vers le Léviathan s'est ouvert dans les abysses...
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} to={cat.path} className="block group">
            <div className={cn(
              "relative h-full overflow-hidden rounded-2xl glass-card transition-all duration-500 transform group-hover:-translate-y-2",
              cat.border,
              cat.glow
            )}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", cat.bg)} />
              
              <div className="relative p-8 h-full flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                  <cat.icon className={cn("w-7 h-7", cat.color)} />
                </div>
                
                <h2 className="font-display text-2xl mb-3 text-white group-hover:text-white transition-colors">{cat.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {cat.desc}
                </p>
                
                <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto">
                  <span>Explorer le domaine</span>
                  <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
