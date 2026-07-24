import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Zap, ArrowRight, Search } from 'lucide-react';
import { supabase, type Category, type Quiz } from '@/lib/supabase';
import { getIcon, difficultyBadge } from '@/lib/ui';

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [quizzes, setQuizzes] = useState<(Quiz & { category_name?: string })[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: qs }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('quizzes').select('*, categories(name)').order('created_at', { ascending: false }),
      ]);
      setCategories(cats as Category[] ?? []);
      setQuizzes((qs as (Quiz & { categories?: { name: string } })[])?.map(q => ({ ...q, category_name: q.categories?.name })) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = quizzes.filter((q) => {
    const matchCat = filter === 'all' || q.category_id === filter;
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LayoutGrid className="w-7 h-7 text-cyan-400" />
          <h1 className="font-display text-3xl font-bold text-white">Catalogue</h1>
        </div>
        <p className="text-slate-500">Parcourez tous les domaines et quiz</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="input-field pl-11" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-600/40' : 'bg-black/30 text-slate-500 hover:text-white hover:bg-white/5 border border-white/5'}`}>Tous</button>
        {categories.map((c) => {
          const Icon = getIcon(c.icon);
          return (
            <button key={c.id} onClick={() => setFilter(c.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === c.id ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-600/40' : 'bg-black/30 text-slate-500 hover:text-white hover:bg-white/5 border border-white/5'}`}>
              <Icon className="w-4 h-4" />{c.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />)
          : filtered.length === 0
          ? <div className="col-span-full text-center py-16 text-slate-600">Aucun quiz trouve.</div>
          : filtered.map((q) => (
              <Link key={q.id} to={`/quiz/${q.id}`} className="abyss-card overflow-hidden group">
                <div className={`h-24 bg-gradient-to-r ${q.cover_gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid opacity-30" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600">{q.category_name}</span>
                    {difficultyBadge(q.difficulty)}
                  </div>
                  <h3 className="font-display font-semibold text-white group-hover:text-cyan-300 transition-colors">{q.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{q.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-gold-500" />{q.xp_reward} XP</span>
                      <span>~{q.estimated_minutes} min</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
