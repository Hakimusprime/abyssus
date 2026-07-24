import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, Zap, ArrowRight, Calendar } from 'lucide-react';
import { supabase, type AbyssEvent, type Quiz } from '@/lib/supabase';

export default function EventsList() {
  const [events, setEvents] = useState<AbyssEvent[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: evts } = await supabase.from('events').select('*').order('starts_at', { ascending: false });
      const { data: qs } = await supabase.from('quizzes').select('*');
      const quizMap: Record<string, Quiz> = {};
      (qs as Quiz[] ?? []).forEach(q => { quizMap[q.id] = q; });
      setEvents(evts as AbyssEvent[] ?? []);
      setQuizzes(quizMap);
      setLoading(false);
    })();
  }, []);

  const now = new Date();
  const live = events.filter(e => e.is_active && new Date(e.starts_at) <= now && new Date(e.ends_at) > now);
  const upcoming = events.filter(e => e.is_active && new Date(e.starts_at) > now);
  const past = events.filter(e => !e.is_active || new Date(e.ends_at) <= now);

  const renderEvent = (ev: AbyssEvent) => {
    const linkedQuiz = ev.quiz_id ? quizzes[ev.quiz_id] : null;
    const isLive = new Date(ev.starts_at) <= now && new Date(ev.ends_at) > now && ev.is_active;
    return (
      <div key={ev.id} className={`glass-card rounded-xl p-5 ${isLive ? 'border-red-600/30 shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLive ? 'bg-red-500/15 border border-red-600/30' : 'bg-black/40 border border-white/5'}`}>
            <Sparkles className={`w-6 h-6 ${isLive ? 'text-red-400' : 'text-slate-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isLive && <span className="badge bg-red-500/15 text-red-300 border border-red-600/30 animate-pulse-portal">EN DIRECT</span>}
              <span className="flex items-center gap-1 text-xs text-gold-500"><Zap className="w-3 h-3" />+{ev.bonus_xp} XP</span>
            </div>
            <h3 className="font-display font-semibold text-white">{ev.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{ev.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ev.starts_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ev.ends_at).toLocaleDateString()}</span>
            </div>
            {linkedQuiz && (
              <Link to={`/quiz/${linkedQuiz.id}`} className="btn-primary text-sm mt-4 inline-flex">
                Jouer: {linkedQuiz.title}<ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-red-400" />
          <h1 className="font-display text-3xl font-bold text-white">Evenements Boss</h1>
        </div>
        <p className="text-slate-500 mt-1">Defis temporaires avec bonus d'XP</p>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />)}</div>
      ) : (
        <>
          {live.length > 0 && <section><h2 className="font-display text-lg font-semibold text-red-400 mb-4">En Direct</h2><div className="space-y-3">{live.map(renderEvent)}</div></section>}
          {upcoming.length > 0 && <section><h2 className="font-display text-lg font-semibold text-cyan-400 mb-4">A Venir</h2><div className="space-y-3">{upcoming.map(renderEvent)}</div></section>}
          {live.length === 0 && upcoming.length === 0 && past.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Sparkles className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">Aucun evenement pour le moment.</p>
              <Link to="/catalog" className="btn-ghost mt-4 inline-flex">Explorer les Quiz</Link>
            </div>
          )}
          {past.length > 0 && <section><h2 className="font-display text-lg font-semibold text-slate-600 mb-4">Evenements Passes</h2><div className="space-y-3 opacity-50">{past.map(renderEvent)}</div></section>}
        </>
      )}
    </div>
  );
}
