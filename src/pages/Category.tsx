import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase, type Category, type Quiz } from '@/lib/supabase';
import { getIcon, difficultyBadge } from '@/lib/ui';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      let cat = null;
      if (slug === 'penseurs' || slug === 'otaku' || slug === 'culture') {
        const { data } = await supabase.from('categories').select('*').ilike('slug', `%${slug}%`).maybeSingle();
        cat = data;
      } else {
        const { data } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
        cat = data;
      }
      setCategory(cat as Category | null);
      if (cat) {
        const { data: qs } = await supabase.from('quizzes').select('*').eq('category_id', cat.id).order('created_at', { ascending: false });
        setQuizzes(qs as Quiz[] ?? []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" /></div>;

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Domaine introuvable.</p>
        <Link to="/catalog" className="btn-ghost mt-4">Retour au Catalogue</Link>
      </div>
    );
  }

  const Icon = getIcon(category.icon);

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <section className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ backgroundColor: category.color }} />
        <div className="relative flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-black/40 border border-white/10" style={{ color: category.color }}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
              <Link to="/catalog" className="hover:text-cyan-400">Catalogue</Link>
              <ChevronRight className="w-3 h-3" />
              <span>{category.name}</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">{category.description}</p>
            <p className="text-sm text-slate-600 mt-3">{quizzes.length} quiz disponible{quizzes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </section>

      {quizzes.length === 0 ? (
        <div className="text-center py-20"><p className="text-slate-500">Aucun quiz dans ce domaine pour le moment.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <Link key={q.id} to={`/quiz/${q.id}`} className="abyss-card overflow-hidden group">
              <div className={`h-24 bg-gradient-to-r ${q.cover_gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-grid opacity-30" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  {difficultyBadge(q.difficulty)}
                  <span className="text-xs text-slate-600">~{q.estimated_minutes} min</span>
                </div>
                <h3 className="font-display font-semibold text-white group-hover:text-cyan-300 transition-colors">{q.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{q.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="flex items-center gap-1 text-xs text-slate-600"><Zap className="w-3.5 h-3.5 text-gold-500" />{q.xp_reward} XP</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
