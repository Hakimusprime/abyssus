"use strict";

// Banque de quiz à choix multiples (bonne/mauvaise réponse, coûte des HP en cas d'échec).
// Difficulté : Débutant / Amateur / Confirmé / Expert / Maître / Abyssal
const QUIZ_QUESTIONS = [

// --- MANGA ---
{ id:"q1", domain:"Manga", difficulty:"Débutant", xp:10, question:"Qui est l'auteur de \"One Piece\" ?", choices:["Eiichiro Oda","Akira Toriyama","Masashi Kishimoto","Tite Kubo"], correct:0 },
{ id:"q2", domain:"Manga", difficulty:"Débutant", xp:10, question:"Dans \"Naruto\", quel est le nom du village natal du héros ?", choices:["Suna","Konoha","Kiri","Iwa"], correct:1 },
{ id:"q3", domain:"Manga", difficulty:"Débutant", xp:10, question:"Qui a créé \"Dragon Ball\" ?", choices:["Akira Toriyama","Eiichiro Oda","Rumiko Takahashi","Go Nagai"], correct:0 },
{ id:"q4", domain:"Manga", difficulty:"Amateur", xp:15, question:"Dans \"Death Note\", comment se nomme le dieu de la mort qui accompagne Light ?", choices:["Rem","Ryuk","Sidoh","Gelus"], correct:1 },
{ id:"q5", domain:"Manga", difficulty:"Amateur", xp:15, question:"Quel manga met en scène l'humanité assiégée par des Titans mangeurs d'hommes ?", choices:["Fullmetal Alchemist","L'Attaque des Titans","Tokyo Ghoul","Parasyte"], correct:1 },
{ id:"q6", domain:"Manga", difficulty:"Confirmé", xp:20, question:"Qui est l'auteur de \"Berserk\" ?", choices:["Kentaro Miura","Yoshihiro Togashi","Hirohiko Araki","Naoki Urasawa"], correct:0 },
{ id:"q7", domain:"Manga", difficulty:"Confirmé", xp:20, question:"Qui est l'auteur du manga \"Fullmetal Alchemist\" ?", choices:["Hiromu Arakawa","CLAMP","Kaori Yuki","Yana Toboso"], correct:0 },
{ id:"q8", domain:"Manga", difficulty:"Amateur", xp:15, question:"Qui est l'auteur de \"Slam Dunk\" ?", choices:["Takehiko Inoue","Yusei Matsui","Eiichiro Oda","Kazuki Takahashi"], correct:0 },

// --- ANIME ---
{ id:"q9", domain:"Anime", difficulty:"Débutant", xp:10, question:"Quel studio a produit la majorité des films de Hayao Miyazaki ?", choices:["Studio Ghibli","Toei Animation","MAPPA","Kyoto Animation"], correct:0 },
{ id:"q10", domain:"Anime", difficulty:"Débutant", xp:10, question:"Dans le dessin animé Pokémon (version française), comment s'appelle le dresseur principal ?", choices:["Sacha","Régis","Pierre","Ondine"], correct:0 },
{ id:"q11", domain:"Anime", difficulty:"Amateur", xp:15, question:"Quel anime met en scène des shinigami armés de sabres appelés Zanpakuto ?", choices:["Bleach","Naruto","Fairy Tail","One Piece"], correct:0 },
{ id:"q12", domain:"Anime", difficulty:"Confirmé", xp:20, question:"Qui a réalisé le film d'animation \"Your Name\" (Kimi no Na wa) ?", choices:["Makoto Shinkai","Hayao Miyazaki","Mamoru Hosoda","Satoshi Kon"], correct:0 },
{ id:"q13", domain:"Anime", difficulty:"Amateur", xp:15, question:"Dans \"Dragon Ball Z\", quelle est la planète d'origine de Goku ?", choices:["Namek","Planète Vegeta","Terre","Yardrat"], correct:1 },
{ id:"q14", domain:"Anime", difficulty:"Confirmé", xp:20, question:"Quel anime des années 90 suit des chasseurs de primes voyageant à bord du vaisseau Bebop ?", choices:["Cowboy Bebop","Trigun","Outlaw Star","Space Dandy"], correct:0 },
{ id:"q15", domain:"Anime", difficulty:"Débutant", xp:10, question:"Comment s'appelle le chat magique compagnon de Sailor Moon ?", choices:["Luna","Artemis","Diana","Mimi"], correct:0 },
{ id:"q16", domain:"Anime", difficulty:"Amateur", xp:15, question:"Dans quel anime le personnage \"L\" enquête-t-il sur un tueur en série ?", choices:["Death Note","Monster","Psycho-Pass","Erased"], correct:0 },

// --- CULTURE GÉNÉRALE ---
{ id:"q17", domain:"Culture générale", difficulty:"Amateur", xp:15, question:"Quelle est la capitale de l'Australie ?", choices:["Sydney","Melbourne","Canberra","Perth"], correct:2 },
{ id:"q18", domain:"Culture générale", difficulty:"Débutant", xp:10, question:"Quelle est la monnaie officielle du Japon ?", choices:["Le yuan","Le won","Le yen","Le baht"], correct:2 },
{ id:"q19", domain:"Culture générale", difficulty:"Débutant", xp:10, question:"Qui a peint \"La Joconde\" ?", choices:["Michel-Ange","Léonard de Vinci","Raphaël","Botticelli"], correct:1 },
{ id:"q20", domain:"Culture générale", difficulty:"Débutant", xp:10, question:"Quel est le plus grand océan du monde ?", choices:["Océan Atlantique","Océan Indien","Océan Pacifique","Océan Arctique"], correct:2 },
{ id:"q21", domain:"Culture générale", difficulty:"Débutant", xp:10, question:"Combien de joueurs une équipe de football aligne-t-elle sur le terrain ?", choices:["9","10","11","12"], correct:2 },
{ id:"q22", domain:"Culture générale", difficulty:"Amateur", xp:15, question:"Quelle est la langue maternelle la plus parlée au monde ?", choices:["L'anglais","Le mandarin","L'espagnol","L'hindi"], correct:1 },
{ id:"q23", domain:"Culture générale", difficulty:"Amateur", xp:15, question:"Quel est le symbole chimique de l'or ?", choices:["Ag","Au","Or","Go"], correct:1 },
{ id:"q24", domain:"Culture générale", difficulty:"Débutant", xp:10, question:"Dans quel pays se trouve la tour Eiffel ?", choices:["Belgique","Italie","France","Espagne"], correct:2 },

// --- SCIENCES ---
{ id:"q25", domain:"Sciences", difficulty:"Amateur", xp:15, question:"Quelle est, arrondie, la vitesse de la lumière dans le vide ?", choices:["150 000 km/s","300 000 km/s","500 000 km/s","1 000 000 km/s"], correct:1 },
{ id:"q26", domain:"Sciences", difficulty:"Confirmé", xp:20, question:"Combien d'os compte le squelette d'un adulte humain ?", choices:["186","206","226","246"], correct:1 },
{ id:"q27", domain:"Sciences", difficulty:"Débutant", xp:10, question:"Quelle est la planète la plus proche du Soleil ?", choices:["Vénus","Mercure","Mars","Terre"], correct:1 },
{ id:"q28", domain:"Sciences", difficulty:"Débutant", xp:10, question:"Quelle est la formule chimique de l'eau ?", choices:["CO2","H2O","O2","NaCl"], correct:1 },
{ id:"q29", domain:"Sciences", difficulty:"Amateur", xp:15, question:"Qui a formulé la théorie de la relativité générale ?", choices:["Isaac Newton","Niels Bohr","Albert Einstein","Galilée"], correct:2 },
{ id:"q30", domain:"Sciences", difficulty:"Débutant", xp:10, question:"Quel organe pompe le sang dans le corps humain ?", choices:["Le foie","Le cœur","Le poumon","Le rein"], correct:1 },
{ id:"q31", domain:"Sciences", difficulty:"Confirmé", xp:20, question:"Quelle est l'unité de mesure de la force dans le Système International ?", choices:["Le Joule","Le Watt","Le Newton","Le Pascal"], correct:2 },
{ id:"q32", domain:"Sciences", difficulty:"Confirmé", xp:20, question:"Combien de chromosomes possède une cellule humaine normale ?", choices:["23","44","46","48"], correct:2 },

// --- HISTOIRE ---
{ id:"q33", domain:"Histoire", difficulty:"Débutant", xp:10, question:"En quelle année a eu lieu la prise de la Bastille ?", choices:["1789","1799","1804","1776"], correct:0 },
{ id:"q34", domain:"Histoire", difficulty:"Débutant", xp:10, question:"Qui fut le premier empereur des Français ?", choices:["Louis XVI","Napoléon Bonaparte","Charlemagne","Louis-Philippe"], correct:1 },
{ id:"q35", domain:"Histoire", difficulty:"Débutant", xp:10, question:"En quelle année la Seconde Guerre mondiale a-t-elle pris fin ?", choices:["1943","1945","1947","1950"], correct:1 },
{ id:"q36", domain:"Histoire", difficulty:"Amateur", xp:15, question:"Quel mur, symbole de la Guerre froide, est tombé en 1989 ?", choices:["Le mur d'Hadrien","Le mur de Berlin","La Grande Muraille","Le mur des Lamentations"], correct:1 },
{ id:"q37", domain:"Histoire", difficulty:"Confirmé", xp:20, question:"Quel pharaon, mort jeune, est célèbre pour sa tombe découverte presque intacte en 1922 ?", choices:["Ramsès II","Akhenaton","Toutânkhamon","Khéops"], correct:2 },
{ id:"q38", domain:"Histoire", difficulty:"Débutant", xp:10, question:"Quelle civilisation a construit le Colisée de Rome ?", choices:["Les Grecs","Les Romains","Les Égyptiens","Les Byzantins"], correct:1 },
{ id:"q39", domain:"Histoire", difficulty:"Amateur", xp:15, question:"En quelle année Christophe Colomb a-t-il atteint les Amériques ?", choices:["1492","1500","1453","1521"], correct:0 },
{ id:"q40", domain:"Histoire", difficulty:"Confirmé", xp:20, question:"Quel traité a officiellement mis fin à la Première Guerre mondiale en 1919 ?", choices:["Le traité de Vienne","Le traité de Versailles","Le traité de Rome","Le traité de Yalta"], correct:1 },

// --- LITTÉRATURE ---
{ id:"q41", domain:"Littérature", difficulty:"Débutant", xp:10, question:"Qui a écrit \"Les Misérables\" ?", choices:["Victor Hugo","Émile Zola","Honoré de Balzac","Gustave Flaubert"], correct:0 },
{ id:"q42", domain:"Littérature", difficulty:"Amateur", xp:15, question:"Quel auteur russe a écrit \"Crime et Châtiment\" ?", choices:["Léon Tolstoï","Anton Tchekhov","Fiodor Dostoïevski","Ivan Tourgueniev"], correct:2 },
{ id:"q43", domain:"Littérature", difficulty:"Débutant", xp:10, question:"Qui est l'auteure de la saga \"Harry Potter\" ?", choices:["J.K. Rowling","Suzanne Collins","Stephenie Meyer","George R.R. Martin"], correct:0 },
{ id:"q44", domain:"Littérature", difficulty:"Amateur", xp:15, question:"Quel écrivain français a écrit \"L'Étranger\" ?", choices:["Jean-Paul Sartre","Albert Camus","André Gide","Marcel Pagnol"], correct:1 },
{ id:"q45", domain:"Littérature", difficulty:"Débutant", xp:10, question:"Qui a écrit \"Roméo et Juliette\" ?", choices:["Charles Dickens","William Shakespeare","Oscar Wilde","Jane Austen"], correct:1 },
{ id:"q46", domain:"Littérature", difficulty:"Confirmé", xp:20, question:"Quel est le nom du capitaine du Nautilus chez Jules Verne ?", choices:["Capitaine Achab","Capitaine Nemo","Capitaine Crochet","Capitaine Flint"], correct:1 },
{ id:"q47", domain:"Littérature", difficulty:"Amateur", xp:15, question:"Qui a écrit le roman \"1984\" ?", choices:["Aldous Huxley","Ray Bradbury","George Orwell","H.G. Wells"], correct:2 },
{ id:"q48", domain:"Littérature", difficulty:"Confirmé", xp:20, question:"Quel auteur est connu pour \"À la recherche du temps perdu\" ?", choices:["Marcel Proust","André Malraux","Louis-Ferdinand Céline","Romain Gary"], correct:0 },

// --- JEUX VIDÉO ---
{ id:"q49", domain:"Jeux vidéo", difficulty:"Débutant", xp:10, question:"Quelle entreprise a créé la console PlayStation ?", choices:["Nintendo","Sony","Microsoft","Sega"], correct:1 },
{ id:"q50", domain:"Jeux vidéo", difficulty:"Débutant", xp:10, question:"Dans quelle franchise incarne-t-on un plombier nommé Mario ?", choices:["Sonic","Super Mario","Zelda","Kirby"], correct:1 },
{ id:"q51", domain:"Jeux vidéo", difficulty:"Confirmé", xp:20, question:"Quel studio a développé \"The Witcher 3\" ?", choices:["CD Projekt Red","Bethesda","BioWare","FromSoftware"], correct:0 },
{ id:"q52", domain:"Jeux vidéo", difficulty:"Amateur", xp:15, question:"Dans \"The Legend of Zelda\", comment s'appelle le royaume principal ?", choices:["Hyrule","Termina","Lorule","Koholint"], correct:0 },
{ id:"q53", domain:"Jeux vidéo", difficulty:"Débutant", xp:10, question:"Quel jeu de survie et de construction en blocs est développé par Mojang ?", choices:["Terraria","Minecraft","Roblox","Fortnite"], correct:1 },
{ id:"q54", domain:"Jeux vidéo", difficulty:"Débutant", xp:10, question:"Quelle entreprise a créé la console Xbox ?", choices:["Sony","Nintendo","Microsoft","Valve"], correct:2 },
{ id:"q55", domain:"Jeux vidéo", difficulty:"Amateur", xp:15, question:"Dans \"Fortnite\", comment se nomme le mode principal où 100 joueurs s'affrontent ?", choices:["Battle Royale","Deathmatch","Survie","Capture du drapeau"], correct:0 },
{ id:"q56", domain:"Jeux vidéo", difficulty:"Débutant", xp:10, question:"Quel personnage est la mascotte historique de Sega ?", choices:["Crash Bandicoot","Sonic","Spyro","Rayman"], correct:1 },

// --- CINÉMA ---
{ id:"q57", domain:"Cinéma", difficulty:"Débutant", xp:10, question:"Qui a réalisé la trilogie \"Le Seigneur des Anneaux\" ?", choices:["Peter Jackson","James Cameron","Ridley Scott","Guillermo del Toro"], correct:0 },
{ id:"q58", domain:"Cinéma", difficulty:"Débutant", xp:10, question:"Quel film de James Cameron sorti en 2009 se déroule sur la planète Pandora ?", choices:["Interstellar","Avatar","Prometheus","Gravity"], correct:1 },
{ id:"q59", domain:"Cinéma", difficulty:"Amateur", xp:15, question:"Qui incarne Iron Man dans l'univers cinématographique Marvel ?", choices:["Chris Evans","Chris Hemsworth","Robert Downey Jr.","Mark Ruffalo"], correct:2 },
{ id:"q60", domain:"Cinéma", difficulty:"Amateur", xp:15, question:"Quel réalisateur est connu pour \"Pulp Fiction\" et \"Kill Bill\" ?", choices:["Martin Scorsese","Quentin Tarantino","David Fincher","Christopher Nolan"], correct:1 },
{ id:"q61", domain:"Cinéma", difficulty:"Débutant", xp:10, question:"Quel film d'animation Pixar met en scène des jouets qui prennent vie ?", choices:["Toy Story","Cars","Le Monde de Nemo","Là-haut"], correct:0 },
{ id:"q62", domain:"Cinéma", difficulty:"Débutant", xp:10, question:"Qui a réalisé \"Titanic\" et \"Avatar\" ?", choices:["Steven Spielberg","James Cameron","Michael Bay","Ron Howard"], correct:1 },
{ id:"q63", domain:"Cinéma", difficulty:"Amateur", xp:15, question:"Dans quelle ville fictive se déroulent la majorité des films Batman ?", choices:["Metropolis","Star City","Gotham City","Central City"], correct:2 },
{ id:"q64", domain:"Cinéma", difficulty:"Débutant", xp:10, question:"Quel acteur incarne Jack Sparrow dans \"Pirates des Caraïbes\" ?", choices:["Orlando Bloom","Johnny Depp","Geoffrey Rush","Javier Bardem"], correct:1 },

// --- TECHNOLOGIE ---
{ id:"q65", domain:"Technologie", difficulty:"Débutant", xp:10, question:"Qui a cofondé Apple avec Steve Wozniak ?", choices:["Bill Gates","Steve Jobs","Elon Musk","Larry Page"], correct:1 },
{ id:"q66", domain:"Technologie", difficulty:"Amateur", xp:15, question:"Que signifie l'acronyme \"HTML\" ?", choices:["HyperText Markup Language","High Tech Modern Language","Home Tool Markup Language","HyperTransfer Made Language"], correct:0 },
{ id:"q67", domain:"Technologie", difficulty:"Débutant", xp:10, question:"Quelle entreprise a créé le moteur de recherche Google ?", choices:["Microsoft","Google","Yahoo","Amazon"], correct:1 },
{ id:"q68", domain:"Technologie", difficulty:"Amateur", xp:15, question:"Que signifie l'acronyme \"CPU\" ?", choices:["Central Processing Unit","Computer Power Unit","Central Program Utility","Core Processing Unity"], correct:0 },
{ id:"q69", domain:"Technologie", difficulty:"Débutant", xp:10, question:"Quel réseau social a été fondé par Mark Zuckerberg ?", choices:["Twitter","Instagram","Facebook","LinkedIn"], correct:2 },
{ id:"q70", domain:"Technologie", difficulty:"Débutant", xp:10, question:"Quelle entreprise développe le système d'exploitation Windows ?", choices:["Apple","Microsoft","Google","IBM"], correct:1 },
{ id:"q71", domain:"Technologie", difficulty:"Amateur", xp:15, question:"Que signifie l'acronyme \"USB\" ?", choices:["Universal Serial Bus","United System Board","Universal System Backup","Unified Serial Board"], correct:0 },
{ id:"q72", domain:"Technologie", difficulty:"Confirmé", xp:20, question:"Quel langage de programmation est souvent représenté par un logo de serpent ?", choices:["Java","Python","Ruby","C++"], correct:1 }

];
