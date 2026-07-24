/*
# Abyssus — Autoriser les ecritures de contenu (client-only)

## Contexte
L'application s'authentifie via Firebase, pas via Supabase Auth. Cote Supabase,
toutes les requetes arrivent donc avec le role `anon`. Les policies d'origine
exigeaient un role Supabase `authenticated` + un profil creator/admin, ce qui
bloquait TOUTES les ecritures (categories/quizzes/questions/events/items) depuis
l'admin de l'app.

## Compromis assume
Cette migration ouvre les ecritures de contenu au role `anon`. C'est acceptable
pour ce projet perso client-only : l'admin reste protege cote application par
ProtectedRoute (role Firebase creator/admin). A NE PAS utiliser tel quel pour un
produit public sans backend/proxy.

## A executer
Coller ce fichier dans l'editeur SQL Supabase (SQL Editor) puis Run.
*/

-- Colonne type d'evenement (boss / special) pour adapter le theme cote UI.
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'boss'
  CHECK (event_type IN ('boss', 'special'));

-- CATEGORIES : ecritures ouvertes
DROP POLICY IF EXISTS "insert_categories_creator" ON categories;
DROP POLICY IF EXISTS "update_categories_creator" ON categories;
DROP POLICY IF EXISTS "delete_categories_creator" ON categories;
DROP POLICY IF EXISTS "write_categories_anon" ON categories;
CREATE POLICY "write_categories_anon" ON categories FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- QUIZZES : ecritures ouvertes
DROP POLICY IF EXISTS "insert_quizzes_creator" ON quizzes;
DROP POLICY IF EXISTS "update_quizzes_creator" ON quizzes;
DROP POLICY IF EXISTS "delete_quizzes_creator" ON quizzes;
DROP POLICY IF EXISTS "write_quizzes_anon" ON quizzes;
CREATE POLICY "write_quizzes_anon" ON quizzes FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- QUESTIONS : ecritures ouvertes
DROP POLICY IF EXISTS "insert_questions_creator" ON questions;
DROP POLICY IF EXISTS "update_questions_creator" ON questions;
DROP POLICY IF EXISTS "delete_questions_creator" ON questions;
DROP POLICY IF EXISTS "write_questions_anon" ON questions;
CREATE POLICY "write_questions_anon" ON questions FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- EVENTS : ecritures ouvertes
DROP POLICY IF EXISTS "insert_events_admin" ON events;
DROP POLICY IF EXISTS "update_events_admin" ON events;
DROP POLICY IF EXISTS "delete_events_admin" ON events;
DROP POLICY IF EXISTS "write_events_anon" ON events;
CREATE POLICY "write_events_anon" ON events FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ITEMS : ecritures ouvertes
DROP POLICY IF EXISTS "insert_items_creator" ON items;
DROP POLICY IF EXISTS "update_items_creator" ON items;
DROP POLICY IF EXISTS "delete_items_creator" ON items;
DROP POLICY IF EXISTS "write_items_anon" ON items;
CREATE POLICY "write_items_anon" ON items FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);
