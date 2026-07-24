import { useEffect, useState, type FormEvent } from 'react';
import { Brain, Plus, Trash2, Edit3, X, ChevronDown, ChevronRight, Loader2, Save, Layers } from 'lucide-react';
import { supabase, type Category, type Quiz, type Question } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { difficultyBadge } from '@/lib/ui';

type Tab = 'categories' | 'quizzes' | 'questions';

export default function CreatorAdmin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('quizzes');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quizzes, setQuizzes] = useState<(Quiz & { category_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  // Forms
  const [showCatForm, setShowCatForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Waves');
  const [catColor, setCatColor] = useState('#0e7490');

  // Quiz form state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSlug, setQuizSlug] = useState('');
  const [quizCatId, setQuizCatId] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizDiff, setQuizDiff] = useState<'easy' | 'normal' | 'hard' | 'abyssal'>('normal');
  const [quizXp, setQuizXp] = useState(50);
  const [quizMinutes, setQuizMinutes] = useState(5);

  // Question form
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQForm, setShowQForm] = useState(false);
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qType, setQType] = useState<'text' | 'image' | 'emoji'>('text');
  const [qMediaUrl, setQMediaUrl] = useState('');

  const loadData = async () => {
    const [{ data: cats }, { data: qs }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('quizzes').select('*, categories(name)').order('created_at', { ascending: false }),
    ]);
    setCategories(cats as Category[] ?? []);
    setQuizzes((qs as (Quiz & { categories?: { name: string } })[])?.map(q => ({ ...q, category_name: q.categories?.name })) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const loadQuestions = async (quizId: string) => {
    const { data } = await supabase.from('questions').select('*').eq('quiz_id', quizId).order('sort_order');
    setQuestions(data as Question[] ?? []);
  };

  const resetCatForm = () => {
    setCatName(''); setCatSlug(''); setCatDesc(''); setCatIcon('Waves'); setCatColor('#0e7490'); setEditingCat(null);
  };
  const resetQuizForm = () => {
    setQuizTitle(''); setQuizSlug(''); setQuizDesc(''); setQuizDiff('normal'); setQuizXp(50); setQuizMinutes(5); setEditingQuiz(null);
  };
  const resetQForm = () => {
    setQText(''); setQOptions(['', '', '', '']); setQCorrect(0); setQExplanation(''); setQType('text'); setQMediaUrl(''); setShowQForm(false);
  };

  const saveCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      await supabase.from('categories').update({ name: catName, slug: catSlug, description: catDesc, icon: catIcon, color: catColor }).eq('id', editingCat.id);
    } else {
      await supabase.from('categories').insert({ name: catName, slug: catSlug, description: catDesc, icon: catIcon, color: catColor });
    }
    resetCatForm(); setShowCatForm(false); loadData();
  };

  const saveQuiz = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { title: quizTitle, slug: quizSlug, category_id: quizCatId, description: quizDesc, difficulty: quizDiff, xp_reward: quizXp, estimated_minutes: quizMinutes };
    if (editingQuiz) {
      await supabase.from('quizzes').update(payload).eq('id', editingQuiz.id);
    } else {
      await supabase.from('quizzes').insert({ ...payload, created_by: user?.uid });
    }
    resetQuizForm(); setShowQuizForm(false); loadData();
  };

  const saveQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!expandedQuiz) return;
    await supabase.from('questions').insert({
      quiz_id: expandedQuiz,
      text: qText,
      options: qOptions.filter(o => o.trim()),
      correct_index: qCorrect,
      explanation: qExplanation,
      sort_order: questions.length,
      question_type: qType,
      media_url: qType !== 'text' ? qMediaUrl : null,
    });
    resetQForm();
    loadQuestions(expandedQuiz);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its quizzes?')) return;
    await supabase.from('categories').delete().eq('id', id);
    loadData();
  };
  const deleteQuiz = async (id: string) => {
    if (!confirm('Delete this quiz and all its questions?')) return;
    await supabase.from('quizzes').delete().eq('id', id);
    loadData();
  };
  const deleteQuestion = async (id: string) => {
    await supabase.from('questions').delete().eq('id', id);
    if (expandedQuiz) loadQuestions(expandedQuiz);
  };

  const editCat = (c: Category) => {
    setEditingCat(c); setCatName(c.name); setCatSlug(c.slug); setCatDesc(c.description); setCatIcon(c.icon); setCatColor(c.color);
    setShowCatForm(true);
  };
  const editQuiz = (q: Quiz) => {
    setEditingQuiz(q); setQuizTitle(q.title); setQuizSlug(q.slug); setQuizCatId(q.category_id); setQuizDesc(q.description); setQuizDiff(q.difficulty); setQuizXp(q.xp_reward); setQuizMinutes(q.estimated_minutes);
    setShowQuizForm(true);
  };

  const toggleQuiz = (quizId: string) => {
    if (expandedQuiz === quizId) { setExpandedQuiz(null); return; }
    setExpandedQuiz(quizId);
    loadQuestions(quizId);
  };

  const iconOptions = ['Waves', 'Fish', 'Shell', 'Anchor', 'Compass', 'Brain', 'Globe2', 'FlaskConical', 'Mountain', 'Leaf', 'Dna', 'Atom', 'BookOpen', 'Microscope', 'Zap', 'Droplet', 'Skull', 'Telescope'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <Brain className="w-7 h-7 text-cyan-400" />
          <h1 className="font-display text-3xl font-bold text-white">Studio Createur</h1>
        </div>
        <p className="text-slate-500 mt-1">Gerer les categories, quiz et questions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl w-fit">
        {(['quizzes', 'categories', 'questions'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-600/30' : 'text-slate-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* CATEGORIES TAB */}
      {tab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Categories ({categories.length})</h2>
            <button onClick={() => { resetCatForm(); setShowCatForm(!showCatForm); }} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Nouvelle Categorie
            </button>
          </div>
          {showCatForm && (
            <form onSubmit={saveCategory} className="glass-card rounded-2xl p-5 mb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-500">Nom</label><input value={catName} onChange={e => setCatName(e.target.value)} className="input-field mt-1" required /></div>
                <div><label className="text-sm text-slate-500">Slug</label><input value={catSlug} onChange={e => setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="input-field mt-1" placeholder="marine-biology" required /></div>
              </div>
              <div><label className="text-sm text-slate-500">Description</label><textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} className="input-field mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Icone</label>
                  <select value={catIcon} onChange={e => setCatIcon(e.target.value)} className="input-field mt-1">
                    {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div><label className="text-sm text-slate-500">Couleur</label><input type="color" value={catColor} onChange={e => setCatColor(e.target.value)} className="w-full h-11 rounded-xl bg-black/40 border border-white/10 mt-1 cursor-pointer" /></div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm"><Save className="w-4 h-4" /> {editingCat ? 'Modifier' : 'Creer'}</button>
                <button type="button" onClick={() => { setShowCatForm(false); resetCatForm(); }} className="btn-ghost text-sm">Annuler</button>
              </div>
            </form>
          )}
          <div className="space-y-2">
            {loading ? <p className="text-slate-600 text-center py-8">Chargement...</p> :
              categories.map(c => (
                <div key={c.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.color}25`, border: `1px solid ${c.color}50` }}>
                    <Layers className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="text-xs text-slate-600">{c.slug}</p>
                  </div>
                  <button onClick={() => editCat(c)} className="text-slate-500 hover:text-cyan-400"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteCategory(c.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* QUIZZES TAB */}
      {tab === 'quizzes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Quiz ({quizzes.length})</h2>
            <button onClick={() => { resetQuizForm(); if (categories[0]) setQuizCatId(categories[0].id); setShowQuizForm(!showQuizForm); }} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Nouveau Quiz
            </button>
          </div>
          {showQuizForm && (
            <form onSubmit={saveQuiz} className="glass-card rounded-2xl p-5 mb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-500">Titre</label><input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="input-field mt-1" required /></div>
                <div><label className="text-sm text-slate-500">Slug</label><input value={quizSlug} onChange={e => setQuizSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="input-field mt-1" required /></div>
              </div>
              <div><label className="text-sm text-slate-500">Categorie</label>
                <select value={quizCatId} onChange={e => setQuizCatId(e.target.value)} className="input-field mt-1" required>
                  <option value="">Choisir...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-slate-500">Description</label><textarea value={quizDesc} onChange={e => setQuizDesc(e.target.value)} className="input-field mt-1" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm text-slate-500">Difficulte</label>
                  <select value={quizDiff} onChange={e => setQuizDiff(e.target.value as 'easy'|'normal'|'hard'|'abyssal')} className="input-field mt-1">
                    <option value="easy">Facile</option><option value="normal">Normal</option><option value="hard">Difficile</option><option value="abyssal">Abyssal</option>
                  </select>
                </div>
                <div><label className="text-sm text-slate-500">XP</label><input type="number" value={quizXp} onChange={e => setQuizXp(Number(e.target.value))} className="input-field mt-1" /></div>
                <div><label className="text-sm text-slate-500">Minutes</label><input type="number" value={quizMinutes} onChange={e => setQuizMinutes(Number(e.target.value))} className="input-field mt-1" /></div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm"><Save className="w-4 h-4" /> {editingQuiz ? 'Modifier' : 'Creer'}</button>
                <button type="button" onClick={() => { setShowQuizForm(false); resetQuizForm(); }} className="btn-ghost text-sm">Annuler</button>
              </div>
            </form>
          )}
          <div className="space-y-2">
            {loading ? <p className="text-slate-500 text-center py-8">Loading...</p> :
              quizzes.map(q => (
                <div key={q.id}>
                  <div className="glass rounded-xl p-4 flex items-center gap-4">
                    <button onClick={() => toggleQuiz(q.id)} className="text-slate-400 hover:text-white">
                      {expandedQuiz === q.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{q.title}</p>
                      <p className="text-xs text-slate-500">{q.category_name} · {q.difficulty}</p>
                    </div>
                    {difficultyBadge(q.difficulty)}
                    <button onClick={() => editQuiz(q)} className="text-slate-400 hover:text-abyss-400"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteQuiz(q.id)} className="text-slate-400 hover:text-coral-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {expandedQuiz === q.id && (
                    <div className="ml-8 mt-2 space-y-2">
                      {/* Question form */}
                      {showQForm ? (
                        <form onSubmit={saveQuestion} className="glass rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">Nouvelle Question</span>
                            <button type="button" onClick={resetQForm} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                          </div>
                          <input value={qText} onChange={e => setQText(e.target.value)} className="input-field" placeholder="Texte de la question" required />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-slate-500">Type de Question</label>
                              <select value={qType} onChange={e => setQType(e.target.value as 'text'|'image'|'emoji')} className="input-field mt-1">
                                <option value="text">Texte</option>
                                <option value="image">Image</option>
                                <option value="emoji">Emoji</option>
                              </select>
                            </div>
                            {(qType === 'image' || qType === 'emoji') && (
                              <div>
                                <label className="text-xs text-slate-500">{qType === 'image' ? 'URL Image' : 'Texte Emoji'}</label>
                                <input value={qMediaUrl} onChange={e => setQMediaUrl(e.target.value)} className="input-field mt-1" placeholder={qType === 'image' ? 'https://...' : '\u2b50\u2694\ufe0f'} />
                              </div>
                            )}
                          </div>
                          {qOptions.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="radio" checked={qCorrect === i} onChange={() => setQCorrect(i)} className="accent-cyan-500" />
                              <input value={opt} onChange={e => setQOptions(qOptions.map((o, j) => j === i ? e.target.value : o))} className="input-field" placeholder={`Option ${i + 1}`} required />
                            </div>
                          ))}
                          <input value={qExplanation} onChange={e => setQExplanation(e.target.value)} className="input-field" placeholder="Explication (optionnel)" />
                          <button type="submit" className="btn-primary text-sm"><Save className="w-4 h-4" /> Ajouter</button>
                        </form>
                      ) : (
                        <button onClick={() => setShowQForm(true)} className="btn-ghost text-sm w-full"><Plus className="w-4 h-4" /> Ajouter une Question</button>
                      )}
                      {/* Existing questions */}
                      {questions.map((qq, i) => (
                        <div key={qq.id} className="glass rounded-xl p-3 flex items-start gap-3">
                          <span className="text-xs text-slate-600 font-mono mt-0.5">Q{i + 1}</span>
                          <div className="flex-1">
                            <p className="text-sm text-white">{qq.text}</p>
                            {qq.question_type !== 'text' && qq.media_url && (
                              <p className="text-xs text-cyan-400 mt-0.5">[{qq.question_type}] {qq.media_url.slice(0, 40)}</p>
                            )}
                            <p className="text-xs text-emerald-400 mt-0.5">Reponse: {qq.options[qq.correct_index]}</p>
                          </div>
                          <button onClick={() => deleteQuestion(qq.id)} className="text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* QUESTIONS TAB */}
      {tab === 'questions' && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Brain className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">Les questions sont gerees par quiz.</p>
          <p className="text-sm text-slate-600 mt-1">Allez dans l'onglet Quiz, developpez un quiz, et ajoutez des questions.</p>
          <button onClick={() => setTab('quizzes')} className="btn-ghost mt-4 text-sm">Aller aux Quiz</button>
        </div>
      )}
    </div>
  );
}
