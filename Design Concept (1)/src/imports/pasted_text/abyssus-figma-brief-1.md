Vision et brief créatif pour Figma
Objectif  
Créer un prototype haute fidélité de ABYSSUS — Sanctuaire antique immergé qui servira de référence visuelle et de guide d’implémentation pour les développeurs. Le prototype doit traduire l’identité : sombre, luxueuse, mystérieuse, immersive, avec interactions subtiles, glassmorphism, glow bioluminescent et micro‑animations qui renforcent la tension abyssale.

Livrables Figma attendus  
- Design System : tokens (couleurs, typographie, espacements, radii, ombres), composants atomiques et variantes.  
- Pages prototypes : Home, Catalogue (groupes), Page Quiz, Player Quiz (flow complet), Profil, Zone Créateur (admin pending), Classements, Événement Boss, Modal récompense.  
- Prototype interactif : navigation sidebar, hover states, transitions de page, micro‑interactions (card hover, bouton, notification, timer HP).  
- Documentation de handoff : spécifications CSS, export d’assets, tokens, notes d’accessibilité, guidelines d’animation.

---

Structure Figma recommandée et composants clés
Pages Figma  
1. 00 Design System — tokens, palette, typographies, icônes, composants.  
2. 01 Landing Home — hero, home cards, spotlight quiz du jour.  
3. 02 Catalogues — vues par groupe, filtres, recherche.  
4. 03 Quiz Player — question, choix, chronomètre, feedback, fin de quiz.  
5. 04 Profil — progression, badges, historique.  
6. 05 Creator Admin — pending list, approve/reject modal.  
7. 06 Events Boss — écran événement, tentative, récompenses.  
8. 07 Settings & Themes — switcher thèmes, PWA prompt.

Composants à créer (avec variantes)  
- Sidebar : collapsed / expanded / mobile.  
- Top Hero : brand symbol, heartbeat variant.  
- Card : home-card, domain-card, small-card; states: default, hover, focused, disabled.  
- Button : primary, secondary, ghost, sm, danger; states: default, hover, active, loading.  
- Badge : xp, level, rare, legendary.  
- Modal : confirm, edit question, reward popup.  
- Toast / Notification : success, warning, error.  
- Timer HP : normal, depleted, regenerating.  
- Form elements : inputs, selects, toggles, file upload (for contributions).  
- Admin row : pending item with actions (approve, edit, reject).

Tokens à définir  
- Couleurs : --bg, --card, --gold, --amber, --cyan, --text, --muted.  
- Typographie : H1/H2/H3 sizes, body, caption, UI small. Polices : Cinzel pour titres, Inter pour UI.  
- Spacing : 4/8/12/16/24/32/48.  
- Radii : 6/10/16.  
- Shadows : soft glow, strong glow, inset.  
- Animation : durations (fast 120ms, normal 320ms, slow 600ms), easing curves.

---

Interactions et prototypes à définir dans Figma
Navigation  
- Sidebar click → page transition with fade + slide.  
- Mobile: sidebar overlay with backdrop blur.

Cards  
- Hover: translateY(-4px), border gold, cyan glow.  
- Click: ripple subtle + open page.

Quiz flow  
- Start quiz → modal confirmation → countdown 3s (animated) → question transitions (slide left).  
- Correct answer → green glow + XP pop animation; wrong → red pulse + show correct.  
- End screen → XP gain animation, badge reveal with confetti subtle.

Background & ambiance  
- Prototype a subtle animated background layer (video or Lottie placeholder) to simulate caustics and particles. Use reduced motion variant for accessibility.

Admin flows  
- Pending list → approve opens confirm modal → on approve show toast and add to quizQuestions.  
- Reject opens reason modal.

---

Accessibilité et performance à documenter
Contraste  
- Vérifier contraste texte vs background pour tous les états. Les accents or doivent rester lisibles sur fonds sombres et clairs.  
Keyboard  
- Focus visible pour tous les éléments interactifs, ordre logique.  
Reduced motion  
- Prévoir variantes sans animation; prototype doit inclure un toggle Reduced Motion.  
Images et assets  
- Export WebP/AVIF pour images, SVG pour icônes.  
Performance  
- Limiter animations lourdes; background animé en canvas ou vidéo optimisée, toggle pour désactiver.

