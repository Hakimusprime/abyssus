/**
 * Systeme de sons d'Abyssus.
 *
 * Chaque effet essaie d'abord de jouer un fichier `public/sounds/<name>.mp3`
 * (que l'auteur peut deposer/remplacer librement). Si le fichier est absent
 * ou echoue a se charger, on retombe sur une synthese Web Audio simple pour
 * garantir un retour audible immediat.
 *
 * Depose tes propres fichiers dans `public/sounds/` :
 *   quest-accept.mp3, quest-refuse.mp3, answer-correct.mp3,
 *   answer-wrong.mp3, boss-defeat.mp3
 */

export type SoundName =
  | 'quest-accept'
  | 'quest-refuse'
  | 'answer-correct'
  | 'answer-wrong'
  | 'boss-defeat';

const MUTE_KEY = 'abyssus:muted';

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
}

// Cache des fichiers presents (evite de re-tenter un 404 en boucle).
const fileAvailable = new Map<SoundName, boolean>();

function playFile(name: SoundName): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fileAvailable.get(name) === false) {
      reject(new Error('file-known-missing'));
      return;
    }
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.volume = 0.6;
    audio.addEventListener('canplaythrough', () => {
      fileAvailable.set(name, true);
      audio.play().then(resolve).catch(reject);
    }, { once: true });
    audio.addEventListener('error', () => {
      fileAvailable.set(name, false);
      reject(new Error('file-missing'));
    }, { once: true });
    // Declenche le chargement.
    audio.load();
  });
}

// --- Fallback Web Audio (bips synthetises distincts par effet) ---

let audioCtx: AudioContext | null = null;
function ctx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

type Tone = { freq: number; start: number; dur: number; type?: OscillatorType; gain?: number };

const SYNTH: Record<SoundName, Tone[]> = {
  // Accord ascendant clair et engageant.
  'quest-accept': [
    { freq: 523, start: 0, dur: 0.12 },
    { freq: 784, start: 0.1, dur: 0.16 },
  ],
  // Deux notes descendantes sourdes.
  'quest-refuse': [
    { freq: 320, start: 0, dur: 0.14, type: 'sawtooth' },
    { freq: 180, start: 0.12, dur: 0.2, type: 'sawtooth' },
  ],
  // Petit ding positif.
  'answer-correct': [
    { freq: 880, start: 0, dur: 0.1 },
    { freq: 1174, start: 0.08, dur: 0.14 },
  ],
  // Buzz grave d'erreur.
  'answer-wrong': [
    { freq: 196, start: 0, dur: 0.22, type: 'square', gain: 0.18 },
  ],
  // Nappe grave et oppressante de defaite.
  'boss-defeat': [
    { freq: 140, start: 0, dur: 0.5, type: 'sawtooth', gain: 0.25 },
    { freq: 90, start: 0.25, dur: 0.7, type: 'sawtooth', gain: 0.25 },
    { freq: 60, start: 0.6, dur: 0.9, type: 'triangle', gain: 0.2 },
  ],
};

function playSynth(name: SoundName): void {
  const ac = ctx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const tone of SYNTH[name]) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = tone.type ?? 'sine';
    osc.frequency.value = tone.freq;
    const peak = tone.gain ?? 0.15;
    const t0 = now + tone.start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + tone.dur + 0.02);
  }
}

/** Joue un effet sonore par son nom (fichier si dispo, sinon synthese). */
export function playSound(name: SoundName): void {
  if (isMuted()) return;
  playFile(name).catch(() => playSynth(name));
}
