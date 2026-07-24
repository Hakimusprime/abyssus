import { GoogleGenAI } from '@google/genai';

/**
 * Fournisseurs IA. Architecture volontairement isolee ici pour brancher
 * facilement d'autres fournisseurs sans toucher aux pages.
 *  - gemini   : Google Gemini (gratuit, SDK @google/genai)
 *  - freemodel: FreeModel.dev, routeur multi-modeles compatible OpenAI
 *  - groq     : Groq (API compatible OpenAI, tres rapide, free tier)
 *  - mistral  : Mistral AI (API compatible OpenAI)
 */
export type AiProvider = 'gemini' | 'freemodel' | 'groq' | 'mistral';

export const AI_PROVIDERS: { id: AiProvider; label: string }[] = [
  { id: 'groq', label: 'Groq (rapide)' },
  { id: 'mistral', label: 'Mistral' },
  { id: 'gemini', label: 'Gemini (Google)' },
  { id: 'freemodel', label: 'FreeModel' },
];

// Icones autorisees cote UI (doivent correspondre a iconOptions dans CreatorAdmin).
export const AI_ICON_OPTIONS = [
  'Waves', 'Fish', 'Shell', 'Anchor', 'Compass', 'Brain', 'Globe2', 'FlaskConical',
  'Mountain', 'Leaf', 'Dna', 'Atom', 'BookOpen', 'Microscope', 'Zap', 'Droplet', 'Skull', 'Telescope',
];

const GEMINI_MODEL = 'gemini-2.0-flash';

// Fournisseurs compatibles OpenAI (endpoint /chat/completions)
const FREEMODEL_BASE_URL = 'https://vip-sg.freemodel.dev/v1';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';
const MISTRAL_MODEL = 'mistral-small-latest';

export type GeneratedCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
};

export type QuestionType = 'text' | 'image' | 'emoji';

export type GeneratedQuestion = {
  text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  question_type: QuestionType;
  media_url: string;
};

export type GeneratedQuiz = {
  title: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'abyssal';
  xp_reward: number;
  estimated_minutes: number;
  category_name: string;
  category_slug: string;
  questions: GeneratedQuestion[];
};

// ---------------------------------------------------------------------------
// Cles / config par fournisseur
// ---------------------------------------------------------------------------

function getGeminiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (!key) {
    throw new Error(
      "Cle Gemini manquante : ajoute VITE_GEMINI_API_KEY dans le fichier .env, puis relance le serveur."
    );
  }
  return key;
}

type OpenAiCompatConfig = { baseUrl: string; model: string; key: string; label: string };

function getOpenAiCompatConfig(provider: AiProvider): OpenAiCompatConfig {
  switch (provider) {
    case 'groq': {
      const key = import.meta.env.VITE_GROQ_API_KEY as string;
      if (!key) throw new Error('Cle Groq manquante : ajoute VITE_GROQ_API_KEY dans .env puis relance le serveur.');
      return { baseUrl: GROQ_BASE_URL, model: (import.meta.env.VITE_GROQ_MODEL as string) || GROQ_MODEL, key, label: 'Groq' };
    }
    case 'mistral': {
      const key = import.meta.env.VITE_MISTRAL_API_KEY as string;
      if (!key) throw new Error('Cle Mistral manquante : ajoute VITE_MISTRAL_API_KEY dans .env puis relance le serveur.');
      return { baseUrl: MISTRAL_BASE_URL, model: (import.meta.env.VITE_MISTRAL_MODEL as string) || MISTRAL_MODEL, key, label: 'Mistral' };
    }
    case 'freemodel': {
      const key = import.meta.env.VITE_FREEMODEL_API_KEY as string;
      if (!key) throw new Error('Cle FreeModel manquante : ajoute VITE_FREEMODEL_API_KEY dans .env puis relance le serveur.');
      return { baseUrl: FREEMODEL_BASE_URL, model: (import.meta.env.VITE_FREEMODEL_MODEL as string) || 'gpt-5.6-sol', key, label: 'FreeModel' };
    }
    default:
      throw new Error(`Fournisseur non compatible OpenAI : ${provider}`);
  }
}

