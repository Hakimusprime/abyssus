import { ChevronRight, Play } from "lucide-react";
import { Button } from "../components/ui/Button";

const data = {
  penseurs: {
    title: "Penseurs",
    color: "text-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    subs: ["Philosophie", "Psychologie", "Histoire", "Sciences", "Littérature"]
  },
  otaku: {
    title: "Otaku",
    color: "text-cyan-400",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.1)]",
    subs: ["Manga", "Anime", "Jeux vidéo", "Light Novel", "Webtoon"]
  },
  culture: {
    title: "Culture Générale",
    color: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    subs: ["Géographie", "Cinéma", "Musique", "Technologies", "Sports", "Culture mondiale"]
  }
};

export function Category({ id }: { id: keyof typeof data }) {
  const cat = data[id];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>Sanctuaire</span>
        <ChevronRight className="w-4 h-4" />
        <span className={cat.color}>{cat.title}</span>
      </div>

      <h1 className={`font-display text-4xl md:text-6xl mb-12 ${cat.color} drop-shadow-lg`}>
        Domaine : {cat.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cat.subs.map((sub, i) => (
          <div 
            key={i} 
            className={`glass-card p-6 rounded-2xl group cursor-pointer hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 ${cat.glow} hover:border-white/20`}
          >
            <h3 className="font-display text-xl text-white mb-2">{sub}</h3>
            <p className="text-sm text-muted-foreground mb-6">Explorez les archives et testez vos connaissances.</p>
            <Button variant="secondary" className="w-full justify-between group-hover:bg-white/10 group-hover:text-white border-0 bg-black/40">
              Lancer l'épreuve <Play className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
