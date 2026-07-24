import { useEffect, useState, type FormEvent } from 'react';
import { Lightbulb, Send, ThumbsUp, Trash2, Loader2, X } from 'lucide-react';
import { supabase, type Suggestion } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'quiz-idea', label: 'Idee de Quiz' },
  { value: 'feature', label: 'Fonctionnalite' },
  { value: 'bug', label: 'Bug' },
  { value: 'content', label: 'Contenu' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'text-slate-400 bg-slate-800/40 border-slate-600/50' },
  reviewing: { label: 'En revue', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40' },
  approved: { label: 'Approuve', color: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40' },
  rejected: { label: 'Refuse', color: 'text-red-400 bg-red-950/30 border-red-800/40' },
};

export default function Community() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  const loadSuggestions = async () => {
    const { data } = await supabase.from('suggestions').select('*').order('votes', { ascending: false }).order('created_at', { ascending: false });
    setSuggestions((data as Suggestion[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadSuggestions(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    await supabase.from('suggestions').insert({
      author_name: user.pseudo,
      title: title.trim(),
      description: description.trim(),
      category,
    });
    setTitle(''); setDescription(''); setCategory('general'); setShowForm(false);
    setSubmitting(false);
    loadSuggestions();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-gold-500" />
            <h1 className="font-display text-3xl font-bold text-white">Communaute</h1>
          </div>
          <p className="text-slate-500 mt-1">Partagez vos idees et votez pour celles des autres</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm shrink-0">
            {showForm ? <X className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {showForm ? 'Annuler' : 'Proposer une Idee'}
          </button>
        )}
      </div>

      {showForm && user && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-500">Titre</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field mt-1" placeholder="Titre court et descriptif" required maxLength={100} />
          </div>
          <div>
            <label className="text-sm text-slate-500">Categorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field mt-1">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field mt-1 min-h-[100px]" placeholder="Decrivez votre idee..." required maxLength={500} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Envoyer
          </button>
        </form>
      )}

      {!user && (
        <div className="rounded-xl bg-amber-950/20 border border-amber-800/30 p-4 text-sm text-amber-300">
          Connectez-vous pour proposer des idees et voter.
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)
        ) : suggestions.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Lightbulb className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">Aucune idee pour le moment. Soyez le premier !</p>
          </div>
        ) : (
          suggestions.map((s) => {
            const sc = statusConfig[s.status] ?? statusConfig.pending;
            const catLabel = categories.find(c => c.value === s.category)?.label ?? s.category;
            return (
              <div key={s.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-black/40 border border-white/5 px-3 py-2 shrink-0">
                    <ThumbsUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">{s.votes}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-semibold text-white">{s.title}</h3>
                      <span className={`badge border ${sc.color}`}>{sc.label}</span>
                      <span className="badge bg-black/40 text-slate-500 border border-white/5">{catLabel}</span>
                    </div>
                    <p className="text-sm text-slate-400">{s.description}</p>
                    <p className="text-xs text-slate-600 mt-3">par {s.author_name} · {new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
