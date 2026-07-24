import { useEffect, useState, type FormEvent } from 'react';
import { Crown, Plus, Trash2, Edit3, X, Save, Sparkles, Clock, Zap, Loader2 } from 'lucide-react';
import { supabase, type AbyssEvent, type Quiz } from '@/lib/supabase';
import { useEvents } from '@/context/EventContext';

export default function EventsBoss() {
  const { refresh } = useEvents();
  const [events, setEvents] = useState<AbyssEvent[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AbyssEvent | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quizId, setQuizId] = useState('');
  const [bonusXp, setBonusXp] = useState(100);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [eventType, setEventType] = useState<'boss' | 'special'>('boss');

  const loadData = async () => {
    const [{ data: evts }, { data: qs }] = await Promise.all([
      supabase.from('events').select('*').order('starts_at', { ascending: false }),
      supabase.from('quizzes').select('*').order('title'),
    ]);
    setEvents(evts as AbyssEvent[] ?? []);
    setQuizzes(qs as Quiz[] ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setTitle(''); setDescription(''); setQuizId(''); setBonusXp(100);
    setStartsAt(''); setEndsAt(''); setIsActive(true); setEventType('boss'); setEditing(null);
  };

  const saveEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title, description, quiz_id: quizId || null, bonus_xp: bonusXp,
      starts_at: new Date(startsAt).toISOString(), ends_at: new Date(endsAt).toISOString(),
      is_active: isActive, event_type: eventType,
    };
    if (editing) {
      await supabase.from('events').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('events').insert(payload);
    }
    resetForm(); setShowForm(false); setSaving(false); loadData(); refresh();
  };

  const editEvent = (ev: AbyssEvent) => {
    setEditing(ev);
    setTitle(ev.title); setDescription(ev.description); setQuizId(ev.quiz_id ?? '');
    setBonusXp(ev.bonus_xp); setStartsAt(ev.starts_at.slice(0, 16)); setEndsAt(ev.ends_at.slice(0, 16));
    setIsActive(ev.is_active); setEventType(ev.event_type === 'special' ? 'special' : 'boss');
    setShowForm(true);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    loadData(); refresh();
  };

  const toggleActive = async (ev: AbyssEvent) => {
    await supabase.from('events').update({ is_active: !ev.is_active }).eq('id', ev.id);
    loadData(); refresh();
  };

  const now = new Date();
  const getStatus = (ev: AbyssEvent) => {
    const start = new Date(ev.starts_at);
    const end = new Date(ev.ends_at);
    if (!ev.is_active) return { label: 'Inactif', color: 'text-slate-500 bg-slate-900/40 border-slate-700' };
    if (now < start) return { label: 'A venir', color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40' };
    if (now > end) return { label: 'Termine', color: 'text-slate-500 bg-slate-900/40 border-slate-700' };
    return { label: 'En Direct', color: 'text-red-400 bg-red-950/30 border-red-800/40' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <Crown className="w-7 h-7 text-amber-400" />
          <h1 className="font-display text-3xl font-bold text-white">Controle des Evenements</h1>
        </div>
        <p className="text-slate-500 mt-1">Gerer les evenements boss avec bonus d'XP</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Nouvel Evenement
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveEvent} className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-semibold text-white">{editing ? 'Modifier' : 'Creer un Evenement'}</span>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div><label className="text-sm text-slate-500">Titre</label><input value={title} onChange={e => setTitle(e.target.value)} className="input-field mt-1" required /></div>
          <div><label className="text-sm text-slate-500">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm text-slate-500">Quiz lie (optionnel)</label>
            <select value={quizId} onChange={e => setQuizId(e.target.value)} className="input-field mt-1">
              <option value="">Aucun quiz lie</option>
              {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </div>
          <div><label className="text-sm text-slate-500">Type d'evenement</label>
            <select value={eventType} onChange={e => setEventType(e.target.value as 'boss' | 'special')} className="input-field mt-1">
              <option value="boss">Boss (theme rouge oppressant)</option>
              <option value="special">Evenement Special (theme violet)</option>
            </select>
            <p className="text-xs text-slate-600 mt-1">Le theme du site s'adapte automatiquement quand l'evenement est en cours.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-500">Debut</label><input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="input-field mt-1" required /></div>
            <div><label className="text-sm text-slate-500">Fin</label><input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="input-field mt-1" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-slate-500">Bonus XP</label><input type="number" value={bonusXp} onChange={e => setBonusXp(Number(e.target.value))} className="input-field mt-1" /></div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 accent-cyan-500" />
                Actif
              </label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing ? 'Modifier' : 'Creer'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Aucun evenement. Creez-en un pour defier vos plongeurs !</p>
          </div>
        ) : (
          events.map(ev => {
            const status = getStatus(ev);
            const linkedQuiz = quizzes.find(q => q.id === ev.quiz_id);
            return (
              <div key={ev.id} className="glass rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`badge border ${status.color}`}>{status.label}</span>
                      <span className="flex items-center gap-1 text-xs text-gold-500"><Zap className="w-3 h-3" />+{ev.bonus_xp} XP</span>
                    </div>
                    <h3 className="font-display font-semibold text-white">{ev.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{ev.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Debut: {new Date(ev.starts_at).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Fin: {new Date(ev.ends_at).toLocaleString()}</span>
                      {linkedQuiz && <span>Quiz: {linkedQuiz.title}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleActive(ev)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${ev.is_active ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40' : 'bg-slate-800 text-slate-400'}`}>
                      {ev.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => editEvent(ev)} className="text-slate-500 hover:text-cyan-400 p-2"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(ev.id)} className="text-slate-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
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
