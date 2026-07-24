import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
};

export type Quiz = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'abyssal';
  cover_gradient: string;
  xp_reward: number;
  estimated_minutes: number;
  created_by: string | null;
  created_at: string;
};

export type Question = {
  id: string;
  quiz_id: string;
  text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  sort_order: number;
  question_type: 'text' | 'image' | 'emoji';
  media_url: string | null;
  created_at: string;
};

export type Attempt = {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total: number;
  time_seconds: number;
  completed_at: string;
};

export type AbyssEvent = {
  id: string;
  title: string;
  description: string;
  quiz_id: string | null;
  bonus_xp: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
};

export type Item = {
  id: string;
  name: string;
  type: 'weapon' | 'relic' | 'armor' | 'consumable';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'abyssal';
  effect: string;
  xp_boost: number;
  icon: string;
  created_at: string;
};

export type Suggestion = {
  id: string;
  user_id: string | null;
  author_name: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  created_at: string;
};