---

Spécifications d’export pour les développeurs
Assets  
- Icônes : SVG (24px, 32px, 48px).  
- Avatars : 128px, 64px, 32px export WebP.  
- Background caustics : looped MP4 720p ou Lottie léger.  
Tokens  
- Fournir tokens en JSON et CSS variables (:root) exportés depuis Figma Tokens plugin.  
Animations  
- Décrire keyframes CSS et easing; fournir durée et delay pour chaque micro‑interaction.  
Documentation  
- Chaque composant doit avoir une note : props, states, accessibility notes, expected data shape (ex. question object).

---

Checklist Figma à livrer au dev
- [ ] Design System complet et publié.  
- [ ] Composants avec variants et auto layout.  
- [ ] Prototype cliquable pour les flows critiques.  
- [ ] Export tokens JSON + CSS variables.  
- [ ] Assets optimisés (SVG, WebP).  
- [ ] Page Admin avec interactions approve/reject.  
- [ ] Documentation de handoff (README Figma) listant endpoints Firestore attendus et champs.

---

Code d’intégration sur GitHub — fichiers et commandes
Fichiers à ajouter au repo  
- index.html (prototype HTML fourni).  
- style.css (design system + themes).  
- ui.js, background-canvas.js, theme-switcher.js, admin_ui.js, safe-init.js.  
- importquizbatch.js et new_questions.json (admin import).  
- README.md (instructions de dev, preview, tokens).  
- .github/workflows/deploy.yml (CI pour preview / deploy).

Commandes Git de base
`bash

créer une branche de travail
git checkout -b feat/figma-handoff

ajouter les fichiers
git add index.html style.css ui.js background-canvas.js theme-switcher.js adminui.js safe-init.js importquizbatch.js newquestions.json README.md

commit
git commit -m "Add Figma handoff assets, UI, background canvas and admin tools"

push
git push origin feat/figma-handoff
`

Stratégie de branches  
- main : production.  
- staging : preview deploy.  
- feature branches pour chaque tâche. Ouvrir PR vers staging pour revue design + QA, puis merge vers main après validation.

---

Exemple GitHub Actions pour preview et déploiement
Crée .github/workflows/deploy.yml pour déployer sur GitHub Pages ou Netlify via action. Exemple minimal pour GitHub Pages :

`yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - main
      - staging

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci || true
      - name: Build (if any)
        run: echo "No build step" 
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          githubtoken: ${{ secrets.GITHUBTOKEN }}
          publish_dir: ./
`

Remarque  
- Si tu utilises Netlify ou Vercel, configure previews automatiques pour chaque PR — très utile pour designers et QA.

---

README snippet à coller dans le repo
`md

Abyssus — UI Prototype and Figma Handoff

But
Prototype haute fidélité et design system pour Abyssus. Contient assets, scripts d'UI et outils d'administration.

Structure
- index.html — prototype d'interface
- style.css — design system, thèmes, animations
- ui.js — UI helpers
- background-canvas.js — animated background
- admin_ui.js — admin pending UI
- importquizbatch.js — script Node pour importer questions
- .github/workflows/deploy.yml — CI deploy

Développement local
1. git clone <repo>
2. npm i (si nécessaire)
3. Ouvrir index.html avec Live Server ou npx http-server
4. Tester thèmes via le bouton "Changer Thème"

Import questions
- Préparer new_questions.json et exécuter:
  GOOGLEAPPLICATIONCREDENTIALS=path/to/key.json node importquizbatch.js new_questions.json
`

---

Prochaine étape que je fournis immédiatement
- 1) Un fichier JSON tokens prêt à coller (CSS variables) exportable depuis Figma.  
- 2) Le pack de 20 questions (newquestions.json) réparti sur Otaku, Culture Générale, Penseurs, prêt pour importquiz_batch.js.  
- 3) Le snippet GitHub Actions complet pour Netlify/Vercel si tu préfères ces services.

Je vais générer le pack de 20 questions en premier et te l’envoyer prêt à importer.