// ---------------------------------------------------------------------------
// Helpers texte / JSON
// ---------------------------------------------------------------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enleve les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Extrait un tableau JSON d'une reponse texte, en tolerant les blocs markdown. */
function extractJsonArray<T = unknown>(text: string, key?: string): T[] {
  let cleaned = text.trim();
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) cleaned = fence[1].trim();
  const parsed = JSON.parse(cleaned);
  let arr: unknown = Array.isArray(parsed) ? parsed : undefined;
  if (!arr && parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    arr = (key && Array.isArray(obj[key]) ? obj[key] : undefined)
      ?? obj.items ?? obj.data ?? obj.categories ?? obj.quizzes;
  }
  if (!Array.isArray(arr)) throw new Error('Format inattendu (tableau JSON attendu).');
  return arr as T[];
}

/** Appel generique vers un endpoint compatible OpenAI /chat/completions. */
async function callOpenAiCompat(cfg: OpenAiCompatConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    throw new Error(
      `Impossible de contacter ${cfg.label} depuis le navigateur (probable blocage CORS). Un backend/proxy peut etre necessaire.`
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Erreur ${cfg.label} (${res.status}) : ${detail || res.statusText}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Reponse ${cfg.label} vide.`);
  return content;
}

// ---------------------------------------------------------------------------
// Generation de CATEGORIES
// ---------------------------------------------------------------------------

function sanitizeCategory(c: GeneratedCategory): GeneratedCategory {
  return {
    name: (c.name || '').trim().slice(0, 60),
    slug: slugify(c.slug || c.name || ''),
    description: (c.description || '').trim().slice(0, 200),
    icon: AI_ICON_OPTIONS.includes(c.icon) ? c.icon : 'Waves',
    color: /^#[0-9a-fA-F]{6}$/.test(c.color) ? c.color : '#0e7490',
  };
}

function buildCategoryPrompt(theme: string, safeCount: number): string {
  return (
    `Tu crees des categories de quiz pour "Abyssus", une plateforme educative sur le theme des oceans et des abysses.\n` +
    `Genere exactement ${safeCount} categorie(s) autour du theme : "${theme}".\n` +
    `Contraintes pour chaque categorie :\n` +
    `- name : titre court et evocateur en francais (max 60 caracteres).\n` +
    `- slug : en minuscules, sans accents, mots separes par des tirets.\n` +
    `- description : une seule phrase en francais (max 200 caracteres).\n` +
    `- icon : choisis EXACTEMENT une valeur parmi cette liste : ${AI_ICON_OPTIONS.join(', ')}.\n` +
    `- color : un code hexadecimal a 6 chiffres (ex: #0e7490) coherent avec le theme.`
  );
}

async function generateCategoriesGemini(theme: string, safeCount: number): Promise<GeneratedCategory[]> {
  const ai = new GoogleGenAI({ apiKey: getGeminiKey() });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildCategoryPrompt(theme, safeCount),
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            color: { type: 'string' },
          },
          required: ['name', 'slug', 'description', 'icon', 'color'],
        },
      },
    },
  });
  const text = response.text;
  if (!text) throw new Error('Reponse Gemini vide.');
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('not-array');
    return parsed as GeneratedCategory[];
  } catch {
    throw new Error('Reponse Gemini illisible (JSON invalide).');
  }
}

async function generateCategoriesOpenAiCompat(provider: AiProvider, theme: string, safeCount: number): Promise<GeneratedCategory[]> {
  const cfg = getOpenAiCompatConfig(provider);
  const prompt =
    buildCategoryPrompt(theme, safeCount) +
    `\n\nReponds UNIQUEMENT par un objet JSON {"categories": [...]} valide, sans texte autour. ` +
    `Chaque element: {"name":"...","slug":"...","description":"...","icon":"Waves","color":"#0e7490"}`;
  const content = await callOpenAiCompat(cfg, 'Tu es un generateur de donnees qui repond exclusivement en JSON.', prompt);
  try {
    return extractJsonArray<GeneratedCategory>(content, 'categories');
  } catch {
    throw new Error(`Reponse ${cfg.label} illisible (JSON invalide).`);
  }
}

