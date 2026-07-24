import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, Zap, Trophy, RotateCcw, ChevronRight, Loader2, AlertCircle, Heart } from 'lucide-react';
import { supabase, type Quiz, type Question } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { playSound } from '@/lib/sound';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, getRankIndex } from '@/lib/firebase';
import { difficultyBadge } from '@/lib/ui';

type Phase = 'loading' | 'intro' | 'playing' | 'result';

export default function QuizPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { liveEvent } = useEvents();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phase, setPhase] = useState<Phase>('loading');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hpDamage, setHpDamage] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: q } = await supabase.from('quizzes').select('*').eq('id', id).maybeSingle();
      if (!q) { setError('Quiz introuvable'); return; }
      setQuiz(q as Quiz);
      const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', id).order('sort_order');
      setQuestions(qs as Question[] ?? []);
      setPhase('intro');
    })();
  }, [id]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 200);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setRevealed(true);
    const correct = questions[currentIdx].correct_index === selected;
    if (correct) {
      setScore((s) => s + 1);
      playSound('answer-correct');
    } else {
      setWrongCount((w) => w + 1);
      setHpDamage(1);
      setTimeout(() => setHpDamage(0), 800);
      playSound('answer-wrong');
    }
    setAnswers((a) => [...a, selected]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const finishQuiz = useCallback(async () => {
    const total = questions.length;
    const finalScore = answers.filter((a, i) => a === questions[i]?.correct_index).length
      + (selected === questions[currentIdx]?.correct_index && !answers.includes(selected) ? 1 : 0);
    const finalWrong = total - finalScore;
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
    setScore(finalScore);
    setPhase('result');

    if (user && quiz) {
      setSubmitting(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const earnedXp = Math.round((finalScore / total) * quiz.xp_reward);
        const newHp = Math.max(0, user.hp - finalWrong);
        const newXp = user.xp + earnedXp;
        const newRankIndex = getRankIndex(newXp);
        const update: Record<string, unknown> = {
          xp: newXp,
          rankIndex: newRankIndex,
        };
        if (newHp <= 0) {
          update.hp = 0;
          update.lastDeathAt = Date.now();
          // Son unique de defaite si un boss est en cours.
          if (liveEvent) playSound('boss-defeat');
        } else {
          update.hp = newHp;
        }
        await updateDoc(userRef, update as Record<string, never>);
      } catch (err) {
        console.error('Save error:', err);
        setError('Impossible de sauvegarder votre score.');
      }
      setSubmitting(false);
    }
  }, [answers, selected, questions, currentIdx, startTime, user, quiz, liveEvent]);

  const startQuiz = () => {
    playSound('quest-accept');
    setPhase('playing');
    setStartTime(Date.now());
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setScore(0);
    setWrongCount(0);
  };

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {error ? (
          <>
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-slate-400">{error}</p>
            <Link to="/catalog" className="btn-ghost">Retour au Catalogue</Link>
          </>
        ) : (
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        )}
      </div>
    );
  }

  if (phase === 'intro') {
    if (!quiz) return null;
    const hpBlocked = user && user.hp <= 0;
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Link to="/catalog" onClick={() => playSound('quest-refuse')} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className={`h-40 rounded-2xl bg-gradient-to-r ${quiz.cover_gradient} relative overflow-hidden mb-6 border border-white/5`}>
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              {difficultyBadge(quiz.difficulty)}
              <span className="text-xs text-white/60">{questions.length} questions</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{quiz.title}</h1>
          </div>
        </div>
        <p className="text-slate-400 text-lg leading-relaxed mb-6">{quiz.description}</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{quiz.xp_reward}</p>
            <p className="text-xs text-slate-600">XP</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">~{quiz.estimated_minutes}</p>
            <p className="text-xs text-slate-600">Minutes</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{questions.length}</p>
            <p className="text-xs text-slate-600">Questions</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/5 px-4 py-3 mb-6">
            <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
            <span className="text-sm text-slate-300">HP: {user.hp}/10</span>
            <span className="text-xs text-slate-600 ml-auto">Mauvaises reponses = -1 HP</span>
          </div>
        )}
        {!user && (
          <div className="rounded-xl bg-amber-950/20 border border-amber-800/30 p-4 mb-6 text-sm text-amber-300">
            Connectez-vous pour sauvegarder votre score et gagner de l'XP.
          </div>
        )}
        {hpBlocked && (
          <div className="rounded-xl bg-red-950/20 border border-red-800/30 p-4 mb-6 text-sm text-red-300">
            Vos HP sont epuises. Regeneration dans 1 heure.
          </div>
        )}
        <button onClick={startQuiz} className="btn-primary w-full text-lg" disabled={questions.length === 0}>
          {questions.length === 0 ? 'Aucune question' : 'Commencer la Plongee'}
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    const total = questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const earnedXp = quiz ? Math.round((score / total) * quiz.xp_reward) : 0;
    const verdict = pct >= 80 ? 'Maitre Plongeur' : pct >= 60 ? 'Explorateur Confirme' : pct >= 40 ? 'Apprenti' : 'Nageur de Surface';
    const verdictColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-cyan-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400';

    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="inline-flex w-20 h-20 rounded-full bg-black/40 border border-white/10 items-center justify-center mb-4 animate-float">
            <Trophy className={`w-10 h-10 ${verdictColor}`} />
          </div>
          <p className="text-sm text-slate-600 mb-1">Quiz Termine</p>
          <h1 className="font-display text-4xl font-bold text-white">{score} / {total}</h1>
          <p className={`font-display text-xl font-semibold mt-2 ${verdictColor}`}>{verdict}</p>
          <div className="mt-6 inline-flex items-center gap-6 rounded-xl bg-black/40 px-6 py-4 border border-white/5">
            <div>
              <p className="text-2xl font-bold text-gold-500">+{earnedXp}</p>
              <p className="text-xs text-slate-600">XP Gagnee</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-cyan-400">{elapsed}s</p>
              <p className="text-xs text-slate-600">Temps</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">{pct}%</p>
              <p className="text-xs text-slate-600">Score</p>
            </div>
            {wrongCount > 0 && (
              <>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-red-400">-{wrongCount}</p>
                  <p className="text-xs text-slate-600">HP Perdu</p>
                </div>
              </>
            )}
          </div>
          {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
          {submitting && <p className="text-sm text-slate-500 mt-4 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</p>}
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-white">Revision</h3>
          {questions.map((q, i) => {
            const userAns = i < answers.length ? answers[i] : (i === currentIdx ? selected : null);
            const correct = userAns === q.correct_index;
            return (
              <div key={q.id} className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                  {correct ? <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /> : <X className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-white">{i + 1}. {q.text}</p>
                    {q.explanation && <p className="text-xs text-slate-500 mt-1">{q.explanation}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={startQuiz} className="btn-ghost flex-1">
            <RotateCcw className="w-4 h-4" /> Recommencer
          </button>
          <button onClick={() => navigate('/catalog')} className="btn-primary flex-1">
            Plus de Quiz <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return null;
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const isCorrect = revealed && selected === q.correct_index;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500">Question {currentIdx + 1} sur {questions.length}</span>
          <div className="flex items-center gap-4">
            {user && (
              <span className={`flex items-center gap-1.5 text-red-400 font-mono transition-transform ${hpDamage ? 'scale-125' : ''}`}>
                <Heart className={`w-4 h-4 ${hpDamage ? 'animate-pulse' : ''}`} fill="currentColor" />
                {user.hp - wrongCount}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-slate-500 font-mono">
              <Clock className="w-4 h-4" />
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-black/50 overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">{q.text}</h2>

        {q.question_type === 'image' && q.media_url && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <img src={q.media_url} alt="Question" className="w-full max-h-72 object-cover" />
          </div>
        )}
        {q.question_type === 'emoji' && q.media_url && (
          <div className="mt-4 text-center text-5xl py-4">{q.media_url}</div>
        )}

        <div className="mt-6 space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrectOpt = revealed && idx === q.correct_index;
            const isWrongSel = revealed && isSelected && idx !== q.correct_index;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full text-left rounded-xl border px-5 py-4 transition-all duration-200 ${
                  isCorrectOpt
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
                    : isWrongSel
                    ? 'border-red-500/50 bg-red-950/30 text-red-200'
                    : isSelected
                    ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200'
                    : 'border-white/8 bg-black/30 text-slate-300 hover:border-cyan-500/30 hover:bg-white/5'
                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt}</span>
                  {isCorrectOpt && <Check className="w-5 h-5 text-emerald-400" />}
                  {isWrongSel && <X className="w-5 h-5 text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {revealed && q.explanation && (
          <div className="mt-5 rounded-xl bg-black/40 border border-white/5 p-4">
            <p className="text-sm text-slate-400">
              <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct ! ' : 'Pas tout a fait. '}
              </span>
              {q.explanation}
            </p>
          </div>
        )}

        <div className="mt-6">
          {!revealed ? (
            <button onClick={handleConfirm} disabled={selected === null} className="btn-primary w-full">
              Valider
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary w-full">
              {currentIdx + 1 >= questions.length ? 'Voir les Resultats' : 'Question Suivante'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
