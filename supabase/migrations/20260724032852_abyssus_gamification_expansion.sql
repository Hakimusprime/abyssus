-- Abyssus Gamification Expansion: HP, Items, Inventory, Suggestions

-- Add HP and rank columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hp integer NOT NULL DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS max_hp integer NOT NULL DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_death_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rank_index integer NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_unlocked boolean NOT NULL DEFAULT false;

-- ITEMS table (relics, weapons, artifacts)
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'weapon' CHECK (type IN ('weapon','relic','armor','consumable')),
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary','abyssal')),
  effect text NOT NULL DEFAULT '',
  xp_boost integer NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT 'Sword',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_items" ON items;
CREATE POLICY "read_items" ON items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_items_creator" ON items;
CREATE POLICY "insert_items_creator" ON items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('creator','admin'))
);

DROP POLICY IF EXISTS "update_items_creator" ON items;
CREATE POLICY "update_items_creator" ON items FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('creator','admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('creator','admin'))
);

DROP POLICY IF EXISTS "delete_items_creator" ON items;
CREATE POLICY "delete_items_creator" ON items FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('creator','admin'))
);

-- INVENTORY junction table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  equipped boolean NOT NULL DEFAULT false,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_inventory" ON inventory;
CREATE POLICY "select_own_inventory" ON inventory FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_inventory" ON inventory;
CREATE POLICY "insert_own_inventory" ON inventory FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_inventory" ON inventory;
CREATE POLICY "update_own_inventory" ON inventory FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_inventory" ON inventory;
CREATE POLICY "delete_own_inventory" ON inventory FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- SUGGESTIONS table (community idea box)
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'Anonymous Diver',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  votes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewing','approved','rejected')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_suggestions" ON suggestions;
CREATE POLICY "read_suggestions" ON suggestions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_suggestions" ON suggestions;
CREATE POLICY "insert_suggestions" ON suggestions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_suggestions" ON suggestions;
CREATE POLICY "delete_own_suggestions" ON suggestions FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_suggestions_admin" ON suggestions;
CREATE POLICY "update_suggestions_admin" ON suggestions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin'))
);

-- Add question type and media_url columns for image/emoji questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'text';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS media_url text;