export async function generateCategories(
  theme: string,
  count: number,
  provider: AiProvider = 'groq'
): Promise<GeneratedCategory[]> {
  const safeCount = Math.min(Math.max(count, 1), 10);
  const raw = provider === 'gemini'
    ? await generateCategoriesGemini(theme, safeCount)
    : await generateCategoriesOpenAiCompat(provider, theme, safeCount);
  return raw.map(sanitizeCategory).filter(c => c.name && c.slug);
}

// ---------------------------------------------------------------------------
// Generation de QUIZ complets (avec questions texte / image / emoji)
// ---------------------------------------------------------------------------

const DIFFICULTIES = ['easy', 'normal', 'hard', 'abyssal'] as const;
const QUESTION_TYPES: QuestionType[] = ['text', 'image', 'emoji'];

function sanitizeQuestion(q: GeneratedQuestion): GeneratedQuestion | null {
  const text = (q.text || '').trim();
  let options = Array.isArray(q.options) ? q.options.map(o => String(o).trim()).filter(Boolean) : [];
  // On garantit exactement 4 options quand c'est possible, minimum 2.
  options = options.slice(0, 4);
  if (options.length < 2) return null;
  let correct = Number.isInteger(q.correct_index) ? q.correct_index : 0;
  if (correct < 0 || correct >= options.length) correct = 0;
  const type: QuestionType = QUESTION_TYPES.includes(q.question_type) ? q.question_type : 'text';
  const media = type === 'text' ? '' : String(q.media_url || '').trim();
  if (!text) return null;
  return {
    text: text.slice(0, 300),
    options,
    correct_index: correct,
    explanation: (q.explanation || '').trim().slice(0, 300),
    question_type: type,
    media_url: media,
  };
}

function sanitizeQuiz(q: GeneratedQuiz, fallbackTheme: string): GeneratedQuiz | null {
  const title = (q.title || '').trim();
  if (!title) return null;
  const difficulty = DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'normal';
  const xp = Number.isFinite(q.xp_reward) ? Math.min(Math.max(Math.round(q.xp_reward), 10), 500) : 50;
  const minutes = Number.isFinite(q.estimated_minutes) ? Math.min(Math.max(Math.round(q.estimated_minutes), 1), 60) : 5;
  const questions = (Array.isArray(q.questions) ? q.questions : [])
    .map(sanitizeQuestion)
    .filter((x): x is GeneratedQuestion => x !== null);
  if (questions.length === 0) return null;
  const catName = (q.category_name || fallbackTheme || 'Divers').trim().slice(0, 60);
  return {
    title: title.slice(0, 80),
    description: (q.description || '').trim().slice(0, 240),
    difficulty,
    xp_reward: xp,
    estimated_minutes: minutes,
    category_name: catName,
    category_slug: slugify(q.category_slug || catName),
    questions,
  };
}

