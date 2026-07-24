-- Seed otaku genere par IA (Groq). Idempotent : ON CONFLICT DO NOTHING.
-- 84 quiz, 414 questions.
-- A coller dans l'editeur SQL Supabase (ne necessite PAS la migration anon).

INSERT INTO categories (name, slug, description, icon, color, sort_order)
VALUES ('Otaku', 'otaku', 'Anime, manga, openings et culture otaku : plonge dans les abysses du Japon.', 'Skull', '#7f1d1d', 100)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Quiz 1: Les héros de la vague
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les héros de la vague', 'les-heros-de-la-vague', 'Découvrez les personnages emblématiques de Naruto, One Piece et Bleach', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du héros principal de Naruto ?', ARRAY['Sasuke Uchiha','Naruto Uzumaki','Kakashi Hatake','Tsunade'], 1, 'Naruto est le personnage principal de la série éponyme', 0, 'text', NULL),
  ('Quel est le nom du vaisseau de Monkey D. Luffy ?', ARRAY['Le Thousand Sunny','Le Going Merry','Le Red Force','Le Black Pearl'], 1, 'Le Going Merry est le premier vaisseau de l''équipage de Luffy', 1, 'text', NULL),
  ('Quel est le nom du pouvoir spécial de Ichigo Kurosaki ?', ARRAY['Bankai','Shunpo','Getsuga Tenshō','Kido'], 0, 'Bankai est le pouvoir spécial de Ichigo', 2, 'text', NULL),
  ('Qui est le méchant principal de la première partie de Naruto ?', ARRAY['Pain','Kaguya','Orochimaru','Madara Uchiha'], 2, 'Orochimaru est le méchant principal de la première partie de Naruto', 3, 'text', NULL),
  ('Quel est le nom de l''équipage de Monkey D. Luffy ?', ARRAY['L''équipage de Chapeau de Paille','L''équipage de Barbe Blanche','L''équipage de Big Mom','L''équipage de Kaido'], 0, 'L''équipage de Chapeau de Paille est le nom de l''équipage de Luffy', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 2: Les pouvoirs ultimes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les pouvoirs ultimes', 'les-pouvoirs-ultimes', 'Découvrez les pouvoirs les plus puissants de Naruto, One Piece et Bleach', 'normal', 'from-red-950 to-black', 80, 7 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du pouvoir ultime de Naruto ?', ARRAY['Sage des Six Chemins','Mode eremitique','Nine-Tails Chakra Mode','Rasengan'], 0, 'Le Sage des Six Chemins est le pouvoir ultime de Naruto', 0, 'text', NULL),
  ('Quel est le nom du pouvoir de Gear 4 de Luffy ?', ARRAY['Gear 4 : Snake Man','Gear 4 : Tank Man','Gear 4 : Boundman','Gear 5'], 2, 'Gear 4 : Boundman est le nom du pouvoir de Gear 4 de Luffy', 1, 'text', NULL),
  ('Quel est le symbole du pouvoir de Bankai ?', ARRAY['🔥','❄️','💧','🌊'], 0, 'Le symbole du pouvoir de Bankai est représenté par des flammes', 2, 'emoji', '🔥'),
  ('Qui est le personnage le plus fort de la série One Piece ?', ARRAY['Monkey D. Luffy','Gol D. Roger','Shanks','Akainu'], 1, 'Gol D. Roger est considéré comme le personnage le plus fort de la série One Piece', 3, 'text', NULL),
  ('Quel est le nom du pouvoir de Ichigo en mode Bankai ?', ARRAY['Tensa Zangetsu','Wabisuke','Suzumebachi','Komamura'], 0, 'Tensa Zangetsu est le nom du pouvoir de Ichigo en mode Bankai', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 3: Les alliances et les ennemis
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les alliances et les ennemis', 'les-alliances-et-les-ennemis', 'Découvrez les alliances et les ennemis de Naruto, One Piece et Bleach', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de l''alliance formée par Naruto, Sasuke et Sakura ?', ARRAY['Team 7','Team 9','Team 10','Team Gai'], 0, 'Team 7 est le nom de l''alliance formée par Naruto, Sasuke et Sakura', 0, 'text', NULL),
  ('Qui est l''ennemi juré de Monkey D. Luffy ?', ARRAY['Marshall D. Teach','Boa Hancock','Donquixote Doflamingo','Buggy'], 0, 'Marshall D. Teach est l''ennemi juré de Monkey D. Luffy', 1, 'text', NULL),
  ('Quel est le symbole du pouvoir de Hollow ?', ARRAY['💀','👻','🕷️','🔪'], 0, 'Le symbole du pouvoir de Hollow est représenté par un crâne', 2, 'emoji', '💀'),
  ('Qui est le personnage qui a tué le père de Ichigo ?', ARRAY['Grand Fisher','Ulquiorra','Grimmjow','Zangetsu'], 0, 'Grand Fisher est le personnage qui a tué le père de Ichigo', 3, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 4: Les légendes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les légendes', 'les-legendes', 'Découvrez les légendes de Naruto, One Piece et Bleach', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du premier Hokage de Konoha ?', ARRAY['Hashirama Senju','Tobirama Senju','Hiruzen Sarutobi','Minato Namikaze'], 0, 'Hashirama Senju est le premier Hokage de Konoha', 0, 'text', NULL),
  ('Qui est le personnage le plus fort de l''univers de One Piece ?', ARRAY['Gol D. Roger','Edward Newgate','Shanks','Im Sama'], 3, 'Im Sama est considéré comme le personnage le plus fort de l''univers de One Piece', 1, 'text', NULL),
  ('Quel est le symbole du pouvoir de la Soul Society ?', ARRAY['💫','🔮','💥','🕊️'], 3, 'Le symbole du pouvoir de la Soul Society est représenté par une colombe', 2, 'emoji', '🕊️'),
  ('Qui est le personnage qui a créé la série de Bleach ?', ARRAY['Tite Kubo','Eiichiro Oda','Masashi Kishimoto','Akira Toriyama'], 0, 'Tite Kubo est le personnage qui a créé la série de Bleach', 3, 'text', NULL),
  ('Quel est le nom du dernier arc de la série Naruto ?', ARRAY['Arc de la Guerre de la Quatrième Grande Guerre Ninja','Arc de la Guerre de la Troisième Grande Guerre Ninja','Arc de la Guerre de la Deuxième Grande Guerre Ninja','Arc de la Guerre de la Première Grande Guerre Ninja'], 0, 'L''arc de la Guerre de la Quatrième Grande Guerre Ninja est le dernier arc de la série Naruto', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 5: L'Attaque des Titans : Les Débuts
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''Attaque des Titans : Les Débuts', 'l-attaque-des-titans-les-debuts', 'Découvrez les premiers pas de l''histoire de L''Attaque des Titans', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le protagoniste principal de la série L''Attaque des Titans ?', ARRAY['Eren Yeager','Levi','Mikasa Ackerman','Armin Arlert'], 0, 'Eren Yeager est le personnage principal de la série.', 0, 'text', NULL),
  ('Qu''est-ce que les Titans dans la série ?', ARRAY['Des créatures géantes qui dévorent les humains','Des humains qui ont développé des pouvoirs spéciaux','Des animaux sauvages qui attaquent les humains','Des machines qui servent les humains'], 0, 'Les Titans sont des créatures géantes qui dévorent les humains sans raison apparente.', 1, 'text', NULL),
  ('Quelle est la fonction des Troupes d''exploration dans la série ?', ARRAY['Protéger les murs contre les Titans','Explorer l''extérieur des murs pour comprendre les Titans','Gérer les ressources alimentaires','Diriger le gouvernement'], 1, 'Les Troupes d''exploration ont pour but d''explorer l''extérieur des murs pour comprendre les Titans et trouver un moyen de les combattre.', 2, 'text', NULL),
  ('Quel symbole représentant le pouvoir des Titans ?', ARRAY['Un cercle','Un carré','Un triangle','Une étoile'], 2, 'Le triangle est un symbole souvent associé au pouvoir des Titans.', 3, 'emoji', '⬆️✨'),
  ('Qui est l''auteur du manga L''Attaque des Titans ?', ARRAY['Hajime Isayama','Eiichiro Oda','Masashi Kishimoto','Tite Kubo'], 0, 'Hajime Isayama est l''auteur du manga L''Attaque des Titans.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 6: L'Univers de L'Attaque des Titans
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''Univers de L''Attaque des Titans', 'l-univers-de-l-attaque-des-titans', 'Plongez dans l''univers sombre et intense de L''Attaque des Titans', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du premier Titan que rencontre Eren Yeager ?', ARRAY['Titan Colossal','Titan Bestial','Titan Blindé','Titan Féminin'], 0, 'Le Titan Colossal est le premier Titan que rencontre Eren Yeager.', 0, 'text', NULL),
  ('Quelle est la caractéristique principale de Levi ?', ARRAY['Sa force physique exceptionnelle','Sa capacité à manier les épées avec une grande précision','Sa capacité à utiliser les 3D Manoeuvre Gear','Sa grande taille'], 1, 'Levi est connu pour sa capacité à manier les épées avec une grande précision.', 1, 'text', NULL),
  ('🔪💪🏽👊', ARRAY['L''attaque des titans avec des lames','La force physique des Titans','L''utilisation des 3D Manoeuvre Gear','La technique de combat de Levi'], 3, 'La technique de combat de Levi implique une grande agilité et précision.', 2, 'emoji', '🔪💪🏽👊'),
  ('Quel est le but de la deuxième expedition de la Troupe d''exploration ?', ARRAY['Découvrir la vérité sur les Titans','Reprendre Wall Maria','Explorer l''extérieur des murs','Sauver les membres capturés'], 1, 'Le but de la deuxième expedition est de reprendre Wall Maria.', 3, 'text', NULL),
  ('Quelle est la fonction des murs dans l''univers de L''Attaque des Titans ?', ARRAY['Protéger les humains des Titans','Séparer les différents districts','Fournir un abri sûr pour les humains','Servir de base militaire'], 0, 'Les murs servent à protéger les humains des Titans.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 7: Les Mystères de L'Attaque des Titans
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Mystères de L''Attaque des Titans', 'les-mysteres-de-l-attaque-des-titans', 'Découvrez les mystères et les secrets de L''Attaque des Titans', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du créateur des Titans dans la série ?', ARRAY['Ymir Fritz','Karl Fritz','Reiner Braun','Rod Reiss'], 0, 'Ymir Fritz est considérée comme la créatrice des Titans.', 0, 'text', NULL),
  ('Quelle est la signification de la ''Coordinate'' dans la série ?', ARRAY['Un point de référence pour les Titans','Un lieu où les Titans se rassemblent','Un système de navigation pour les humains','Un symbole du pouvoir des Titans'], 0, 'La ''Coordinate'' fait référence à un point de référence pour les Titans.', 1, 'text', NULL),
  ('Quel événement a déclenché l''apparition des Titans ?', ARRAY['La chute de Wall Maria','L''apparition de Ymir Fritz','La découverte de la ''Coordinate''','L''expédition de la Troupe d''exploration'], 1, 'L''apparition de Ymir Fritz a déclenché l''apparition des Titans.', 2, 'text', NULL),
  ('🌐🔍🕵️‍♂️', ARRAY['La recherche de la vérité sur les Titans','La découverte de la ''Coordinate''','L''exploration de l''extérieur des murs','La chasse aux Titans'], 0, 'La recherche de la vérité sur les Titans est un thème central de la série.', 3, 'emoji', '🌐🔍🕵️‍♂️'),
  ('Quelle est l''image suivante ?', ARRAY['Un Titan','Un membre de la Troupe d''exploration','Un bâtiment','Un paysage'], 0, 'L''image montre un Titan.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 8: L'Attaque des Titans : Les Conflits
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''Attaque des Titans : Les Conflits', 'l-attaque-des-titans-les-conflits', 'Découvrez les conflits et les batailles de L''Attaque des Titans', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la bataille où les humains ont utilisé les 3D Manoeuvre Gear pour la première fois ?', ARRAY['Bataille de Trost','Bataille de Wall Maria','Bataille de Stohess','Bataille de Calaneth'], 0, 'La bataille de Trost est où les humains ont utilisé les 3D Manoeuvre Gear pour la première fois.', 0, 'text', NULL),
  ('Qui est le chef des Warriors Unités ?', ARRAY['Reiner Braun','Bertolt Hoover','Annie Leonhart','Zeke Yeager'], 3, 'Zeke Yeager est le chef des Warriors Unités.', 1, 'text', NULL),
  ('Quelle est la caractéristique de la ''Founding Titan'' ?', ARRAY['Sa grande taille','Sa capacité à contrôler les Titans','Sa force physique exceptionnelle','Sa vitesse'], 1, 'La ''Founding Titan'' a la capacité de contrôler les Titans.', 2, 'text', NULL),
  ('💥🔥🏹', ARRAY['La bataille de la Troupe d''exploration contre les Titans','L''attaque des Warriors Unités sur Paradis','La défense de Wall Maria','La recherche de la ''Coordinate'''], 0, 'La bataille de la Troupe d''exploration contre les Titans est un événement clé de la série.', 3, 'emoji', '💥🔥🏹'),
  ('Quelle est l''image suivante ?', ARRAY['Un membre de la Troupe d''exploration','Un Titan','Un bâtiment','Un paysage'], 1, 'L''image montre un Titan.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 9: Héros en herbe
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Héros en herbe', 'heros-en-herbe', 'Découvrez les jeunes héros de l''académie U.A.', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du héros principal de la série My Hero Academia ?', ARRAY['Izuku Midoriya','Katsuki Bakugo','Ochaco Uraraka','Tenya Iida'], 0, 'Izuku Midoriya est le protagoniste de la série.', 0, 'text', NULL),
  ('Quelle est la capacité de Quirk de Katsuki Bakugo ?', ARRAY['Explosion','Vitesse','Force','Invisibilité'], 0, 'Le Quirk de Katsuki Bakugo permet de créer des explosions.', 1, 'text', NULL),
  ('Quel est le symbole de la série My Hero Academia ?', ARRAY['Un sceau','Un éclair','Un hérisson','Un lion'], 0, 'Le sceau est un symbole important dans l''univers de My Hero Academia.', 2, 'text', NULL),
  ('Comment représenter le Quirk de Mina Ashido ?', ARRAY['😊','🏃‍♀️','🐠','💃'], 0, 'Le Quirk de Mina Ashido lui permet de produire de l''acide.', 3, 'emoji', '😊'),
  ('Quelle est l''apparance de All Might ?', ARRAY['Un vieil homme','Un homme musclé','Un géant','Un mutant'], 1, 'All Might est connu pour son apparence musclée et imposante.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 10: Les Professeurs
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Professeurs', 'les-professeurs', 'Découvrez les professeurs de l''académie U.A.', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du professeur de la classe 1-A ?', ARRAY['Aizawa','All Might','Present Mic','Thirteen'], 0, 'Aizawa est le professeur principal de la classe 1-A.', 0, 'text', NULL),
  ('Quelle est la spécialité de la professeure Midnight ?', ARRAY['La médecine','La technologie','La nuit','La musique'], 0, 'Midnight est une professeure de médecine.', 1, 'text', NULL),
  ('Comment représenter le Quirk de Present Mic ?', ARRAY['📣','🎤','👂','💣'], 0, 'Le Quirk de Present Mic lui permet de parler très fort.', 2, 'emoji', '📣'),
  ('Quelle est l''apparance de All For One ?', ARRAY['Un vieil homme','Un homme musclé','Un géant','Un mutant'], 0, 'All For One est un vieil homme avec un Quirk puissant.', 3, 'text', NULL),
  ('Quelle est l''image du logo de l''académie U.A. ?', ARRAY['Un sceau','Un éclair','Un hérisson','Un lion'], 0, 'Le logo de l''académie U.A. est un sceau.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 11: Les Villains
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Villains', 'les-villains', 'Découvrez les méchants de l''univers de My Hero Academia.', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du leader de la Ligue des Vilains ?', ARRAY['Tomura Shigaraki','All For One','Nomu','Dabi'], 0, 'Tomura Shigaraki est le leader de la Ligue des Vilains.', 0, 'text', NULL),
  ('Quelle est la capacité de Quirk de Nomu ?', ARRAY['Super force','Vitesse','Régénération','Invisibilité'], 2, 'Le Quirk de Nomu lui permet de se régénérer.', 1, 'text', NULL),
  ('Comment représenter le Quirk de Dabi ?', ARRAY['🔥','💀','👻','💣'], 0, 'Le Quirk de Dabi lui permet de créer des flammes.', 2, 'emoji', '🔥'),
  ('Quelle est l''apparance de Mr. Compress ?', ARRAY['Un homme petit','Un homme grand','Un géant','Un mutant'], 0, 'Mr. Compress est un homme petit.', 3, 'text', NULL),
  ('Quelle est l''image du logo de la Ligue des Vilains ?', ARRAY['Un sceau','Un éclair','Un hérisson','Un lion'], 0, 'Le logo de la Ligue des Vilains est un sceau.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 12: Les Arkes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Arkes', 'les-arkes', 'Découvrez les différents Arkes de l''univers de My Hero Academia.', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de l''Arke où se trouve la ville de Musutafu ?', ARRAY['Arke de la mer','Arke de la montagne','Arke de la forêt','Arke de la ville'], 3, 'La ville de Musutafu se trouve dans l''Arke de la ville.', 0, 'text', NULL),
  ('Quelle est la particularité de l''Arke de la forêt ?', ARRAY['Un climat tropical','Un terrain montagneux','Une dense forêt','Un désert'], 2, 'L''Arke de la forêt est caractérisée par une dense forêt.', 1, 'text', NULL),
  ('Comment représenter l''Arke de la mer ?', ARRAY['🌊','🏔️','🌴','🏃‍♂️'], 0, 'L''Arke de la mer est représentée par l''océan.', 2, 'emoji', '🌊'),
  ('Quelle est la particularité de l''Arke de la montagne ?', ARRAY['Un climat froid','Un terrain plat','Une haute montagne','Un désert'], 2, 'L''Arke de la montagne est caractérisée par une haute montagne.', 3, 'text', NULL),
  ('Quelle est l''image de la carte des Arkes ?', ARRAY['Un globe','Une carte','Un compas','Un boussole'], 1, 'La carte des Arkes est une représentation des différents Arkes.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 13: Découvrez Tanjiro
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Découvrez Tanjiro', 'decouvrez-tanjiro', 'Découvrez les secrets du héros de la série', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du héros de la série Kimetsu no Yaiba ?', ARRAY['Tanjiro Kamado','Zenitsu Agatsuma','Inosuke Hashibira','Giyu Tomioka'], 0, 'Tanjiro est le personnage principal de la série', 0, 'text', NULL),
  ('Quel est le nom de la sœur de Tanjiro ?', ARRAY['Nezuko Kamado','Kanae Kocho','Shinobu Kocho','Mitsuri Kanroji'], 0, 'Nezuko est la sœur de Tanjiro', 1, 'text', NULL),
  ('Quel est le style de combat de Tanjiro ?', ARRAY['Water Breathing','Fire Breathing','Thunder Breathing','Stone Breathing'], 1, 'Tanjiro utilise le style de combat du souffle de feu', 2, 'text', NULL),
  ('Quel est le nom de l''auteur de la série ?', ARRAY['Koyoharu Gotoge','Eiichiro Oda','Masashi Kishimoto','Tite Kubo'], 0, 'Koyoharu Gotoge est l''auteur de la série', 3, 'text', NULL),
  ('En combien d''épisodes se divise la première saison de l''anime ?', ARRAY['20','25','26','30'], 2, 'La première saison de l''anime compte 26 épisodes', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 14: Les démons de la nuit
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les démons de la nuit', 'les-demons-de-la-nuit', 'Découvrez les démons les plus puissants de la série', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le leader des démons de la nuit ?', ARRAY['Muzan Kibutsuji','Akaza','Gyutaro','Daki'], 0, 'Muzan est le leader des démons de la nuit', 0, 'text', NULL),
  ('Quel est le rang de Muzan Kibutsuji parmi les démons ?', ARRAY['Premier rang','Deuxième rang','Troisième rang','Quatrième rang'], 0, 'Muzan est de rang 1', 1, 'text', NULL),
  ('Quel est le nom du démon qui peut se déplacer à travers les ombres ?', ARRAY['Akaza','Gyutaro','Daki','Kokushibo'], 0, 'Akaza peut se déplacer à travers les ombres', 2, 'text', NULL),
  ('Quel démon est connu pour son apparence féminine ?', ARRAY['Daki','Gyutaro','Akaza','Muzan Kibutsuji'], 0, 'Daki a une apparence féminine', 3, 'text', NULL),
  ('Quel est le symbole de Muzan Kibutsuji ?', ARRAY['🔥','❄️','💎','🕷️'], 0, 'Le symbole de Muzan est le feu', 4, 'emoji', '🔥')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 15: Les légendaires
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les légendaires', 'les-legendaires', 'Découvrez les légendaires de la série', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du légendaire qui utilise le style du souffle de l''eau ?', ARRAY['Giyu Tomioka','Tanjiro Kamado','Zenitsu Agatsuma','Inosuke Hashibira'], 0, 'Giyu utilise le style du souffle de l''eau', 0, 'text', NULL),
  ('Qui est le légendaire qui peut entendre les battements de cœur des démons ?', ARRAY['Zenitsu Agatsuma','Inosuke Hashibira','Giyu Tomioka','Tanjiro Kamado'], 0, 'Zenitsu peut entendre les battements de cœur des démons', 1, 'text', NULL),
  ('Quel légendaire utilise le style du souffle de la foudre ?', ARRAY['Zenitsu Agatsuma','Inosuke Hashibira','Giyu Tomioka','Tanjiro Kamado'], 0, 'Zenitsu utilise le style du souffle de la foudre', 2, 'text', NULL),
  ('Quel est le nom du légendaire qui utilise le style du souffle du soleil ?', ARRAY['Giyu Tomioka','Tanjiro Kamado','Zenitsu Agatsuma','Kyojuro Rengoku'], 3, 'Kyojuro utilise le style du souffle du soleil', 3, 'text', NULL),
  ('Qui est le légendaire qui meurt face à Akaza ?', ARRAY['Kyojuro Rengoku','Giyu Tomioka','Tanjiro Kamado','Zenitsu Agatsuma'], 0, 'Kyojuro meurt face à Akaza', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 16: Les filles de la série
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les filles de la série', 'les-filles-de-la-serie', 'Découvrez les filles de la série', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est la sœur de Tanjiro ?', ARRAY['Nezuko Kamado','Kanae Kocho','Shinobu Kocho','Mitsuri Kanroji'], 0, 'Nezuko est la sœur de Tanjiro', 0, 'text', NULL),
  ('Quel est le nom de la fille qui utilise les insectes pour combattre ?', ARRAY['Mitsuri Kanroji','Shinobu Kocho','Kanae Kocho','Nezuko Kamado'], 1, 'Shinobu utilise les insectes pour combattre', 1, 'text', NULL),
  ('Quel est le symbole de Mitsuri Kanroji ?', ARRAY['💃','🕸️','💎','🌹'], 0, 'Le symbole de Mitsuri est la danse', 2, 'emoji', '💃'),
  ('Qui est la fille qui est l''amie de Tanjiro ?', ARRAY['Nezuko Kamado','Kanae Kocho','Shinobu Kocho','Muzan Kibutsuji'], 1, 'Kanae est l''amie de Tanjiro', 3, 'text', NULL),
  ('Quel est le nom de la fille qui se fait tuer par Daki ?', ARRAY['Kanae Kocho','Shinobu Kocho','Mitsuri Kanroji','Nezuko Kamado'], 0, 'Kanae se fait tuer par Daki', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 17: Introduction à Jujutsu Kaisen
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Introduction à Jujutsu Kaisen', 'introduction-a-jujutsu-kaisen', 'Découvrez les bases de l''univers de Jujutsu Kaisen', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le protagoniste principal de la série Jujutsu Kaisen ?', ARRAY['Yuuji Itadori','Megumi Fushiguro','Nobara Kugisaki','Sukuna'], 0, 'Yuuji Itadori est le personnage principal de la série.', 0, 'text', NULL),
  ('Qu''est-ce qu''un sorcier dans l''univers de Jujutsu Kaisen ?', ARRAY['Une personne avec des pouvoirs magiques','Une personne avec des pouvoirs physiques','Une personne avec des pouvoirs spirituels','Une personne sans pouvoirs'], 0, 'Les sorciers dans Jujutsu Kaisen sont des personnes capables d''utiliser la magie pour combattre les malédictions.', 1, 'text', NULL),
  ('Quel est le nom de l''école de sorcellerie que fréquentent les personnages principaux ?', ARRAY['Lycée Tokyo','Lycée de Kyoto','École de sorcellerie de Tokyo','Institut de sorcellerie de Kyoto'], 2, 'L''École de sorcellerie de Tokyo est l''institution où Yuuji et ses amis étudient.', 2, 'text', NULL),
  ('Que représente le symbole suivant : 👊💫', ARRAY['La force et la lumière','La magie et la puissance','Le courage et l''espoir','La détermination et la victoire'], 3, 'Le symbole représente la détermination et la victoire, symboles clés dans l''univers de Jujutsu Kaisen.', 3, 'emoji', '👊💫'),
  ('Qui est le professeur principal de l''École de sorcellerie de Tokyo ?', ARRAY['Satoru Gojo','Masamune Akuta','Kento Nanami','Toge Inumaki'], 0, 'Satoru Gojo est le professeur principal et l''un des personnages les plus puissants de la série.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 18: Les Malédictions
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Malédictions', 'les-maledictions', 'Comprenez les différents types de malédictions dans Jujutsu Kaisen', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qu''est-ce qu''une malédiction dans l''univers de Jujutsu Kaisen ?', ARRAY['Un esprit vengeur','Un être surnaturel','Une entité magique','Un humain avec des pouvoirs'], 1, 'Les malédictions sont des entités surnaturelles qui naissent des émotions négatives humaines.', 0, 'text', NULL),
  ('Quels sont les types principaux de malédictions ?', ARRAY['Malédictions faibles et fortes','Malédictions de type A et B','Malédictions spécialisées et non spécialisées','Malédictions humaines et non humaines'], 0, 'Les malédictions sont généralement classées en fonction de leur force ou de leur type d''attaque.', 1, 'text', NULL),
  ('Que signifie 🚫💔', ARRAY['La malédiction et la souffrance','La protection et la guérison','La force et la puissance','La lumière et l''espoir'], 0, 'Le symbole représente la malédiction et la souffrance, concepts clés dans Jujutsu Kaisen.', 2, 'emoji', '🚫💔'),
  ('Qui est l''un des plus puissants utilisateurs de malédictions de la série ?', ARRAY['Sukuna','Mahoraga','Geto Suguru','Kenjaku'], 0, 'Sukuna, également connu sous le nom du Roi de la malédiction, est l''un des personnages les plus puissants de la série.', 3, 'text', NULL),
  ('Qu''est-ce que le Domaine Cursed ?', ARRAY['Un espace physique pour les malédictions','Un rituel pour invoquer les malédictions','Un état mental pour combattre les malédictions','Un artefact pour contrôler les malédictions'], 0, 'Le Domaine Cursed est un espace physique créé par les sorciers pour combattre les malédictions.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 19: Les Sorciers
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Sorciers', 'les-sorciers', 'Découvrez les différents types de sorciers et leurs capacités dans Jujutsu Kaisen', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qu''est-ce qu''un sorcier de type ''Semi-technique'' dans Jujutsu Kaisen ?', ARRAY['Un sorcier qui utilise à la fois la magie et la technologie','Un sorcier qui utilise la magie pour améliorer ses capacités physiques','Un sorcier qui utilise la technologie pour amplifier ses pouvoirs magiques','Un sorcier qui combine la magie et la stratégie dans ses combats'], 1, 'Les sorciers de type ''Semi-technique'' utilisent la magie pour améliorer leurs capacités physiques.', 0, 'text', NULL),
  ('Qui est l''un des plus puissants sorciers de l''École de sorcellerie de Tokyo ?', ARRAY['Satoru Gojo','Megumi Fushiguro','Nobara Kugisaki','Maki Zen''in'], 0, 'Satoru Gojo est considéré comme l''un des sorciers les plus puissants de la série.', 1, 'text', NULL),
  ('Que représente 🌟💫', ARRAY['La puissance et la lumière','La vitesse et la force','La stratégie et l''intelligence','La chance et l''espoir'], 0, 'Le symbole représente la puissance et la lumière, symboles associés aux capacités des sorciers dans Jujutsu Kaisen.', 2, 'emoji', '🌟💫'),
  ('Qu''est-ce que le ''Six Éyes'' ?', ARRAY['Un style de combat','Un type de magie','Un symbole de pouvoir','Un titre honorifique'], 2, 'Le ''Six Éyes'' est un symbole de pouvoir et de statut parmi les sorciers, particulièrement associé à Gojo.', 3, 'text', NULL),
  ('Qui est le fondateur de l''École de sorcellerie de Tokyo ?', ARRAY['Satoru Gojo','Geto Suguru','Kenjaku','Yaga Masamune'], 3, 'Yaga Masamune est considéré comme le fondateur de l''École de sorcellerie de Tokyo.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 20: L'Univers de Jujutsu Kaisen
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''Univers de Jujutsu Kaisen', 'l-univers-de-jujutsu-kaisen', 'Plongez dans les règles et les mystères de l''univers de Jujutsu Kaisen', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qu''est-ce que la ''Ligne de la mort'' dans Jujutsu Kaisen ?', ARRAY['Un concept philosophique','Un événement historique','Un rituel magique','Un lieu géographique'], 0, 'La ''Ligne de la mort'' est un concept philosophique et métaphysique qui explore les limites de la vie et de la mort.', 0, 'text', NULL),
  ('Qui est derrière la conspiration pour détruire l''humanité dans Jujutsu Kaisen ?', ARRAY['Kenjaku','Geto Suguru','Mahoraga','Sukuna'], 0, 'Kenjaku est le principal antagoniste qui cherche à détruire l''humanité.', 1, 'text', NULL),
  ('Qu''est-ce que le ''Cursed Technique'' ?', ARRAY['Une technique de combat','Un type de magie','Un rituel d''invocation','Un état de transe'], 1, 'Le ''Cursed Technique'' fait référence aux différentes formes de magie ou de techniques que les sorciers utilisent pour combattre les malédictions.', 2, 'text', NULL),
  ('Que représente 🌐🕷️', ARRAY['Le monde et la destruction','La connaisssance et la sagesse','La puissance et la magie','La vie et la mort'], 0, 'Le symbole représente le monde et la destruction, thèmes centraux dans l''univers de Jujutsu Kaisen.', 3, 'emoji', '🌐🕷️'),
  ('Qu''est-ce que l''objectif principal de Yuuji Itadori dans la série ?', ARRAY['Devenir le plus fort sorcier','Sauver ses amis','Détruire toutes les malédictions','Comprendre et maîtriser le pouvoir de Sukuna'], 2, 'Yuuji cherche principalement à détruire toutes les malédictions pour protéger les innocents et apporter la paix.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 21: Introduction à Death Note
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Introduction à Death Note', 'introduction-a-death-note', 'Découvrez les bases de l''univers de Death Note', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le héros de la série Death Note ?', ARRAY['Light Yagami','L','Near','Misa Amane'], 0, 'Light Yagami est le personnage principal de la série', 0, 'text', NULL),
  ('Qu''est-ce que le Death Note ?', ARRAY['Un livre de comptes','Un carnet de notes','Un cahier magique','Un livre de la mort'], 3, 'Le Death Note est un cahier magique qui permet d''écrire le nom de ceux qui vont mourir', 1, 'text', NULL),
  ('Qui est le détective chargé d''enquêter sur les meurtres liés au Death Note ?', ARRAY['L','Near','Mello','Watari'], 0, 'L est le détective chargé d''enquêter sur les meurtres liés au Death Note', 2, 'text', NULL),
  ('Qu''est-ce que les Shinigamis dans l''univers de Death Note ?', ARRAY['Des dieux','Des démons','Des anges','Des créatures surnaturelles'], 3, 'Les Shinigamis sont des créatures surnaturelles qui ont le pouvoir de tuer les humains', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 22: Les personnages de Death Note
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les personnages de Death Note', 'les-personnages-de-death-note', 'Apprenez à connaître les personnages principaux de la série', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est la deuxième personne à utiliser le Death Note ?', ARRAY['Misa Amane','Near','Mello','Kyomi Takada'], 0, 'Misa Amane est la deuxième personne à utiliser le Death Note', 0, 'text', NULL),
  ('Quel est le vrai nom du détective L ?', ARRAY['Lawliet','Lind','Lawson','Leyton'], 0, 'Le vrai nom du détective L est Lawliet', 1, 'text', NULL),
  ('Qui est le rival de Light Yagami ?', ARRAY['L','Near','Mello','Lind'], 0, 'L est le rival de Light Yagami', 2, 'text', NULL),
  ('Qui est le successeur de L ?', ARRAY['Near','Mello','Watari','Aizawa'], 0, 'Near est le successeur de L', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 23: L'univers de Death Note
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''univers de Death Note', 'l-univers-de-death-note', 'Découvrez les règles et les secrets de l''univers de Death Note', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qu''est-ce que la ''mémoire des Shinigamis'' ?', ARRAY['La capacité de se souvenir de tout','La capacité de voir les âmes','La capacité de communiquer avec les Shinigamis','La capacité de tuer les humains'], 2, 'La mémoire des Shinigamis permet de communiquer avec les Shinigamis', 0, 'text', NULL),
  ('Quelle est la règle principale du Death Note ?', ARRAY['Écrire le nom d''une personne pour la tuer','Écrire le nom d''une personne pour la sauver','Écrire le nom d''une personne pour la rendre immortelle','Écrire le nom d''une personne pour la rendre invisible'], 0, 'La règle principale du Death Note est d''écrire le nom d''une personne pour la tuer', 1, 'text', NULL),
  ('Qu''est-ce que les ''YEARS'' dans l''univers de Death Note ?', ARRAY['Des années terrestres','Des années Shinigamis','Des années humaines','Des années divines'], 1, 'Les ''YEARS'' sont des années Shinigamis', 2, 'text', NULL),
  ('Qu''est-ce que le ''Trade-Off'' ?', ARRAY['Un échange d''informations','Un échange de pouvoirs','Un échange de vies','Un échange d''âmes'], 2, 'Le ''Trade-Off'' est un échange de vies', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 24: Les secrets de Death Note
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les secrets de Death Note', 'les-secrets-de-death-note', 'Découvrez les secrets et les mystères de la série Death Note', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le véritable but de Ryuk en utilisant le Death Note ?', ARRAY['Pour tuer des humains','Pour jouer avec les humains','Pour étudier les humains','Pour aider les humains'], 1, 'Ryuk utilise le Death Note pour jouer avec les humains', 0, 'text', NULL),
  ('Quel est le secret du Death Note que Light Yagami découvre ?', ARRAY['Que le Death Note peut tuer les Shinigamis','Que le Death Note peut ressusciter les morts','Que le Death Note peut donner des pouvoirs','Que le Death Note peut voir l''avenir'], 0, 'Le Death Note peut tuer les Shinigamis', 1, 'text', NULL),
  ('Qui est l''auteur du manga Death Note ?', ARRAY['Tsugumi Ohba','Eiichiro Oda','Masashi Kishimoto','Takehiko Inoue'], 0, 'Tsugumi Ohba est l''auteur du manga Death Note', 2, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 25: L'alchimie des frères
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''alchimie des frères', 'l-alchimie-des-freres', 'Découvrez les secrets de l''alchimie dans Fullmetal Alchemist', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du père des frères Elric ?', ARRAY['Hohenheim','Dante','Izumi','Maes Hughes'], 0, 'Hohenheim est le père de Edward et Alphonse Elric', 0, 'text', NULL),
  ('Qu''est-ce que l''alchimie ?', ARRAY['Une science qui permet de créer des armes','Une technique de transmutation des éléments','Une forme de magie','Une discipline de combat'], 1, 'L''alchimie est une technique qui permet de transmuter les éléments', 1, 'text', NULL),
  ('Quel est le but de la recherche des frères Elric ?', ARRAY['Devenir les alchimistes les plus puissants','Retrouver leur mère','Restaurer leurs corps','Conquérir le monde'], 2, 'Les frères Elric cherchent à restaurer leurs corps après avoir perdu des membres lors d''une transmutation ratée', 2, 'text', NULL),
  ('Quel est le symbole de l''alchimie ?', ARRAY['Un cercle avec une flèche','Un triangle avec un point','Un carré avec une croix','Un hexagone avec un cercle'], 1, 'Le symbole de l''alchimie est souvent représenté par un triangle avec un point', 3, 'text', NULL),
  ('Quelle est la loi fondamentale de l''alchimie ?', ARRAY['La loi de la conservation de la masse','La loi de la gravité','La loi de la thermodynamique','La loi de l''équivalence'], 0, 'La loi fondamentale de l''alchimie est la conservation de la masse', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 26: Les Homoncules
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Homoncules', 'les-homoncules', 'Découvrez les secrets des Homoncules dans Fullmetal Alchemist', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Combien d''Homoncules existe-t-il ?', ARRAY['5','6','7','8'], 2, 'Il existe 7 Homoncules dans la série Fullmetal Alchemist', 0, 'text', NULL),
  ('Quel est le but des Homoncules ?', ARRAY['Détruire les humains','Servir les humains','Conquérir le monde','Aider les frères Elric'], 0, 'Les Homoncules sont créés pour détruire les humains et accomplir les objectifs de leur créateur', 1, 'text', NULL),
  ('Quel est le nom du premier Homoncule ?', ARRAY['Pride','Envy','Wrath','Greed'], 0, 'Pride est le premier Homoncule créé par Dante', 2, 'text', NULL),
  ('Quel Homoncule représente la cupidité ?', ARRAY['🤖💰','💔😠','👻💀','🤝🌟'], 0, 'Le Homoncule Greed représente la cupidité', 3, 'emoji', '🤖💰'),
  ('Quel est le nom de l''Homoncule qui représente la colère ?', ARRAY['Wrath','Pride','Envy','Greed'], 0, 'Wrath est l''Homoncule qui représente la colère', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 27: Les personnages principaux
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les personnages principaux', 'les-personnages-principaux', 'Découvrez les personnages principaux de Fullmetal Alchemist', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du frère aîné des Elric ?', ARRAY['Edward','Alphonse','Maes Hughes','Roy Mustang'], 0, 'Edward est le frère aîné des Elric', 0, 'text', NULL),
  ('Qui est le chef des Homoncules ?', ARRAY['Pride','Envy','Wrath','Dante'], 0, 'Pride est le chef des Homoncules', 1, 'text', NULL),
  ('Quel personnage représente l''envie ?', ARRAY['👀💔','🤖💰','👻💀','🤝🌟'], 0, 'Envy est l''Homoncule qui représente l''envie', 2, 'emoji', '👀💔'),
  ('Quel est le nom de l''alchimiste qui aide les frères Elric ?', ARRAY['Izumi','Maes Hughes','Roy Mustang','Riza Hawkeye'], 0, 'Izumi est l''alchimiste qui aide les frères Elric', 3, 'text', NULL),
  ('Quel est le grade de Roy Mustang dans l''armée ?', ARRAY['Colonel','Général','Major','Capitaine'], 0, 'Roy Mustang est un colonel dans l''armée', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 28: L'univers de Fullmetal Alchemist
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''univers de Fullmetal Alchemist', 'l-univers-de-fullmetal-alchemist', 'Découvrez l''univers de Fullmetal Alchemist', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du pays où se déroule l''histoire de Fullmetal Alchemist ?', ARRAY['Amestris','Ishval','Xing','Aerthys'], 0, 'L''histoire de Fullmetal Alchemist se déroule principalement dans le pays d''Amestris', 0, 'text', NULL),
  ('Qu''est-ce que la Porte de la Vérité ?', ARRAY['Une porte qui mène à un monde parallèle','Une porte qui permet de voir la vérité','Une porte qui donne accès à des connaissances anciennes','Une porte qui permet de communiquer avec les dieux'], 1, 'La Porte de la Vérité est un portail qui permet à ceux qui le traversent de voir la vérité sur l''univers et sur eux-mêmes', 1, 'text', NULL),
  ('Quel est le nom de la technique d''alchimie qui consiste à créer des armes ?', ARRAY['Transmutation','Alchimie de combat','Création de forme','Manipulation de matière'], 1, 'L''alchimie de combat est une technique qui consiste à créer des armes ou des outils pour se battre', 2, 'text', NULL),
  ('Quel Homoncule représente la fierté ?', ARRAY['👑💫','🤖💰','👻💀','🤝🌟'], 0, 'Pride est l''Homoncule qui représente la fierté', 3, 'emoji', '👑💫'),
  ('Quelle est l''image de la première page du manga de Fullmetal Alchemist ?', ARRAY['Une image des frères Elric','Une image de la Porte de la Vérité','Une image d''un Homoncule','Une image de l''alchimiste Edward Elric'], 0, 'La première page du manga de Fullmetal Alchemist montre une image des frères Elric', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 29: Isekai Initiation
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Isekai Initiation', 'isekai-initiation', 'Découvrez les bases des mondes isekai', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du protagoniste de Re:Zero ?', ARRAY['Subaru Natsuki','Kazuma Satou','Saito Hiraga','Kirito'], 0, 'Subaru Natsuki est le personnage principal de Re:Zero', 0, 'text', NULL),
  ('Quel jeu vidéo est à l''origine de la série Sword Art Online ?', ARRAY['World of Warcraft','Final Fantasy XIV','Sword Art Online','Gunn Gale Online'], 2, 'Sword Art Online est un jeu vidéo virtuel dans la série', 1, 'text', NULL),
  ('Quel est le nom du monde dans Mushoku Tensei ?', ARRAY['Orstead','Eris','Reta','Synduja'], 0, 'Orstead est le nom du pays où se déroule Mushoku Tensei', 2, 'text', NULL),
  ('Qui est la déesse de la pauvreté dans Konosuba ?', ARRAY['Aqua','Megumin','Darkness','Eris'], 2, 'Darkness est souvent considérée comme la déesse de la pauvreté', 3, 'text', NULL),
  ('Quel est le nom du premier jeu en ligne massivement multijoueur de SAO ?', ARRAY['SAO','ALO','GGO','OS'], 0, 'SAO est le premier jeu en ligne massivement multijoueur', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 30: Les Héros Isekai
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Héros Isekai', 'les-heros-isekai', 'Découvrez les héros qui ont traversé les mondes', 'normal', 'from-red-950 to-black', 80, 7 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le héros de la série Re:Zero ?', ARRAY['Subaru Natsuki','Rem','Ram','Emilia'], 0, 'Subaru Natsuki est le héros de Re:Zero', 0, 'text', NULL),
  ('Quel est le nom du héros de la série Konosuba ?', ARRAY['Kazuma Satou','Aqua','Megumin','Darkness'], 0, 'Kazuma Satou est le héros de Konosuba', 1, 'text', NULL),
  ('Qui est le héros principal de Sword Art Online ?', ARRAY['Kirito','Asuna','Lisbeth','Silica'], 0, 'Kirito est le héros principal de SAO', 2, 'text', NULL),
  ('🏹💪 Qui est le personnage avec l''épée ?', ARRAY['Kirito','Subaru','Kazuma','Rudeus'], 0, 'Kirito est connu pour son épée', 3, 'emoji', '🏹💪'),
  ('Quel est le nom du père adoptif de Rudeus dans Mushoku Tensei ?', ARRAY['Paul','Geese','Ruijerd','Sylphiette'], 0, 'Paul est le père adoptif de Rudeus', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 31: Les Méchants Isekai
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Méchants Isekai', 'les-mechants-isekai', 'Découvrez les antagonistes qui les menacent', 'hard', 'from-red-950 to-black', 120, 9 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le principal antagoniste de la série Re:Zero ?', ARRAY['Betelgeuse','Puck','Satella','Echidna'], 0, 'Betelgeuse est l''antagoniste principal de Re:Zero', 0, 'text', NULL),
  ('Qui est le principal antagoniste de la série Konosuba ?', ARRAY['Verdell','Vanir','Hans','Wiz'], 0, 'Verdell est l''un des principaux antagonistes de Konosuba', 1, 'text', NULL),
  ('👊🏻💣 Qui est le personnage violent ?', ARRAY['Verdell','Megumin','Darkness','Vanir'], 1, 'Megumin est connue pour ses explosions', 2, 'emoji', '👊🏻💣'),
  ('http://image.url/konosuba.png', ARRAY['Kazuma Satou','Aqua','Megumin','Verdell'], 3, 'L''image montre Verdell', 3, 'image', NULL),
  ('Qui est le principal antagoniste de la série SAO ?', ARRAY['Kayaba Akihiko','Heathcliff','Kuradeel','PoH'], 0, 'Kayaba Akihiko est l''antagoniste principal de SAO', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 32: Les Monstres Isekai
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Monstres Isekai', 'les-monstres-isekai', 'Découvrez les monstres qui peuplent ces mondes', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du monstre que Subaru rencontre dans Re:Zero ?', ARRAY['White Whale','Mabeast','Carnage','Puck'], 1, 'Mabeast est un monstre dans la série Re:Zero', 0, 'text', NULL),
  ('🐲👻 Qui est le personnage avec les dragons ?', ARRAY['Megumin','Aqua','Darkness','Kazuma'], 0, 'Megumin est connue pour son pouvoir de l''explosion et son amour des dragons', 1, 'emoji', '🐲👻'),
  ('Qui est le monstre le plus fort dans la série Konosuba ?', ARRAY['Verdell','Vanir','Hans','Wiz'], 0, 'Verdell est l''un des monstres les plus forts de la série', 2, 'text', NULL),
  ('http://image.url/sao.png', ARRAY['Kirito','Asuna','Lisbeth','The Gleam Eyes'], 3, 'L''image montre The Gleam Eyes', 3, 'image', NULL),
  ('Quel est le nom du monstre que Rudeus affronte dans Mushoku Tensei ?', ARRAY['Ruijerd','Orsted','Hitogami','Sylphiette'], 0, 'Ruijerd est un Superd dans la série Mushoku Tensei', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 33: Sombres Héros
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Sombres Héros', 'sombres-heros', 'Découvrez les héros des seinen sombres', 'normal', 'from-red-950 to-black', 100, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du protagoniste de la série Berserk ?', ARRAY['Guts','Griffith','Casca','Farnese'], 0, 'Guts est le personnage principal de la série', 0, 'text', NULL),
  ('Quelle est la période historique dans laquelle se déroule Vinland Saga ?', ARRAY['Moyen Âge','Époque moderne','Préhistoire','Antiquité'], 0, 'Vinland Saga se déroule au XIe siècle', 1, 'text', NULL),
  ('Qui est le créateur de la série Monster ?', ARRAY['Naoki Urasawa','Kentaro Miura','Makoto Yukimura','Eiichiro Oda'], 0, 'Naoki Urasawa est le créateur de Monster', 2, 'text', NULL),
  ('Quel est le symbole de la confrérie des Chevaliers de l''Ordre de la Main de Dieu dans Berserk ?', ARRAY['Un croissant de lune','Un éclair','Un corbeau','Une main coupée'], 3, 'La main coupée est le symbole de la confrérie', 3, 'text', NULL),
  ('Quel est le thème principal de la série Vinland Saga ?', ARRAY['L''amour','La guerre','L''aventure','La découverte'], 1, 'La guerre est le thème principal de Vinland Saga', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 34: Créateurs de légendes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Créateurs de légendes', 'createurs-de-legendes', 'Découvrez les créateurs derrière les seinen sombres', 'hard', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le créateur de la série Berserk ?', ARRAY['Kentaro Miura','Naoki Urasawa','Makoto Yukimura','Eiichiro Oda'], 0, 'Kentaro Miura est le créateur de Berserk', 0, 'text', NULL),
  ('Quel est le style graphique caractéristique de la série Monster ?', ARRAY['Réaliste','Stylisé','Manga classique','Rétro'], 0, 'Le style graphique de Monster est réaliste', 1, 'text', NULL),
  ('Quelle est la nationalité du créateur de Vinland Saga ?', ARRAY['Japonais','Coréen','Chinois','Américain'], 0, 'Makoto Yukimura est japonais', 2, 'text', NULL),
  ('Quel est le genre de la série Vinland Saga ?', ARRAY['Aventure','Fantastique','Historique','Science-fiction'], 2, 'Vinland Saga est un seinen historique', 3, 'text', NULL),
  ('Quel est le thème principal de la série Monster ?', ARRAY['L''amour','La justice','La rédemption','La vengeance'], 2, 'La rédemption est un thème majeur de Monster', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 35: Symboles et Mythes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Symboles et Mythes', 'symboles-et-mythes', 'Découvrez les symboles et mythes des seinen sombres', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le symbole de la série Berserk ?', ARRAY['Le corbeau','Le loup','Le dragon','Le démon'], 0, 'Le corbeau est un symbole récurrent dans Berserk', 0, 'text', NULL),
  ('Quel est le mythe qui inspire la série Vinland Saga ?', ARRAY['Le mythe de Thor','Le mythe d''Odin','Le mythe de Ragnarök','Le mythe de la création'], 2, 'Vinland Saga s''inspire de la mythologie nordique', 1, 'text', NULL),
  ('Quel est le symbole du mal dans la série Monster ?', ARRAY['Le serpent','Le corbeau','Le loup','Le visage démoniaque'], 3, 'Le visage démoniaque est un symbole du mal dans Monster', 2, 'text', NULL),
  ('Quel est le thème de la série Vinland Saga représenté par l''image suivante ?', ARRAY['La guerre','L''amour','L''aventure','La découverte'], 0, 'La guerre est un thème majeur de Vinland Saga', 3, 'image', NULL),
  ('Quel est le symbole de la série Monster représenté par les emojis suivants ?', ARRAY['La justice','La rédemption','La vengeance','La pitié'], 1, 'La rédemption est un thème majeur de Monster', 4, 'emoji', '✝️🕊️💔')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 36: Histoires et légendes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Histoires et légendes', 'histoires-et-legendes', 'Découvrez les histoires et légendes des seinen sombres', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quelle est la période historique dans laquelle se déroule la série Vinland Saga ?', ARRAY['Moyen Âge','Époque moderne','Préhistoire','Antiquité'], 0, 'Vinland Saga se déroule au XIe siècle', 0, 'text', NULL),
  ('Qui est le personnage principal de la série Berserk ?', ARRAY['Guts','Griffith','Casca','Farnese'], 0, 'Guts est le personnage principal de la série', 1, 'text', NULL),
  ('Quel est le thème principal de la série Monster ?', ARRAY['L''amour','La justice','La rédemption','La vengeance'], 2, 'La rédemption est un thème majeur de Monster', 2, 'text', NULL),
  ('Quel est le symbole de la confrérie des Chevaliers de l''Ordre de la Main de Dieu dans Berserk représenté par l''image suivante ?', ARRAY['Un croissant de lune','Un éclair','Un corbeau','Une main coupée'], 3, 'La main coupée est le symbole de la confrérie', 3, 'image', NULL),
  ('Quel est le thème de la série Vinland Saga représenté par les emojis suivants ?', ARRAY['La guerre','L''amour','L''aventure','La découverte'], 0, 'La guerre est un thème majeur de Vinland Saga', 4, 'emoji', '⚔️🏹🔪')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 37: Anime Rocks
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Anime Rocks', 'anime-rocks', 'Testez vos connaissances sur les openings d''anime rock', 'normal', 'from-red-950 to-black', 100, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel groupe a interprété l''opening de l''anime ''Fullmetal Alchemist''?', ARRAY['L''Arc-en-Ciel','Asian Kung-Fu Generation','UVERworld','B''z'], 1, 'Asian Kung-Fu Generation a interprété ''Melissa'' pour Fullmetal Alchemist.', 0, 'text', NULL),
  ('Quelle chanson est l''opening de ''Naruto''?', ARRAY['Rocks','Haruka Kanata','Blue Bird','Tsubomi'], 1, 'Haruka Kanata est la première opening de Naruto.', 1, 'text', NULL),
  ('Qui a chanté l''opening de ''Bleach''?', ARRAY['Aqua Timez','ORANGE RANGE','ASIAN KUNG-FU GENERATION','UVERworld'], 0, 'Aqua Timez a interprété l''opening ''Alones'' pour Bleach.', 2, 'text', NULL),
  ('Quel est le titre de l''opening d''Afro Samurai?', ARRAY['Afro Samurai','Gethsemane','Certified Samurai','Sekai wa Sore Demo'], 2, 'Certified Samurai est l''opening d''Afro Samurai.', 3, 'text', NULL),
  ('Qui a composé la musique du générique de fin de ''Death Note''?', ARRAY['YUI','Akeboshi','Mika Nakashima','Aqua Timez'], 1, 'Akeboshi a composé la chanson ''White Night'' pour Death Note.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 38: J-Pop Anime
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'J-Pop Anime', 'j-pop-anime', 'Découvrez les hits J-Pop des animes', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui a chanté l''opening de Sailor Moon?', ARRAY['Momoiro Clover Z','Perfume','AKB48','Momoko Kikuchi'], 3, 'Momoko Kikuchi a interprété ''Moonlight Densetsu''.', 0, 'text', NULL),
  ('Quel groupe a interprété l''opening de ''One Piece''?', ARRAY['News','Kanjani8','Hey! Say! JUMP','Cool Wise Men'], 0, 'News a interprété ''We Go!'' pour One Piece.', 1, 'text', NULL),
  ('Qui chante l''opening de ''Magical Girl Lyrical Nanoha''?', ARRAY['Nana Mizuki','Yui Horie','Eri Kitamura','Aya Endo'], 0, 'Nana Mizuki a interprété ''Innocent Starter''.', 2, 'text', NULL),
  ('Quelle chanson est l''opening de ''Cardcaptor Sakura''?', ARRAY['Catch You Catch Me','Platinum','Sakura Kiss','Fruits Candy'], 0, 'Catch You Catch Me est l''une des openings de Cardcaptor Sakura.', 3, 'text', NULL),
  ('Qui a interprété le thème de ''Fruits Basket''?', ARRAY['Ritsuko Okazaki','Yui Horie','Maaya Sakamoto','Yui Aragaki'], 0, 'Ritsuko Okazaki a interprété ''For Fruits Basket''.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 39: Symphonie Animée
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Symphonie Animée', 'symphonie-animee', 'Découvrez les thèmes orchestraux des animes', 'hard', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel compositeur a créé la musique de ''Your Lie in April''?', ARRAY['Masaru Yokoyama','Nana Mizuki','Matsuo Hayato','Masato Nakayama'], 0, 'Masaru Yokoyama a orchestré la bande son de Your Lie in April.', 0, 'text', NULL),
  ('Quel est le nom du compositeur de la bande originale de ''Gankutsuou: The Count of Monte Cristo''?', ARRAY['Jean-Jacques Burnel','Koji Endo','Yoko Kanno','Seiji Yokoyama'], 2, 'Yoko Kanno a composé la musique de Gankutsuou.', 1, 'text', NULL),
  ('Qui est le compositeur de la série ''Ergo Proxy''?', ARRAY['Yoko Kanno','Dai Fukuyama','Akira Yamaoka','Ryuichi Sakamoto'], 0, 'Yoko Kanno a orchestré la bande son d''Ergo Proxy.', 2, 'text', NULL),
  ('Quelle est la chanson thème de ''Gurren Lagann''?', ARRAY['Sorairo Days','Daybreak''s Bell','Gambling','A Little Happiness'], 0, 'Sorairo Days est la première opening de Gurren Lagann.', 3, 'text', NULL),
  ('Qui a interprété le générique de fin de ''Haikyuu!!''?', ARRAY['Burnout Syndromes','NICO Touches the Walls','Suzumu','Miwa'], 0, 'Burnout Syndromes a interprété ''Tenchi Gaeshi'' pour Haikyuu!!.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 40: Émojis Anime
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Émojis Anime', 'emojis-anime', 'Reconnaissez les chansons à travers les émojis', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quelle chanson est représentée par : 🌙🕰️💫', ARRAY['Crossing Field','Unravel','Guren no Yumiya','Butter-Fly'], 1, 'Unravel est représenté par ces émojis.', 0, 'emoji', '🌙🕰️💫'),
  ('Quel anime a l''opening 🌊🐠🌴', ARRAY['One Piece','Naruto','Bleach','Free!'], 0, 'One Piece a une opening qui correspond à ces émojis.', 1, 'emoji', '🌊🐠🌴'),
  ('Quel est le titre de la chanson qui correspond à : 🏰👸💎', ARRAY['Magical Girl Lyrical Nanoha','Cardcaptor Sakura','Shugo Chara','Fairy Tail'], 1, 'Cardcaptor Sakura correspond à ces émojis.', 2, 'emoji', '🏰👸💎'),
  ('Qui est l''interprète de la chanson représentée par : 🏃‍♂️🌟🔥', ARRAY['Linked Horizon','UVERworld','Kana Nishino','GUMI'], 0, 'Linked Horizon correspond à ces émojis.', 3, 'emoji', '🏃‍♂️🌟🔥'),
  ('Quelle est l''image suivante ?', ARRAY['L''opening de Death Note','L''ending de Fullmetal Alchemist','Le logo de l''anime ''Attack on Titan''','La jaquette de l''album ''Neon Genesis Evangelion'''], 2, 'L''image représente le logo de l''anime ''Attack on Titan''.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 41: Les Seiyuu Stars
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Seiyuu Stars', 'les-seiyuu-stars', 'Découvrez les voix derrière vos animes préférés', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le seiyuu de Naruto Uzumaki dans l''anime Naruto ?', ARRAY['Jun Fukuyama','Mamoru Miyano','Kazuya Nakai','Junko Takeuchi'], 3, 'Junko Takeuchi est la voix de Naruto Uzumaki', 0, 'text', NULL),
  ('Quel est le nom du seiyuu qui incarne Light Yagami dans Death Note ?', ARRAY['Mamoru Miyano','Jun Fukuyama','Kazuya Nakai','Takahiro Sakurai'], 0, 'Mamoru Miyano est la voix de Light Yagami', 1, 'text', NULL),
  ('Qui double Goku dans l''anime Dragon Ball Z ?', ARRAY['Masako Nozawa','Takeshi Kusao','Ryo Horikawa','Bin Shimada'], 0, 'Masako Nozawa est la voix de Goku', 2, 'text', NULL),
  ('Quel seiyuu joue Edward Elric dans Fullmetal Alchemist ?', ARRAY['Romi Park','Rie Kugimiya','Takeshi Kusao','Kazuya Nakai'], 0, 'Romi Park est la voix d''Edward Elric', 3, 'text', NULL),
  ('Qui est la voix de Monkey D. Luffy dans l''anime One Piece ?', ARRAY['Mayumi Tanaka','Akemi Okamura','Kazue Ikura','Chisa Yokoyama'], 0, 'Mayumi Tanaka est la voix de Monkey D. Luffy', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 42: Les Meilleurs Seiyuu
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Meilleurs Seiyuu', 'les-meilleurs-seiyuu', 'Découvrez les seiyuu les plus talentueux', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui joue le rôle de Rin Okumura dans Blue Exorcist ?', ARRAY['Nobuhiko Okamoto','Koji Yusa','Ryohei Kimura','Daisuke Ono'], 0, 'Nobuhiko Okamoto est la voix de Rin Okumura', 0, 'text', NULL),
  ('Quel est le seiyuu de Sasuke Uchiha dans l''anime Naruto ?', ARRAY['Noriaki Sugiyama','Soichiro Hoshi','Tomokazu Seki','Hiroshi Kamiya'], 0, 'Noriaki Sugiyama est la voix de Sasuke Uchiha', 1, 'text', NULL),
  ('Qui est le seiyuu de Roronoa Zoro dans One Piece ?', ARRAY['Kazuya Nakai','Akira Ishida','Hiroaki Hirata','Ikue Otani'], 0, 'Kazuya Nakai est la voix de Roronoa Zoro', 2, 'text', NULL),
  ('Représenté par quels emojis, le seiyuu de Lelouch vi Lamperouge dans Code Geass est ?', ARRAY['Jun Fukuyama','Mamoru Miyano','Takuma Terashima','Yuki Kaji'], 0, 'Jun Fukuyama est la voix de Lelouch vi Lamperouge', 3, 'emoji', '👑🕊️💫'),
  ('Quel seiyuu joue le rôle de Kyon dans The Melancholy of Haruhi Suzumiya ?', ARRAY['Tomokazu Sugita','Daisuke Ono','Yuuichi Nakamura','Satoshi Hino'], 0, 'Tomokazu Sugita est la voix de Kyon', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 43: Seiyuu de Légende
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Seiyuu de Légende', 'seiyuu-de-legende', 'Découvrez les seiyuu qui ont marqué l''histoire de l''animation japonaise', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui joue le rôle de Vegeta dans l''anime Dragon Ball Z ?', ARRAY['Ryo Horikawa','Takeshi Kusao','Masako Nozawa','Bin Shimada'], 0, 'Ryo Horikawa est la voix de Vegeta', 0, 'text', NULL),
  ('Quel seiyuu est à l''origine de la voix de Kenshiro dans l''anime Hokuto no Ken ?', ARRAY['Akira Kamiya','Takeshi Kusao','Kazuyuki Sogabe','Hideyuki Tanaka'], 2, 'Kazuyuki Sogabe est la voix de Kenshiro', 1, 'text', NULL),
  ('Représenté par quels emojis, le seiyuu de Light Yagami est ?', ARRAY['Mamoru Miyano','Jun Fukuyama','Takahiro Sakurai','Daisuke Ono'], 0, 'Mamoru Miyano est la voix de Light Yagami', 2, 'emoji', '💡📝🕷️'),
  ('Quel est le nom du seiyuu qui a prêté sa voix à Sanji dans l''anime One Piece ?', ARRAY['Hiroaki Hirata','Kazuya Nakai','Ikue Otani','Yuriko Yamaguchi'], 0, 'Hiroaki Hirata est la voix de Sanji', 3, 'text', NULL),
  ('Sur quelle image peut-on reconnaître le seiyuu de Goku ?', ARRAY['Masako Nozawa','Takeshi Kusao','Ryo Horikawa','Bin Shimada'], 0, 'Masako Nozawa est la voix de Goku', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 44: Les secrets des Seiyuu
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les secrets des Seiyuu', 'les-secrets-des-seiyuu', 'Découvrez les coulisses de l''industrie des seiyuu', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel seiyuu a doublé le personnage de JoJo dans l''anime JoJo''s Bizarre Adventure ?', ARRAY['Tomokazu Sugita','Takahiro Sakurai','Hiroshi Kamiya','Daisuke Ono'], 0, 'Tomokazu Sugita est la voix de JoJo', 0, 'text', NULL),
  ('Qui est le seiyuu qui a prêté sa voix à Near dans l''anime Death Note ?', ARRAY['Nozomu Sasaki','Mamoru Miyano','Takahiro Sakurai','Daisuke Ono'], 0, 'Nozomu Sasaki est la voix de Near', 1, 'text', NULL),
  ('Représenté par quels emojis, le seiyuu de Monkey D. Luffy est ?', ARRAY['Mayumi Tanaka','Akemi Okamura','Kazue Ikura','Chisa Yokoyama'], 0, 'Mayumi Tanaka est la voix de Monkey D. Luffy', 2, 'emoji', '🐒🌊🎩'),
  ('Quel seiyuu a doublé le personnage de Rintaro Okabe dans l''anime Steins;Gate ?', ARRAY['Mamoru Miyano','Kana Hanazawa','Asami Imai','Hiroshi Kamiya'], 0, 'Mamoru Miyano est la voix de Rintaro Okabe', 3, 'text', NULL),
  ('Sur quelle image peut-on reconnaître le seiyuu de Sasuke Uchiha ?', ARRAY['Noriaki Sugiyama','Soichiro Hoshi','Tomokazu Seki','Hiroshi Kamiya'], 0, 'Noriaki Sugiyama est la voix de Sasuke Uchiha', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 45: JoJo's Bizarre Adventure : Les origines
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'JoJo''s Bizarre Adventure : Les origines', 'jojo-s-bizarre-adventure-les-origines', 'Découvrez les débuts de la saga JoJo''s Bizarre Adventure', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le premier héros de la série JoJo''s Bizarre Adventure ?', ARRAY['Jonathan Joestar','Joseph Joestar','Jotaro Kujo','Giorno Giovanna'], 0, 'Jonathan Joestar est le héros de la première partie de la série, Phantom Blood.', 0, 'text', NULL),
  ('Quel est le nom du vampire qui est l''antagoniste principal de la première partie ?', ARRAY['Dio Brando','Kars','Diavolo','Enrico Pucci'], 0, 'Dio Brando est le principal antagoniste de la première partie, Phantom Blood.', 1, 'text', NULL),
  ('Quelle est la capacité spéciale que Jonathan développe ?', ARRAY['Hammer','Ripple','Stand','Vampire'], 1, 'Jonathan développe la capacité de Ripple, une énergie vitale qui peut être utilisée pour lutter contre les vampires.', 2, 'text', NULL),
  ('Que représente 💉💊👊', ARRAY['Ripple','Hammer','Stand','Vampire'], 0, 'Les emojis représentent la capacité de Ripple, qui est liée à la médecine et à la force.', 3, 'emoji', '💉💊👊'),
  ('Qui est l''auteur de la série JoJo''s Bizarre Adventure ?', ARRAY['Hirohiko Araki','Eiichiro Oda','Masashi Kishimoto','Takehiko Inoue'], 0, 'Hirohiko Araki est l''auteur de la série JoJo''s Bizarre Adventure.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 46: JoJo's Bizarre Adventure : Les Stands
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'JoJo''s Bizarre Adventure : Les Stands', 'jojo-s-bizarre-adventure-les-stands', 'Découvrez les Stands de la série JoJo''s Bizarre Adventure', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qu''est-ce qu''un Stand dans la série JoJo''s Bizarre Adventure ?', ARRAY['Un esprit','Un vampire','Un pouvoir psychique','Un être physique'], 2, 'Un Stand est un pouvoir psychique qui peut prendre différentes formes.', 0, 'text', NULL),
  ('Qui est le premier personnage à développer un Stand ?', ARRAY['Jotaro Kujo','Joseph Joestar','Jonathan Joestar','Giorno Giovanna'], 0, 'Jotaro Kujo est le premier personnage à développer un Stand, Star Platinum.', 1, 'text', NULL),
  ('Que représente ⭐️👊💥', ARRAY['Star Platinum','Gold Experience','Hermit Purple','Magician''s Red'], 0, 'Les emojis représentent Star Platinum, le Stand de Jotaro Kujo.', 2, 'emoji', '⭐️👊💥'),
  ('Quel est le nom du Stand de Dio Brando dans la troisième partie ?', ARRAY['The World','King Crimson','Gold Experience','Made in Heaven'], 0, 'The World est le Stand de Dio Brando dans la troisième partie, Stardust Crusaders.', 3, 'text', NULL),
  ('Qui est le personnage principal de la cinquième partie, Golden Wind ?', ARRAY['Giorno Giovanna','Jotaro Kujo','Joseph Joestar','Jonathan Joestar'], 0, 'Giorno Giovanna est le personnage principal de la cinquième partie, Golden Wind.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 47: JoJo's Bizarre Adventure : Les personnages
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'JoJo''s Bizarre Adventure : Les personnages', 'jojo-s-bizarre-adventure-les-personnages', 'Découvrez les personnages de la série JoJo''s Bizarre Adventure', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le personnage principal de la deuxième partie, Battle Tendency ?', ARRAY['Joseph Joestar','Jonathan Joestar','Jotaro Kujo','Giorno Giovanna'], 0, 'Joseph Joestar est le personnage principal de la deuxième partie, Battle Tendency.', 0, 'text', NULL),
  ('Quel est le nom de l''allié de Jotaro Kujo dans la troisième partie ?', ARRAY['Avdol','Kakyoin','Polnareff','Iggy'], 0, 'Avdol est un allié de Jotaro Kujo dans la troisième partie, Stardust Crusaders.', 1, 'text', NULL),
  ('Que représente 🐕👦', ARRAY['Iggy','Avdol','Kakyoin','Polnareff'], 0, 'Les emojis représentent Iggy, un allié de Jotaro Kujo dans la troisième partie.', 2, 'emoji', '🐕👦'),
  ('Qui est le principal antagoniste de la sixième partie, Stone Ocean ?', ARRAY['Enrico Pucci','Diavolo','Dio Brando','Kars'], 0, 'Enrico Pucci est le principal antagoniste de la sixième partie, Stone Ocean.', 3, 'text', NULL),
  ('Quel est le nom du personnage principal de la septième partie, Steel Ball Run ?', ARRAY['Johnny Joestar','Gyro Zeppeli','Josuke Higashikata','Jotaro Kujo'], 0, 'Johnny Joestar est le personnage principal de la septième partie, Steel Ball Run.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 48: JoJo's Bizarre Adventure : Les arcs
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'JoJo''s Bizarre Adventure : Les arcs', 'jojo-s-bizarre-adventure-les-arcs', 'Découvrez les arcs de la série JoJo''s Bizarre Adventure', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de l''arc qui se déroule dans la ville de Morioh ?', ARRAY['Phantom Blood','Battle Tendency','Stardust Crusaders','Diamond is Unbreakable'], 3, 'Diamond is Unbreakable est l''arc qui se déroule dans la ville de Morioh.', 0, 'text', NULL),
  ('Quel est le nom de l''arc qui se déroule dans la ville de Rome ?', ARRAY['Golden Wind','Stone Ocean','Steel Ball Run','Jojolion'], 0, 'Golden Wind est l''arc qui se déroule dans la ville de Rome.', 1, 'text', NULL),
  ('Que représente https://upload.wikimedia.org/wikipedia/fr/4/45/Jojo_part_3.jpg', ARRAY['Stardust Crusaders','Diamond is Unbreakable','Golden Wind','Stone Ocean'], 0, 'L''image représente la troisième partie, Stardust Crusaders.', 2, 'image', NULL),
  ('Quel est le nom de l''arc qui se déroule dans la ville de S-City ?', ARRAY['Phantom Blood','Battle Tendency','Stardust Crusaders','Jojolion'], 3, 'Jojolion est l''arc qui se déroule dans la ville de S-City.', 3, 'text', NULL),
  ('Quel est le nom de l''arc qui se déroule dans la ville de Green Dolphin Street Prison ?', ARRAY['Stone Ocean','Steel Ball Run','Jojolion','Golden Wind'], 0, 'Stone Ocean est l''arc qui se déroule dans la ville de Green Dolphin Street Prison.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 49: Hunter x Hunter : Les Débuts
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Hunter x Hunter : Les Débuts', 'hunter-x-hunter-les-debuts', 'Découvrez les premiers pas de Gon dans le monde des chasseurs.', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du père de Gon Freecss ?', ARRAY['Ging Freecss','Killua Zoldyck','Kurapika','Leorio Paradinight'], 0, 'Ging Freecss est le père de Gon et un chasseur célèbre.', 0, 'text', NULL),
  ('Quel est l''objectif principal de Gon lors de l''examen des chasseurs ?', ARRAY['Devenir un chasseur pour trouver son père','Devenir riche et célèbre','Prendre sa revanche sur les autres candidats','Faire des amis'], 0, 'Gon veut devenir un chasseur pour trouver son père, Ging Freecss.', 1, 'text', NULL),
  ('Qui sont les amis que Gon rencontre lors de l''examen des chasseurs ?', ARRAY['Kite, Kurapika et Leorio','Killua, Kurapika et Leorio','Ging, Kite et Kurapika','Leorio, Kurapika et Hisoka'], 1, 'Gon rencontre Killua, Kurapika et Leorio lors de l''examen des chasseurs.', 2, 'text', NULL),
  ('Qu''est-ce que représente 🏹️️️💪', ARRAY['Un chasseur','Un ninja','Un guerrier','Un athlète'], 0, 'Un chasseur est représenté par 🏹️️️💪.', 3, 'emoji', '🏹️️️💪'),
  ('Quel est le nom de l''examen que Gon et ses amis doivent passer pour devenir des chasseurs ?', ARRAY['Examen des chasseurs','Tournoi des chasseurs','Examen de l''Association des chasseurs','Examen de la Fondation Hunter'], 0, 'Gon et ses amis doivent passer l''examen des chasseurs pour devenir des chasseurs.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 50: Hunter x Hunter : Les Pouvoirs
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Hunter x Hunter : Les Pouvoirs', 'hunter-x-hunter-les-pouvoirs', 'Découvrez les pouvoirs et les capacités des personnages principaux.', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le type de Nen de Gon ?', ARRAY['Enhancement','Emission','Transformation','Manipulation'], 0, 'Gon est un Enhancement, ce qui signifie qu''il peut augmenter ses capacités physiques.', 0, 'text', NULL),
  ('Qu''est-ce que représente ⚡️💫', ARRAY['Le Ren','Le Hatsu','Le Zetsu','Le Aura'], 1, 'Le Hatsu est représenté par ⚡️💫.', 1, 'emoji', '⚡️💫'),
  ('Qui est le maître de Killua en termes de Nen ?', ARRAY['Biscuit Krueger','Ging Freecss','Kite','Zeno Zoldyck'], 0, 'Biscuit Krueger est le maître de Killua en termes de Nen.', 2, 'text', NULL),
  ('Quel est le nom de l''aura de Gon ?', ARRAY['Jajanken','Ren','Hatsu','Zetsu'], 0, 'L''aura de Gon s''appelle Jajanken.', 3, 'text', NULL),
  ('Qu''est-ce que représente l''image suivante : https://upload.wikimedia.org/wikipedia/fr/thumb/6/63/Hunter_%C3%97_Hunter_-_Nen.svg/1024px-Hunter_%C3%97_Hunter_-_Nen.svg.png', ARRAY['Le symbole du Nen','Le logo de l''Association des chasseurs','Le blason de la famille Zoldyck','Le sceau de la Fondation Hunter'], 0, 'Le symbole du Nen est représenté par l''image.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 51: Hunter x Hunter : Les Arcs
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Hunter x Hunter : Les Arcs', 'hunter-x-hunter-les-arcs', 'Découvrez les différents arcs de l''histoire de Hunter x Hunter.', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du premier arc de l''histoire ?', ARRAY['Arc de l''examen des chasseurs','Arc de Yorknew','Arc de Greed Island','Arc de la Succession de la famille Zoldyck'], 0, 'Le premier arc de l''histoire est l''arc de l''examen des chasseurs.', 0, 'text', NULL),
  ('Qu''est-ce que représente 🌳🏠👥', ARRAY['L''île de Greed Island','La forêt de la deuxième étape de l''examen','La maison des Zoldyck','Le village de Gon'], 1, 'La forêt de la deuxième étape de l''examen est représentée par 🌳🏠👥.', 1, 'emoji', '🌳🏠👥'),
  ('Qui est l''antagoniste principal de l''arc de Yorknew ?', ARRAY['Chrollo Lucilfer','Meruem','Hisoka','Ging Freecss'], 0, 'Chrollo Lucilfer est l''antagoniste principal de l''arc de Yorknew.', 2, 'text', NULL),
  ('Quel est le nom de l''arc où Gon et ses amis doivent jouer à un jeu vidéo pour gagner des points ?', ARRAY['Arc de Greed Island','Arc de l''examen des chasseurs','Arc de Yorknew','Arc de la Succession de la famille Zoldyck'], 0, 'L''arc de Greed Island est celui où Gon et ses amis doivent jouer à un jeu vidéo.', 3, 'text', NULL),
  ('Qu''est-ce que représente l''image suivante : https://upload.wikimedia.org/wikipedia/fr/thumb/4/41/Hunter_%C3%97_Hunter_-_Yorknew.svg/1024px-Hunter_%C3%97_Hunter_-_Yorknew.svg.png', ARRAY['Le logo de l''arc de Yorknew','Le blason de la famille Zoldyck','Le sceau de la Fondation Hunter','Le symbole du Nen'], 0, 'Le logo de l''arc de Yorknew est représenté par l''image.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 52: Hunter x Hunter : Les Personnages
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Hunter x Hunter : Les Personnages', 'hunter-x-hunter-les-personnages', 'Découvrez les personnages principaux et secondaires de l''histoire.', 'abyssal', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du roi des fourmis ?', ARRAY['Meruem','Menthuthuyoupi','Shauapuff','Neferpitou'], 0, 'Meruem est le roi des fourmis.', 0, 'text', NULL),
  ('Qu''est-ce que représente 👑🐜', ARRAY['Le roi des fourmis','Le chef des Zoldyck','Le président de l''Association des chasseurs','Le directeur de la Fondation Hunter'], 0, 'Le roi des fourmis est représenté par 👑🐜.', 1, 'emoji', '👑🐜'),
  ('Qui est le tueur à gages de la famille Zoldyck ?', ARRAY['Illumi Zoldyck','Milluki Zoldyck','Kalluto Zoldyck','Zeno Zoldyck'], 0, 'Illumi Zoldyck est le tueur à gages de la famille Zoldyck.', 2, 'text', NULL),
  ('Quel est le nom de l''Association qui gère les chasseurs ?', ARRAY['L''Association des chasseurs','La Fondation Hunter','La Guilde des aventuriers','Le Conseil des chasseurs'], 0, 'L''Association des chasseurs gère les chasseurs.', 3, 'text', NULL),
  ('Qu''est-ce que représente l''image suivante : https://upload.wikimedia.org/wikipedia/fr/thumb/5/53/Hunter_%C3%97_Hunter_-_Meruem.svg/1024px-Hunter_%C3%97_Hunter_-_Meruem.svg.png', ARRAY['Le roi des fourmis','Le chef des Zoldyck','Le président de l''Association des chasseurs','Le directeur de la Fondation Hunter'], 0, 'Le roi des fourmis est représenté par l''image.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 53: Les Débuts de Goku
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Débuts de Goku', 'les-debuts-de-goku', 'Découvrez les premiers pas de Goku dans l''univers de Dragon Ball.', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du maître de Goku lors de ses débuts ?', ARRAY['Kame-Sen''nin','Tsuru-Sen''nin','Yamcha','Bulma'], 0, 'Kame-Sen''nin est le maître de Goku et de ses amis.', 0, 'text', NULL),
  ('Quel est le nom du père de Goku ?', ARRAY['Bardock','Kakarotto','Raditz','Nappa'], 1, 'Kakarotto est le nom que porte Goku sur la planète Saiyan.', 1, 'text', NULL),
  ('Quel est le nom de la planète d''origine de Goku ?', ARRAY['Terre','Namek','Vegeta','Saiyan'], 3, 'Goku est originaire de la planète Saiyan.', 2, 'text', NULL),
  ('Quel est le nom du rival de Goku lors de ses débuts ?', ARRAY['Yamcha','Tenshinhan','Piccolo','Vegeta'], 0, 'Yamcha est le premier rival de Goku.', 3, 'text', NULL),
  ('Quel est le nom de l''objet que Goku utilise pour se déplacer ?', ARRAY['Kinto-un','Nuage magique','Voiture','Bicycle'], 1, 'Le nuage magique est l''objet que Goku utilise pour se déplacer.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 54: Les Saiyans
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Saiyans', 'les-saiyans', 'Découvrez les secrets des guerriers les plus puissants de l''univers de Dragon Ball.', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du roi des Saiyans ?', ARRAY['Vegeta','Bardock','Nappa','Raditz'], 0, 'Vegeta est le prince des Saiyans, mais il est souvent considéré comme le roi.', 0, 'text', NULL),
  ('Quel est le symbole des Saiyans ?', ARRAY['🐲','👑','💪','🔥'], 0, 'Le symbole des Saiyans est le dragon, représenté par l''emoji 🐲.', 1, 'emoji', '🐲'),
  ('Quel est le nom de la technique de combat des Saiyans ?', ARRAY['Kamehameha','Galick Gun','Dragon Rush','Big Bang Attack'], 1, 'La Galick Gun est la technique de combat des Saiyans.', 2, 'text', NULL),
  ('Quel est le nom de la planète que les Saiyans ont détruite ?', ARRAY['Terre','Namek','Vegeta','Tamarane'], 3, 'Les Saiyans ont détruit la planète Tamarane.', 3, 'text', NULL),
  ('Quel est le nom du guerrier Saiyan qui a tué Nappa ?', ARRAY['Vegeta','Goku','Kuririn','Yamcha'], 1, 'Goku a tué Nappa lors de leur combat.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 55: Les Formes de Goku
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Formes de Goku', 'les-formes-de-goku', 'Découvrez les différentes formes que Goku a pu prendre au cours de la série.', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la première forme de Goku en Super Saiyan ?', ARRAY['Super Saiyan','Super Saiyan 2','Super Saiyan 3','Super Saiyan 4'], 0, 'La première forme de Goku en Super Saiyan est simplement appelée Super Saiyan.', 0, 'text', NULL),
  ('Quel est le symbole de la forme de Goku en Super Saiyan 3 ?', ARRAY['🔥','🐲','💫','🌟'], 0, 'Le symbole de la forme de Goku en Super Saiyan 3 est le feu, représenté par l''emoji 🔥.', 1, 'emoji', '🔥'),
  ('Quel est le nom de la forme de Goku en Super Saiyan 4 ?', ARRAY['Super Saiyan 4','Ultra Instinct','Kaio-ken','Big Bang Attack'], 0, 'La forme de Goku en Super Saiyan 4 est simplement appelée Super Saiyan 4.', 2, 'text', NULL),
  ('Quel est le nom de la technique de combat que Goku utilise en Super Saiyan 2 ?', ARRAY['Kamehameha','Galick Gun','Dragon Rush','Big Bang Attack'], 0, 'La technique de combat que Goku utilise en Super Saiyan 2 est le Kamehameha.', 3, 'text', NULL),
  ('Quel est le nom de l''image de la forme de Goku en Ultra Instinct ?', ARRAY['https://example.com/goku-ultra-instinct.jpg','https://example.com/goku-super-saiyan.jpg','https://example.com/goku-super-saiyan-2.jpg','https://example.com/goku-super-saiyan-3.jpg'], 0, 'L''image de la forme de Goku en Ultra Instinct est disponible à l''adresse https://example.com/goku-ultra-instinct.jpg.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 56: Les Ennemis de Goku
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Ennemis de Goku', 'les-ennemis-de-goku', 'Découvrez les ennemis les plus puissants que Goku a affrontés au cours de la série.', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de l''ennemi le plus puissant que Goku a affronté ?', ARRAY['Frieza','Cell','Babidi','Whis'], 0, 'Frieza est considéré comme l''un des ennemis les plus puissants de Goku.', 0, 'text', NULL),
  ('Quel est le symbole de l''ennemi Frieza ?', ARRAY['🐲','👑','💣','🔪'], 2, 'Le symbole de l''ennemi Frieza est l''explosion, représentée par l''emoji 💣.', 1, 'emoji', '💣'),
  ('Quel est le nom de la technique de combat que Goku utilise contre Frieza ?', ARRAY['Kamehameha','Galick Gun','Dragon Rush','Big Bang Attack'], 0, 'La technique de combat que Goku utilise contre Frieza est le Kamehameha.', 2, 'text', NULL),
  ('Quel est le nom de l''image de l''ennemi Cell ?', ARRAY['https://example.com/cell.jpg','https://example.com/frieza.jpg','https://example.com/babidi.jpg','https://example.com/whis.jpg'], 0, 'L''image de l''ennemi Cell est disponible à l''adresse https://example.com/cell.jpg.', 3, 'image', NULL),
  ('Quel est le nom du guerrier qui a aidé Goku à vaincre Frieza ?', ARRAY['Kuririn','Yamcha','Tenshinhan','Piccolo'], 3, 'Piccolo a aidé Goku à vaincre Frieza.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 57: Les Origines
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Origines', 'les-origines', 'Découvrez les débuts de l''univers One Piece', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le créateur de la série One Piece ?', ARRAY['Eiichiro Oda','Masashi Kishimoto','Takehiko Inoue','Rumiko Takahashi'], 0, 'Eiichiro Oda est le créateur de la série One Piece', 0, 'text', NULL),
  ('Quel est le nom du premier capitaine de l''équipage de Monkey D. Luffy ?', ARRAY['Shanks','Roronoa Zoro','Usopp','Sanji'], 1, 'Roronoa Zoro est le premier membre à rejoindre l''équipage de Monkey D. Luffy', 1, 'text', NULL),
  ('Quel est le nom du village natal de Monkey D. Luffy ?', ARRAY['Fushia Village','Water 7','Fishman Island','Dawn Island'], 3, 'Dawn Island est le village natal de Monkey D. Luffy', 2, 'text', NULL),
  ('Quel est le nom du navire de l''équipage de Monkey D. Luffy ?', ARRAY['Thousand Sunny','Going Merry','Oro Jackson','Baratie'], 1, 'Going Merry est le premier navire de l''équipage de Monkey D. Luffy', 3, 'text', NULL),
  ('Quel est le nom du pouvoir du fruit que mange Monkey D. Luffy ?', ARRAY['Gum-Gum Fruit','Mera Mera no Mi','Ito Ito no Mi','Yami Yami no Mi'], 0, 'Gum-Gum Fruit est le nom du pouvoir du fruit que mange Monkey D. Luffy', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 58: Les Équipages
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Équipages', 'les-equipages', 'Découvrez les différents équipages de l''univers One Piece', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de l''équipage de Trafalgar Law ?', ARRAY['Heart Pirates','Donquixote Pirates','Big Mom Pirates','Blackbeard Pirates'], 0, 'Heart Pirates est l''équipage de Trafalgar Law', 0, 'text', NULL),
  ('Qui est le capitaine des Red Hair Pirates ?', ARRAY['Shanks','Whitebeard','Kaido','Big Mom'], 0, 'Shanks est le capitaine des Red Hair Pirates', 1, 'text', NULL),
  ('Quel est l''emblème de l''équipage de Monkey D. Luffy ?', ARRAY['🐒','🔥','💎','🏴‍☠️'], 0, 'L''emblème de l''équipage de Monkey D. Luffy est un singe (Jolly Roger)', 2, 'emoji', '🐒'),
  ('Quel est le nom du deuxième membre à rejoindre l''équipage de Monkey D. Luffy ?', ARRAY['Roronoa Zoro','Usopp','Sanji','Tony Tony Chopper'], 1, 'Usopp est le deuxième membre à rejoindre l''équipage de Monkey D. Luffy', 3, 'text', NULL),
  ('Qui est le médecin de l''équipage de Monkey D. Luffy ?', ARRAY['Tony Tony Chopper','Sanji','Usopp','Nami'], 0, 'Tony Tony Chopper est le médecin de l''équipage de Monkey D. Luffy', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 59: Les Îles
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Îles', 'les-iles', 'Découvrez les différentes îles de l''univers One Piece', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quelle est la première île visitée par Monkey D. Luffy ?', ARRAY['Orange Town','Sydney','Water 7','Fishman Island'], 0, 'Orange Town est la première île visitée par Monkey D. Luffy', 0, 'text', NULL),
  ('Quelle est l''île où se trouve le siège du gouvernement mondial ?', ARRAY['Water 7','Fishman Island','Mariejois','Karai Bari'], 2, 'Mariejois est l''île où se trouve le siège du gouvernement mondial', 1, 'text', NULL),
  ('Quel est le symbole de l''île de Skypiea ?', ARRAY['🏯','🌆','🏞️','🌊'], 0, 'Le symbole de l''île de Skypiea est un temple ou une tour', 2, 'emoji', '🏯'),
  ('Quelle est l''île où se trouve le légendaire One Piece ?', ARRAY['Raftel','Water 7','Fishman Island','Skypiea'], 0, 'Raftel est l''île où se trouve le légendaire One Piece', 3, 'text', NULL),
  ('Quel est le nom de l''île où Monkey D. Luffy et son équipage ont rencontré les révolutionnaires ?', ARRAY['https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Dressrosa.jpg/1200px-Dressrosa.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Water_7.jpg/1200px-Water_7.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fishman_Island.jpg/1200px-Fishman_Island.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Skypiea.jpg/1200px-Skypiea.jpg'], 0, 'Dressrosa est l''île où Monkey D. Luffy et son équipage ont rencontré les révolutionnaires', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 60: Les Arcs
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Arcs', 'les-arcs', 'Découvrez les différents arcs de l''univers One Piece', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du premier arc de la série One Piece ?', ARRAY['East Blue','Alabasta','Sky Island','Water 7'], 0, 'East Blue est le premier arc de la série One Piece', 0, 'text', NULL),
  ('Quel est le nom de l''arc où Monkey D. Luffy et son équipage ont rencontré les CP9 ?', ARRAY['Water 7','Thriller Bark','Sabaody Archipelago','Marineford'], 0, 'Water 7 est l''arc où Monkey D. Luffy et son équipage ont rencontré les CP9', 1, 'text', NULL),
  ('Quel est le symbole de l''arc de Dressrosa ?', ARRAY['🤡','🌊','🏞️','🎭'], 0, 'Le symbole de l''arc de Dressrosa est un clown', 2, 'emoji', '🤡'),
  ('Quel est le nom de l''arc où Monkey D. Luffy et son équipage ont rencontré les Yonko ?', ARRAY['Wano','Dressrosa','Fishman Island','Skypiea'], 0, 'Wano est l''arc où Monkey D. Luffy et son équipage ont rencontré les Yonko', 3, 'text', NULL),
  ('Quel est le nom de l''arc où Monkey D. Luffy et son équipage ont rencontré les révolutionnaires ?', ARRAY['Dressrosa','Water 7','Fishman Island','https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Skypiea.jpg/1200px-Skypiea.jpg'], 0, 'Dressrosa est l''arc où Monkey D. Luffy et son équipage ont rencontré les révolutionnaires', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 61: Ninja Genin
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Ninja Genin', 'ninja-genin', 'Testez vos connaissances sur les jeunes ninjas de Konoha !', 'easy', 'from-red-950 to-black', 50, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du sensei de l''équipe 7 ?', ARRAY['Kakashi Hatake','Might Guy','Asuma Sarutobi','Iruka Umino'], 0, 'Kakashi Hatake est le sensei de l''équipe 7.', 0, 'text', NULL),
  ('Qui est le rival de Naruto ?', ARRAY['Sasuke Uchiwa','Sakura Haruno','Kiba Inuzuka','Shikamaru Nara'], 0, 'Sasuke Uchiwa est le rival de Naruto.', 1, 'text', NULL),
  ('Quel est le nom du village où se déroule l''histoire de Naruto ?', ARRAY['Konoha','Sunagakure','Kirigakure','Kumogakure'], 0, 'Konoha est le village où se déroule l''histoire de Naruto.', 2, 'text', NULL),
  ('Quelle est la technique spéciale de Naruto ?', ARRAY['Rasengan','Chidori','Kage Bunshin','Shuriken'], 0, 'Le Rasengan est la technique spéciale de Naruto.', 3, 'text', NULL),
  ('Qui est le Hokage lors de la première partie de la série ?', ARRAY['Tsunade','Danzō Shimura','Kakashi Hatake','Hiruzen Sarutobi'], 3, 'Hiruzen Sarutobi est le Hokage lors de la première partie de la série.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 62: Clans Uchiwa et Hyuga
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Clans Uchiwa et Hyuga', 'clans-uchiwa-et-hyuga', 'Découvrez les secrets des clans Uchiwa et Hyuga !', 'normal', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du clan de Sasuke ?', ARRAY['Uchiwa','Hyuga','Uzumaki','Senju'], 0, 'Le clan Uchiwa est le clan de Sasuke.', 0, 'text', NULL),
  ('Quelle est la particularité du clan Hyuga ?', ARRAY['Byakugan','Sharingan','Rinnegan','Kekkei Genkai'], 0, 'Le Byakugan est la particularité du clan Hyuga.', 1, 'text', NULL),
  ('Quel est le symbole du clan Uchiwa ?', ARRAY['🔥','🌙','🕷️','🔴'], 0, 'Le symbole du clan Uchiwa est representé par 🔥.', 2, 'emoji', '🔥'),
  ('Qui est le chef du clan Hyuga ?', ARRAY['Neji Hyuga','Hiashi Hyuga','Hinata Hyuga','Hanabi Hyuga'], 1, 'Hiashi Hyuga est le chef du clan Hyuga.', 3, 'text', NULL),
  ('Quelle est la relation entre les clans Uchiwa et Hyuga ?', ARRAY['Alliés','Ennemis','Rivaux','Ignorés'], 2, 'Les clans Uchiwa et Hyuga sont des rivaux.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 63: Ninja Legendaires
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Ninja Legendaires', 'ninja-legendaires', 'Découvrez les légendes des ninjas les plus puissants !', 'hard', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est considéré comme le plus grand ninja de tous les temps ?', ARRAY['Hashirama Senju','Tobirama Senju','Hiruzen Sarutobi','Minato Namikaze'], 0, 'Hashirama Senju est considéré comme le plus grand ninja de tous les temps.', 0, 'text', NULL),
  ('Quel est le nom du premier Hokage ?', ARRAY['Hashirama Senju','Tobirama Senju','Hiruzen Sarutobi','Minato Namikaze'], 0, 'Hashirama Senju est le premier Hokage.', 1, 'text', NULL),
  ('Quelle est la technique ultime de Kaguya ?', ARRAY['🌌💫','🔥💥','🌊🌴','🏔️🔝'], 0, 'La technique ultime de Kaguya est représentée par 🌌💫.', 2, 'emoji', '🌌💫'),
  ('Qui est le deuxième Hokage ?', ARRAY['Tobirama Senju','Hiruzen Sarutobi','Minato Namikaze','Tsunade'], 0, 'Tobirama Senju est le deuxième Hokage.', 3, 'text', NULL),
  ('Quelle est l''image du premier Hokage ?', ARRAY['https://example.com/hashirama.jpg','https://example.com/tobirama.jpg','https://example.com/hiruzen.jpg','https://example.com/minato.jpg'], 0, 'L''image du premier Hokage est disponible à l''adresse https://example.com/hashirama.jpg.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 64: Boruto, le fils de Naruto
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Boruto, le fils de Naruto', 'boruto-le-fils-de-naruto', 'Découvrez les aventures de Boruto, le fils de Naruto !', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du sensei de Boruto ?', ARRAY['Kakashi Hatake','Might Guy','Konohamaru Sarutobi','Sasuke Uchiwa'], 2, 'Konohamaru Sarutobi est le sensei de Boruto.', 0, 'text', NULL),
  ('Quelle est la particularité de Boruto ?', ARRAY['Byakugan','Sharingan','Rinnegan','Jougan'], 3, 'Le Jougan est la particularité de Boruto.', 1, 'text', NULL),
  ('Quel est le symbole de l''équipe de Boruto ?', ARRAY['🔵','🔴','🔷','🔶'], 0, 'Le symbole de l''équipe de Boruto est 🔵.', 2, 'emoji', '🔵'),
  ('Qui est le rival de Boruto ?', ARRAY['Sarada Uchiwa','Mitsuki','Inojin Yamanaka','Shikadai Nara'], 1, 'Mitsuki est le rival de Boruto.', 3, 'text', NULL),
  ('Quelle est l''image de Boruto ?', ARRAY['https://example.com/boruto.jpg','https://example.com/sarada.jpg','https://example.com/mitsuki.jpg','https://example.com/inroj.jpg'], 0, 'L''image de Boruto est disponible à l''adresse https://example.com/boruto.jpg.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 65: Pokémon : Les Incontournables
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Pokémon : Les Incontournables', 'pokemon-les-incontournables', 'Testez vos connaissances sur les Pokémon les plus célèbres.', 'normal', 'from-red-950 to-black', 120, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du premier Pokémon de la première génération ?', ARRAY['Bulbizarre','Salameche','Carapuce','Pikachu'], 0, 'Bulbizarre est le premier Pokémon de la première génération.', 0, 'text', NULL),
  ('Quel est le nom du chef de la Team Rocket dans la série Pokémon ?', ARRAY['Jessie','James','Sakaki','Giovanni'], 3, 'Giovanni est le chef de la Team Rocket dans la série Pokémon.', 1, 'text', NULL),
  ('Quel est le nom du héros de la première génération de Pokémon ?', ARRAY['Sacha','Lance','Brock','Misty'], 0, 'Sacha est le nom du héros de la première génération de Pokémon.', 2, 'text', NULL),
  ('Quel est le symbole du Pokémon Charizard ?', ARRAY['Un dragon','Un oiseau','Un serpent','Un lion'], 0, 'Le symbole du Pokémon Charizard est un dragon.', 3, 'emoji', '🐉'),
  ('Quel est le nom du Pokémon le plus rapide de la première génération ?', ARRAY['Pikachu','Sceptile','Mewtwo','Dragonite'], 3, 'Dragonite est le Pokémon le plus rapide de la première génération.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 66: Pokémon : Les Régions
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Pokémon : Les Régions', 'pokemon-les-regions', 'Découvrez les différentes régions du monde Pokémon.', 'easy', 'from-red-950 to-black', 80, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quelle est la première région visitée dans la série Pokémon ?', ARRAY['Kanto','Johto','Hoenn','Sinnoh'], 0, 'La région de Kanto est la première région visitée dans la série Pokémon.', 0, 'text', NULL),
  ('Quelle région est connue pour ses Pokémon de type glace ?', ARRAY['Sinnoh','Unova','Kalos','Alola'], 0, 'La région de Sinnoh est connue pour ses Pokémon de type glace.', 1, 'text', NULL),
  ('Quelle est la région où se déroule la série Pokémon XYZ ?', ARRAY['Kalos','Alola','Galar','Unova'], 0, 'La région de Kalos est où se déroule la série Pokémon XYZ.', 2, 'text', NULL),
  ('Quelle est l''emblème de la région d''Alola ?', ARRAY['Un palmier','Un volcan','Un arc-en-ciel','Un tatou'], 0, 'L''emblème de la région d''Alola est un palmier.', 3, 'emoji', '🌴'),
  ('Quelle est la région de la serie Pokémon Diamant et Perle ?', ARRAY['Sinnoh','Johto','Kanto','Hoenn'], 0, 'La région de Sinnoh est la région de la serie Pokémon Diamant et Perle.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 67: Pokémon : Les Maîtres
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Pokémon : Les Maîtres', 'pokemon-les-maitres', 'Découvrez les maîtres des différents types de Pokémon.', 'hard', 'from-red-950 to-black', 180, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le maître du type feu dans la série Pokémon ?', ARRAY['Lance','Brock','Misty','Flamand'], 3, 'Flamand est le maître du type feu dans la série Pokémon.', 0, 'text', NULL),
  ('Qui est le maître du type eau dans la série Pokémon ?', ARRAY['Lance','Brock','Misty','Crystel'], 2, 'Misty est le maître du type eau dans la série Pokémon.', 1, 'text', NULL),
  ('Quel est le symbole du maître du type électrique ?', ARRAY['Un éclair','Un nuage','Un soleil','Un oiseau'], 0, 'Le symbole du maître du type électrique est un éclair.', 2, 'emoji', '⚡️'),
  ('Qui est le maître du type glace dans la série Pokémon ?', ARRAY['Lorelei','Brawly','Wallace','Grant'], 0, 'Lorelei est le maître du type glace dans la série Pokémon.', 3, 'text', NULL),
  ('Qui est le maître du type sol dans la série Pokémon ?', ARRAY['Brock','Grant','Roxanne','Clay'], 3, 'Clay est le maître du type sol dans la série Pokémon.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 68: Pokémon : Les Légendes
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Pokémon : Les Légendes', 'pokemon-les-legendes', 'Découvrez les légendes du monde Pokémon.', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du Pokémon légendaire de la création dans la série Pokémon ?', ARRAY['Groudon','Kyogre','Rayquaza','Arceus'], 3, 'Arceus est le Pokémon légendaire de la création dans la série Pokémon.', 0, 'text', NULL),
  ('Quel est le nom du Pokémon légendaire de la mer dans la série Pokémon ?', ARRAY['Kyogre','Groudon','Rayquaza','Lugia'], 0, 'Kyogre est le Pokémon légendaire de la mer dans la série Pokémon.', 1, 'text', NULL),
  ('Quel est l''emblème du Pokémon légendaire de la terre ?', ARRAY['Un volcan','Un tremblement de terre','Un désert','Un canyon'], 0, 'L''emblème du Pokémon légendaire de la terre est un volcan.', 2, 'emoji', '🌋'),
  ('Quel est le nom du Pokémon légendaire de l''espace dans la série Pokémon ?', ARRAY['Dialga','Palkia','Giratina','Deoxys'], 3, 'Deoxys est le Pokémon légendaire de l''espace dans la série Pokémon.', 3, 'text', NULL),
  ('Quel est le nom du Pokémon légendaire de la forêt dans la série Pokémon ?', ARRAY['Celebi','Mew','Jirachi','Manaphy'], 0, 'Celebi est le Pokémon légendaire de la forêt dans la série Pokémon.', 4, 'image', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 69: Quiz Abyssal : MAPPA
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Quiz Abyssal : MAPPA', 'quiz-abyssal-mappa', 'Testez vos connaissances sur le studio d''animation MAPPA', 'normal', 'from-red-950 to-black', 100, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le premier anime produit par MAPPA ?', ARRAY['Zankyou no Terror','Kids on the Slope','Jujutsu Kaisen','The God of High School'], 0, 'MAPPA a produit Zankyou no Terror en 2014', 0, 'text', NULL),
  ('Quel est le nom du fondateur de MAPPA ?', ARRAY['Manabu Otsuka','Masahiko Minami','Hideyuki Kurata','Tetsuya Nakatake'], 0, 'Manabu Otsuka a fondé MAPPA en 2011', 1, 'text', NULL),
  ('Quel anime de MAPPA est basé sur un manga de Gege Akutami ?', ARRAY['Jujutsu Kaisen','The God of High School','Zombie Land Saga','Dorohedoro'], 0, 'Jujutsu Kaisen est basé sur un manga de Gege Akutami', 2, 'text', NULL),
  ('Qui est le character designer de Jujutsu Kaisen ?', ARRAY['Tadashi Hiramatsu','Gege Akutami','Tatsuya Matsubara','Yoji Ueda'], 0, 'Tadashi Hiramatsu a conçu les personnages de Jujutsu Kaisen', 3, 'text', NULL),
  ('Quel est le type de media du premier anime de MAPPA ?', ARRAY['Série TV','OAV','Film','ONA'], 0, 'Le premier anime de MAPPA, Zankyou no Terror, est une série TV', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 70: Quiz Ufotable
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Quiz Ufotable', 'quiz-ufotable', 'Découvrez les secrets du studio Ufotable', 'hard', 'from-red-950 to-black', 150, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du fondateur d''Ufotable ?', ARRAY['Hikaru Kondo','Akira Matsushima','Toshiyuki Shimazu','Katsuji Morishita'], 0, 'Hikaru Kondo a fondé Ufotable en 2000', 0, 'text', NULL),
  ('Quel anime d''Ufotable est basé sur un jeu vidéo de Type-Moon ?', ARRAY['Fate/Zero','Fate/stay night','The Tatami Galaxy','Kara no Kyoukai'], 0, 'Fate/Zero est basé sur un jeu vidéo de Type-Moon', 1, 'text', NULL),
  ('Quel est le type de media de la série Fate/stay night ?', ARRAY['Série TV','OAV','Film','ONA'], 0, 'Fate/stay night est une série TV', 2, 'text', NULL),
  ('Qui est le character designer de Fate/Zero ?', ARRAY['Yoshiyuki Sadamoto','Takashi Takeuchi','Atsushi Ikariya','Tomonori Sudo'], 1, 'Takashi Takeuchi a conçu les personnages de Fate/Zero', 3, 'text', NULL),
  ('Quel est le thème principal de l''anime Kara no Kyoukai ?', ARRAY['🔪💀','🏠👻','🌟🎭','👺💔'], 0, 'Kara no Kyoukai se concentre sur la mort et le surnaturel', 4, 'emoji', '🔪💀')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 71: Quiz Bones
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Quiz Bones', 'quiz-bones', 'Testez vos connaissances sur le studio d''animation Bones', 'easy', 'from-red-950 to-black', 80, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du fondateur de Bones ?', ARRAY['Hiroshi Osaka','Masahiko Minami','Toshihiro Kawamoto','Katsuji Morishita'], 1, 'Masahiko Minami a fondé Bones en 1998', 0, 'text', NULL),
  ('Quel anime de Bones est basé sur un manga de Eiichiro Oda ?', ARRAY['Fullmetal Alchemist','Soul Eater','My Hero Academia','One Piece'], 2, 'My Hero Academia est basé sur un manga de Kohei Horikoshi, mais Fullmetal Alchemist de Hiromu Arakawa a été produit par Bones', 1, 'text', NULL),
  ('Quel anime de Bones a pour titre : ''Noragami'' ?', ARRAY[':)','https://fr.wikipedia.org/wiki/Noragami','https://myanimelist.net/anime/20507/Noragami'], 1, 'Noragami est un anime produit par Bones en 2014', 2, 'image', NULL),
  ('Quel est le type de media du premier anime de Bones ?', ARRAY['Série TV','OAV','Film','ONA'], 1, 'Le premier anime de Bones, Cowboy Bebop: Knockin'' on Heaven''s Door, est un film', 3, 'text', NULL),
  ('Quel est le symbole du héros de My Hero Academia ?', ARRAY['🦸‍♂️','🐒','🌟','💫'], 0, 'Le symbole du héros de My Hero Academia est la combinaison de plusieurs symboles dont 🦸‍♂️', 4, 'emoji', '🦸‍♂️')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 72: Quiz Kyoto Animation
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Quiz Kyoto Animation', 'quiz-kyoto-animation', 'Découvrez les secrets du studio Kyoto Animation', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du fondateur de Kyoto Animation ?', ARRAY['Yoko Hatta','Hideaki Hatta','Yasuyuki Shimizu','Katsuji Morishita'], 1, 'Hideaki Hatta a fondé Kyoto Animation en 1981', 0, 'text', NULL),
  ('Quel anime de Kyoto Animation est basé sur un light novel de Nagomu Torii ?', ARRAY['The Melancholy of Haruhi Suzumiya','K-On!','Clannad','The Disappearance of Haruhi Suzumiya'], 0, 'The Melancholy of Haruhi Suzumiya est basé sur un light novel de Nagaru Tanigawa', 1, 'text', NULL),
  ('Quel anime de Kyoto Animation a pour thème principal l''amour ?', ARRAY['https://fr.wikipedia.org/wiki/Clannad','https://myanimelist.net/anime/4087/KOn','https://myanimelist.net/anime/31964/Violet_Evergarden'], 0, 'Clannad a pour thème principal l''amour et la famille', 2, 'image', NULL),
  ('Quel est le type de media de la série Free ! ?', ARRAY['Série TV','OAV','Film','ONA'], 0, 'Free ! est une série TV', 3, 'text', NULL),
  ('Quel est le symbole du héros de The Melancholy of Haruhi Suzumiya ?', ARRAY['🕰️','🔮','👽','🤔'], 2, 'Le symbole du héros de The Melancholy of Haruhi Suzumiya n''est pas clair, mais 👽 pourrait représenter les extraterrestres', 4, 'emoji', '👽')
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 73: Maîtres du dessin
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Maîtres du dessin', 'maitres-du-dessin', 'Découvrez les mangakas qui ont marqué l''histoire', 'normal', 'from-red-950 to-black', 120, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le créateur de ''Dragon Ball'' ?', ARRAY['Eiichiro Oda','Akira Toriyama','Masashi Kishimoto','Takehiko Inoue'], 1, 'Akira Toriyama est célèbre pour ''Dragon Ball'', une série de manga qui a révolutionné le genre shonen.', 0, 'text', NULL),
  ('Qui a dessiné ''One Piece'' ?', ARRAY['Eiichiro Oda','Akira Toriyama','Masashi Kishimoto','Takehiko Inoue'], 0, 'Eiichiro Oda est le mangaka derrière la série à succès ''One Piece'', connue pour son univers vaste et ses personnages colorés.', 1, 'text', NULL),
  ('Quel est le manga le plus célèbre de Kentaro Miura ?', ARRAY['Berserk','Gantz','Hellsing','Tokyo Ghoul'], 0, 'Berserk, créé par Kentaro Miura, est un classique du dark fantasy qui explore des thèmes matures et sombres.', 2, 'text', NULL),
  ('Qui est le mangaka derrière ''Death Note'' ?', ARRAY['Tsugumi Ohba et Takeshi Obata','Eiichiro Oda','Akira Toriyama','Masashi Kishimoto'], 0, 'Tsugumi Ohba et Takeshi Obata ont collaboré pour créer ''Death Note'', un thriller psychologique qui a captivé les lecteurs partout dans le monde.', 3, 'text', NULL),
  ('Qui est connu pour son œuvre ''Naruto'' ?', ARRAY['Masashi Kishimoto','Eiichiro Oda','Akira Toriyama','Takehiko Inoue'], 0, 'Masashi Kishimoto est le créateur de la série à succès ''Naruto'', qui a inspiré des générations de lecteurs avec son thème de l''amitié et de la persévérance.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 74: L'univers de l'horreur
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'L''univers de l''horreur', 'l-univers-de-l-horreur', 'Explorez les créateurs de mangas horreur', 'hard', 'from-red-950 to-black', 180, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui a créé la série ''Uzumaki'' ?', ARRAY['Junji Ito','Kentaro Miura','Hideo Yamamoto','Kazuhiro Kiuchi'], 0, 'Junji Ito est un maître du manga d''horreur, ''Uzumaki'' étant l''un de ses œuvres les plus emblématiques qui explore la fascination de la spirale.', 0, 'text', NULL),
  ('Qui est le créateur de ''Gantz'' ?', ARRAY['Hiroya Oku','Junji Ito','Hideo Yamamoto','Kazuhiro Kiuchi'], 0, 'Hiroya Oku est connu pour son œuvre ''Gantz'', un manga science-fiction qui plonge dans des thèmes sombres et violents.', 1, 'text', NULL),
  ('Quel manga d''horreur a été créé par Kentaro Miura ?', ARRAY['Berserk','Gantz','Uzumaki','Hellsing'], 0, 'Berserk, de Kentaro Miura, est un chef-d''œuvre du genre dark fantasy et de l''horreur, explorant des thèmes matures et sombres.', 2, 'text', NULL),
  ('Qui est derrière ''Tomie'' ?', ARRAY['Junji Ito','Kentaro Miura','Hideo Yamamoto','Atsushi Kaneko'], 0, 'Junji Ito a également créé ''Tomie'', une série d''histoires courtes qui capturent l''essence de l''horreur psychologique.', 3, 'text', NULL),
  ('L''univers de ''Hellsing'' a été créé par qui ?', ARRAY['Kouta Hirano','Junji Ito','Hideo Yamamoto','Kazuhiro Kiuchi'], 0, 'Kouta Hirano est le mangaka derrière ''Hellsing'', une série d''action et d''horreur qui explore la lutte contre les vampires.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 75: Romance et drame
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Romance et drame', 'romance-et-drame', 'Découvrez les œuvres de mangakas de romance et de drame', 'easy', 'from-red-950 to-black', 80, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le créateur de ''Sailor Moon'' ?', ARRAY['Naoko Takeuchi','Eiichiro Oda','Akira Toriyama','Rumiko Takahashi'], 0, 'Naoko Takeuchi est la mangaka qui a créé la série à succès ''Sailor Moon'', un classique du genre magical girl.', 0, 'text', NULL),
  ('Qui a dessiné ''Cardcaptor Sakura'' ?', ARRAY['Manga Team CLAMP','Eiichiro Oda','Akira Toriyama','Naoko Takeuchi'], 0, 'Le groupe de mangakas CLAMP est connu pour ses œuvres comme ''Cardcaptor Sakura'', qui mélange magie et romance.', 1, 'text', NULL),
  ('Quel manga est connu pour son mélange de romance et de science-fiction ?', ARRAY['Your Lie in April','Toradora!','The Pet Girl of Sakurasou','Steins;Gate'], 3, 'Steins;Gate est un manga et une série animée qui combine éléments de science-fiction et de thriller avec des thèmes de romance.', 2, 'text', NULL),
  ('Qui est derrière ''Fruits Basket'' ?', ARRAY['Natsuki Takaya','Naoko Takeuchi','Rumiko Takahashi','Yuki Midorikawa'], 0, 'Natsuki Takaya est la mangaka de ''Fruits Basket'', une série qui combine fantaisie, romance et drame.', 3, 'text', NULL),
  ('Quel est le titre du manga romantique de Makoto Shinkai ?', ARRAY['Your Name','The Garden of Words','5 Centimeters Per Second','Children Who Chase Lost Voices'], 0, 'Makoto Shinkai est connu pour ses films d''animation, mais ''Your Name'' est également un manga romantique et fantastique qui explore les thèmes de l''amour et de l''identité.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 76: Les légendes du manga
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les légendes du manga', 'les-legendes-du-manga', 'Explorez les vies et œuvres des mangakas légendaires', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est considéré comme l''un des premiers mangakas à avoir popularisé le genre ?', ARRAY['Osamu Tezuka','Akira Toriyama','Leiji Matsumoto','Shotaro Ishinomori'], 0, 'Osamu Tezuka, souvent appelé le ''Dieu du manga'', a été une figure clé dans la popularisation du manga au Japon et à l''étranger.', 0, 'text', NULL),
  ('Qui a créé ''Astro Boy'' ?', ARRAY['Osamu Tezuka','Akira Toriyama','Leiji Matsumoto','Shotaro Ishinomori'], 0, 'Osamu Tezuka est également le créateur de ''Astro Boy'', une série de science-fiction qui a marqué les débuts de l''industrie de l''animation japonaise.', 1, 'text', NULL),
  ('Qui est connu pour son travail sur ''Space Battleship Yamato'' ?', ARRAY['Leiji Matsumoto','Osamu Tezuka','Akira Toriyama','Shotaro Ishinomori'], 0, 'Leiji Matsumoto est célèbre pour son œuvre ''Space Battleship Yamato'', une série de science-fiction qui a contribué à façonner le genre space opera dans le manga et l''animation.', 2, 'text', NULL),
  ('Qui est derrière la création de ''Cyborg 009'' ?', ARRAY['Shotaro Ishinomori','Osamu Tezuka','Akira Toriyama','Leiji Matsumoto'], 0, 'Shotaro Ishinomori est le mangaka de ''Cyborg 009'', une série de science-fiction qui explore les thèmes de l''humanité et de la technologie.', 3, 'text', NULL),
  ('Quel est le nom du mangaka de ''Gigantor'' ?', ARRAY['Mitsuteru Yokoyama','Osamu Tezuka','Akira Toriyama','Leiji Matsumoto'], 0, 'Mitsuteru Yokoyama est le créateur de ''Gigantor'', un manga qui a popularisé le thème des robots géants dans la culture populaire japonaise.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 77: Au Top du Volley
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Au Top du Volley', 'au-top-du-volley', 'Testez vos connaissances sur Haikyuu !!', 'normal', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le protagoniste de l''anime Haikyuu ?', ARRAY['Shoyo Hinata','Tobio Kageyama','Kenma Kozume','Kuroo Tetsuro'], 0, 'Hinata est le personnage principal de l''anime.', 0, 'text', NULL),
  ('Quel est le nom de l''équipe de volley de l''école Karasuno ?', ARRAY['Les Crows','Les Falcons','Les Jackals','Les Karasuno High School Volleyball Team'], 3, 'L''équipe de volley de l''école Karasuno est surnommée ainsi.', 1, 'text', NULL),
  ('Qui est le capitaine de l''équipe de volley de l''école Aoba Johsai ?', ARRAY['Tobio Kageyama','Kenma Kozume','Oikawa Tooru','Iwaizumi Hajime'], 2, 'Oikawa est le capitaine de l''équipe Aoba Johsai.', 2, 'text', NULL),
  ('Quel est le poste de jeu de Shoyo Hinata ?', ARRAY['Attaquant','Central','Libero','Passeur'], 0, 'Hinata est un attaquant de première ligne.', 3, 'text', NULL),
  ('Quelle équipe est considérée comme la meilleure équipe de volley du lycée ?', ARRAY['Karasuno','Aoba Johsai','Nekoma','Fukurodani'], 3, 'Fukurodani est considérée comme l''une des meilleures équipes.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 78: Les Rois du Basket
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Rois du Basket', 'les-rois-du-basket', 'Testez vos connaissances sur Kuroko no Basket !!', 'hard', 'from-red-950 to-black', 180, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Qui est le personnage principal de l''anime Kuroko no Basket ?', ARRAY['Tetsuya Kuroko','Taiga Kagami','Ryota Kise','Shintaro Midorima'], 0, 'Kuroko est le personnage principal de l''anime.', 0, 'text', NULL),
  ('Qu''est-ce que le ''Miracle Generation'' ?', ARRAY['Une équipe de basket de lycée','Un groupe de joueurs de basket exceptionnels','Un tournoi de basket','Un club de fan de basket'], 1, 'Le ''Miracle Generation'' fait référence à un groupe de joueurs de basket exceptionnels.', 1, 'text', NULL),
  ('Quel est le symbole du lycée Seirin ?', ARRAY['🦁','🐺','🐯','🦊'], 1, 'Le symbole du lycée Seirin est le tanuki.', 2, 'emoji', '🦊'),
  ('Qui est le capitaine de l''équipe de basket du lycée Seirin ?', ARRAY['Tetsuya Kuroko','Taiga Kagami','Hyuga Junpei','Izuki Shun'], 2, 'Hyuga est le capitaine de l''équipe de basket du lycée Seirin.', 3, 'text', NULL),
  ('Quel est le nom de l''équipe de basket la plus forte du lycée ?', ARRAY['Rakuzan','Seirin','Shutoku','Kaijo'], 0, 'Rakuzan est considérée comme l''une des meilleures équipes.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 79: Connaissance Générale
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Connaissance Générale', 'connaissance-generale', 'Testez vos connaissances sur les deux animes !!', 'normal', 'from-red-950 to-black', 100, 8 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom du sport pratiqué dans les deux animes ?', ARRAY['Volley-ball','Basket-ball','Football','Base-ball'], 0, 'Le volley-ball et le basket-ball sont les sports pratiqués dans les deux animes.', 0, 'text', NULL),
  ('Quel est le personnage principal de l''anime Haikyuu ?', ARRAY['Shoyo Hinata','Tobio Kageyama','Kenma Kozume','Kuroo Tetsuro'], 0, 'Hinata est le personnage principal de l''anime Haikyuu.', 1, 'text', NULL),
  ('Quel est le symbole du lycée Seirin ?', ARRAY['🦁','🐺','🐯','🦊'], 1, 'Le symbole du lycée Seirin est le tanuki.', 2, 'emoji', '🦊'),
  ('Quel est le nom de l''équipe de volley de l''école Karasuno ?', ARRAY['Les Crows','Les Falcons','Les Jackals','Les Karasuno High School Volleyball Team'], 3, 'L''équipe de volley de l''école Karasuno est surnommée ainsi.', 3, 'text', NULL),
  ('Quel est le nom du personnage principal de l''anime Kuroko no Basket ?', ARRAY['Tetsuya Kuroko','Taiga Kagami','Ryota Kise','Shintaro Midorima'], 0, 'Kuroko est le personnage principal de l''anime Kuroko no Basket.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 80: Les Ennemis Jurés
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Les Ennemis Jurés', 'les-ennemis-jures', 'Testez vos connaissances sur les équipes adverse !!', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quelle équipe est considérée comme la plus forte équipe de volley dans l''anime Haikyuu ?', ARRAY['Karasuno','Aoba Johsai','Nekoma','Fukurodani'], 3, 'Fukurodani est considérée comme l''une des meilleures équipes de volley.', 0, 'text', NULL),
  ('Quel est le symbole de l''équipe de basket de l''école Rakuzan ?', ARRAY['🦁','🐺','🐯','🦊'], 0, 'Le symbole de l''équipe de basket de l''école Rakuzan est le lion.', 1, 'emoji', '🦁'),
  ('Quel est le nom de l''équipe de basket la plus forte du lycée dans l''anime Kuroko no Basket ?', ARRAY['Rakuzan','Seirin','Shutoku','Kaijo'], 0, 'Rakuzan est considérée comme l''une des meilleures équipes de basket.', 2, 'text', NULL),
  ('Quel est le nom du capitaine de l''équipe de basket de l''école Seirin ?', ARRAY['Tetsuya Kuroko','Taiga Kagami','Hyuga Junpei','Izuki Shun'], 2, 'Hyuga est le capitaine de l''équipe de basket de l''école Seirin.', 3, 'text', NULL),
  ('Quel est le nom de l''équipe de volley de l''école Karasuno dans l''anime Haikyuu ?', ARRAY['Les Crows','Les Falcons','Les Jackals','Les Karasuno High School Volleyball Team'], 3, 'L''équipe de volley de l''école Karasuno est surnommée ainsi.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 81: Amours éternelles
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Amours éternelles', 'amours-eternelles', 'Découvrez les côtés les plus touchants des romances anime', 'normal', 'from-red-950 to-black', 120, 10 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la série d''animation qui met en scène deux élèves du lycée qui échangent leurs corps?', ARRAY['Your Name','Toradora','Clannad','Sword Art Online'], 0, 'Your Name est una série d''animation japonaise de 2016 qui explore le thème de l''échange de corps entre deux élèves du lycée.', 0, 'text', NULL),
  ('Quel personnage principal de Toradora est connu pour son impulsivité et son tempérament chaud?', ARRAY['Ryūji Takasu','Taiga Aisaka','Minori Kushieda','Yusaku Kitamura'], 1, 'Taiga Aisaka est le personnage principal féminin de Toradora, connue pour son impulsivité et son tempérament chaud.', 1, 'text', NULL),
  ('Quelle est la signification du titre "Clannad"?', ARRAY['Famille','Amour','Amitié','Musique'], 0, 'Le titre "Clannad" est un mot gaélique qui signifie "famille" ou "enfant".', 2, 'text', NULL),
  ('Quel est le nom du personnage qui meurt dans la série Clannad?', ARRAY['Nagisa Furukawa','Sanae Furukawa','Akio Furukawa','Ushio Okazaki'], 0, 'Nagisa Furukawa meurt dans la série Clannad après avoir accouché de sa fille Ushio.', 3, 'text', NULL),
  ('Quel est le nom de la chanson thème de la série Your Name?', ARRAY['Zenzenzense','Kimi no Na wa','Yumetourou','Sparkle'], 0, 'La chanson thème de la série Your Name est "Zenzenzense" de RADWIMPS.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 82: Romances d'hiver
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Romances d''hiver', 'romances-d-hiver', 'Plongez dans les côtés les plus émouvants des romances anime d''hiver', 'hard', 'from-red-950 to-black', 180, 12 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la série d''animation qui se déroule dans une petite ville de montagne?', ARRAY['Clannad','Toradora','Your Name','March Comes in Like a Lion'], 0, 'Clannad se déroule dans une petite ville de montagne.', 0, 'text', NULL),
  ('Quel personnage de Toradora est connu pour son amour non partagé pour Taiga?', ARRAY['Ryūji Takasu','Yusaku Kitamura','Minori Kushieda','Kōji Haruta'], 1, 'Yusaku Kitamura est connu pour son amour non partagé pour Taiga dans la série Toradora.', 1, 'text', NULL),
  ('Quel est le symbole de l''amour entre les deux personnages principaux de Your Name?', ARRAY['🌟','💫','🌠','🏠'], 2, 'Le symbole de l''amour entre les deux personnages principaux de Your Name est la comète 🌠.', 2, 'emoji', '🌠'),
  ('Quel est le nom de la mère de Nagisa dans la série Clannad?', ARRAY['Sanae Furukawa','Akio Furukawa','Ushio Okazaki','Mei Sunohara'], 0, 'La mère de Nagisa dans la série Clannad est Sanae Furukawa.', 3, 'text', NULL),
  ('Quel est le nom de l''auteur de la série Your Name?', ARRAY['Makoto Shinkai','Jun Maekawa','Masashi Kishimoto','Eiichiro Oda'], 0, 'L''auteur de la série Your Name est Makoto Shinkai.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 83: Cœurs brisés
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Cœurs brisés', 'c-urs-brises', 'Découvrez les côtés les plus douloureux des romances anime', 'abyssal', 'from-red-950 to-black', 200, 15 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la série d''animation qui explore le thème de la perte et du deuil?', ARRAY['Clannad','Toradora','Your Name','AnoHana'], 0, 'Clannad explore le thème de la perte et du deuil.', 0, 'text', NULL),
  ('Quel personnage de Toradora est connu pour son passé douloureux?', ARRAY['Taiga Aisaka','Ryūji Takasu','Minori Kushieda','Yusaku Kitamura'], 0, 'Taiga Aisaka est connue pour son passé douloureux dans la série Toradora.', 1, 'text', NULL),
  ('Quel est le symbole de la séparation entre les deux personnages principaux de Your Name?', ARRAY['🌈','🌊','🚣','🌌'], 3, 'Le symbole de la séparation entre les deux personnages principaux de Your Name est l''univers 🌌.', 2, 'emoji', '🌌'),
  ('Quelle est l''image qui représente la tragédie de la série Clannad?', ARRAY['Une photo de famille','Un paysage de montagne','Un cimetière','Une église'], 2, 'Le cimetière représente la tragédie de la série Clannad.', 3, 'image', NULL),
  ('Quel est le nom de la chanson thème de la série Toradora?', ARRAY['Pre-Parade','Silky Heart','Orange','Lost My Music'], 0, 'La chanson thème de la série Toradora est "Pre-Parade" de Rie Kugimiya.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);

-- Quiz 84: Amours cachées
WITH cat AS (SELECT id FROM categories WHERE slug = 'otaku'),
q AS (
  INSERT INTO quizzes (category_id, title, slug, description, difficulty, cover_gradient, xp_reward, estimated_minutes)
  SELECT cat.id, 'Amours cachées', 'amours-cachees', 'Découvrez les côtés les plus secrets des romances anime', 'easy', 'from-red-950 to-black', 30, 5 FROM cat
  ON CONFLICT (category_id, slug) DO NOTHING
  RETURNING id
)
INSERT INTO questions (quiz_id, text, options, correct_index, explanation, sort_order, question_type, media_url)
SELECT q.id, v.text, v.options, v.correct_index, v.explanation, v.sort_order, v.question_type, v.media_url FROM q, (VALUES
  ('Quel est le nom de la série d''animation qui met en scène des élèves du lycée qui cachent leurs sentiments?', ARRAY['Toradora','Clannad','Your Name','The Pet Girl of Sakurasou'], 0, 'Toradora met en scène des élèves du lycée qui cachent leurs sentiments.', 0, 'text', NULL),
  ('Quel personnage de Clannad est connu pour son amour caché pour Nagisa?', ARRAY['Tomoya Okazaki','Sunohara','Mei Sunohara','Youhei Sunohara'], 0, 'Tomoya Okazaki est connu pour son amour caché pour Nagisa dans la série Clannad.', 1, 'text', NULL),
  ('Quel est le symbole de l''amour secret entre les deux personnages principaux de Your Name?', ARRAY['❤️','🔥','🌟','🌈'], 0, 'Le symbole de l''amour secret entre les deux personnages principaux de Your Name est le cœur ❤️.', 2, 'emoji', '❤️'),
  ('Quel est le nom de la série d''animation qui explore le thème de l''amour à distance?', ARRAY['Clannad','Toradora','Your Name','The Garden of Words'], 2, 'Your Name explore le thème de l''amour à distance.', 3, 'text', NULL),
  ('Quel est le nom de la chanson thème de la série Clannad?', ARRAY['Mag Mell','Dango Daikazoku','Chiisana Te no Hira','Kimi no Shiranai Monogatari'], 0, 'La chanson thème de la série Clannad est "Mag Mell" de eufonius.', 4, 'text', NULL)
) AS v(text, options, correct_index, explanation, sort_order, question_type, media_url);