function buildQuizPrompt(theme: string, count: number, difficulty: string, questionsPerQuiz: number): string {
  return (
    `Tu generes du contenu pour "Abyssus", une plateforme de quiz gamifiee a l'ambiance sombre et abyssale.\n` +
    `Domaine impose : "${theme}". Genere EXACTEMENT ${count} quiz distincts dans ce domaine.\n` +
    `Chaque quiz contient EXACTEMENT ${questionsPerQuiz} questions a choix multiple.\n` +
    `Difficulte cible : "${difficulty}".\n\n` +
    `Regles pour chaque quiz :\n` +
    `- title : titre court et accrocheur en francais.\n` +
    `- description : une phrase en francais.\n` +
    `- difficulty : une valeur parmi easy, normal, hard, abyssal.\n` +
    `- xp_reward : entier entre 30 et 200 selon la difficulte.\n` +
    `- estimated_minutes : entier entre 2 et 15.\n` +
    `- category_name : nom lisible de la categorie (ex: "Otaku").\n` +
    `- category_slug : version slug (minuscules, tirets) de category_name.\n\n` +
    `Regles pour chaque question :\n` +
    `- text : la question en francais.\n` +
    `- options : tableau de 4 propositions.\n` +
    `- correct_index : index (0 a 3) de la bonne reponse.\n` +
    `- explanation : courte explication en francais.\n` +
    `- question_type : "text", "emoji" ou "image".\n` +
    `- media_url : pour "emoji", mets une suite de 2 a 5 emojis representant la reponse (ex: "\ud83d\udd25\ud83d\udc09\u2694\ufe0f"). ` +
    `Pour "image", laisse une chaine vide "" (l'auteur ajoutera l'image/opening lui-meme). Pour "text", chaine vide "".\n` +
    `- Varie les types : environ 60% text, 30% emoji, 10% image.\n\n` +
    `Reponds UNIQUEMENT par un objet JSON valide de la forme {"quizzes": [ ... ]}, sans aucun texte autour.`
  );
}

async function generateQuizzesGemini(theme: string, count: number, difficulty: string, qpq: number): Promise<GeneratedQuiz[]> {
  const ai = new GoogleGenAI({ apiKey: getGeminiKey() });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildQuizPrompt(theme, count, difficulty, qpq),
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            difficulty: { type: 'string' },
            xp_reward: { type: 'integer' },
            estimated_minutes: { type: 'integer' },
            category_name: { type: 'string' },
            category_slug: { type: 'string' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct_index: { type: 'integer' },
                  explanation: { type: 'string' },
                  question_type: { type: 'string' },
                  media_url: { type: 'string' },
                },
                required: ['text', 'options', 'correct_index', 'question_type'],
              },
            },
          },
          required: ['title', 'description', 'difficulty', 'questions'],
        },
      },
    },
  });
  const text = response.text;
  if (!text) throw new Error('Reponse Gemini vide.');
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('not-array');
    return parsed as GeneratedQuiz[];
  } catch {
    throw new Error('Reponse Gemini illisible (JSON invalide).');
  }
}

async function generateQuizzesOpenAiCompat(provider: AiProvider, theme: string, count: number, difficulty: string, qpq: number): Promise<GeneratedQuiz[]> {
  const cfg = getOpenAiCompatConfig(provider);
  const content = await callOpenAiCompat(
    cfg,
    'Tu es un generateur de quiz qui repond exclusivement par du JSON valide.',
    buildQuizPrompt(theme, count, difficulty, qpq)
  );
  try {
    return extractJsonArray<GeneratedQuiz>(content, 'quizzes');
  } catch {
    throw new Error(`Reponse ${cfg.label} illisible (JSON invalide).`);
  }
}

export type GenerateQuizOptions = {
  difficulty?: 'easy' | 'normal' | 'hard' | 'abyssal';
  questionsPerQuiz?: number;
};

/** Genere des quiz complets pour Abyssus via le fournisseur choisi. */
export async function generateQuizzes(
  theme: string,
  count: number,
  provider: AiProvider = 'groq',
  opts: GenerateQuizOptions = {}
): Promise<GeneratedQuiz[]> {
  const safeCount = Math.min(Math.max(count, 1), 12);
  const difficulty = opts.difficulty ?? 'normal';
  const qpq = Math.min(Math.max(opts.questionsPerQuiz ?? 6, 3), 12);
  const raw = provider === 'gemini'
    ? await generateQuizzesGemini(theme, safeCount, difficulty, qpq)
    : await generateQuizzesOpenAiCompat(provider, theme, safeCount, difficulty, qpq);
  return raw.map(q => sanitizeQuiz(q, theme)).filter((x): x is GeneratedQuiz => x !== null);
}
