# 🎮 Abyssus - Univers RPG du Savoir

**Une plateforme d'apprentissage transformant le savoir en aventure épique.**

## 🚀 Démarrage Rapide

### Prérequis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Connexion Internet (pour Firebase)
- Aucune installation requise

### Installation

1. **Clone le repository:**
```bash
git clone https://github.com/Hakimusprime/abyssus.git
cd abyssus
```

2. **Ouvre le site:**
```bash
# Utilise un serveur local (IMPORTANT pour modules ES6)
python -m http.server 8000
# Puis visite: http://localhost:8000
```

3. **Ou déploie sur Netlify/Vercel:**
- Push sur GitHub
- Connecte Netlify/Vercel à ton repo
- Déploie automatiquement

## 📦 Structure du Projet

```
abyssus/
├── index.html                    # Page principale
├── README.md                     # Ce fichier
├── modules/
│   ├── constants.js             # Configuration du jeu
│   ├── data-manager.js          # Gestion localStorage
│   ├── player.js                # Système joueur
│   ├── domains.js               # Gestion des domaines
│   ├── ui-manager.js            # Interface utilisateur
│   ├── events.js                # Système d'événements
│   ├── firebase-config.js       # Configuration Firebase
│   ├── cloud-data-manager.js    # Sync cloud
│   ├── auth-ui.js               # Interface authentification
│   ├── community-system.js      # Système communauté
│   └── app-cloud.js             # App avec cloud
└── styles/
    ├── base.css                 # Variables CSS + typo
    ├── layout.css               # Navbar + sections
    ├── components.css           # Cartes, grilles
    ├── animations.css           # Animations
    ├── auth.css                 # Auth UI
    ├── community.css            # Community UI
    └── mobile.css               # Responsive mobile
```

## 🎮 Fonctionnalités

### Authentification
✅ Inscription avec email/mot de passe/username  
✅ Connexion sécurisée  
✅ Déconnexion  
✅ Session persistante  

### Progression du Joueur
✅ Système de niveaux et XP  
✅ Santé (HP)  
✅ Titres (Apprenti → Légende)  
✅ Domaines exploitables  

### 10 Domaines
- 🧠 Philosophie
- 📚 Manga
- 🎬 Anime
- 🌍 Culture Générale
- 📖 Histoire
- 🔬 Sciences
- ✍️ Littérature
- 🎮 Jeux Vidéo
- ⚙️ Technologie
- 🎨 Arts

### Communauté
✅ Créer des posts  
✅ Liker les posts  
✅ Filtrer par domaine  
✅ Voir les posts en temps réel  

### Classements
✅ Classement global  
✅ Classement par domaine  
✅ Classement saisonnier  

## 📱 Mobile-First Design

- ✅ Entièrement responsive (mobile, tablet, desktop)
- ✅ Optimisé pour tactile
- ✅ Performances optimales sur 4G
- ✅ Navigation mobile optimisée

## 🔥 Firebase Setup

Le projet est déjà configuré avec Firebase. Les identifiants sont publics et c'est normal (ils ne permettent que les opérations autorisées par les règles de sécurité).

**Database URL:** https://abyssus-1eb8b-default-rtdb.europe-west1.firebasedatabase.app

## 🎯 Commandes Console

Ouvre la console du navigateur (F12) et utilise:

```javascript
// Ajouter XP
abyssus.addXP(50, 'philosophy')  // +50 XP en Philosophie

// Créer un post (nécessite connexion)
abyssus.createPost()

// Exporter les données
abyssus.export()

// Réinitialiser (attention!)
abyssus.reset()
```

## 🚀 Prochaines Étapes

### Phase 2: Système de Quiz
- [ ] Créer des questions par domaine
- [ ] Système de réponses
- [ ] Récompenses XP/HP
- [ ] Temps limite par question

### Phase 3: Boss Encounters
- [ ] Boss de domaine
- [ ] Boss légendaires
- [ ] Système de combat
- [ ] Récompenses reliques

### Phase 4: Système Avancé
- [ ] Reliques (Common → Mythique)
- [ ] Événements temporaires
- [ ] Tournois
- [ ] Chat temps réel

## 🛠️ Développement Local

### Serveur Local Recommandé

**Node.js:**
```bash
npm install -g http-server
http-server
# Visite: http://localhost:8080
```

**Python 3:**
```bash
python -m http.server 8000
# Visite: http://localhost:8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

### Live Reload (Optional)
```bash
npm install -g live-server
live-server
```

## 📊 Firebase Rules (Sécurité)

```json
{
  "rules": {
    "players": {
      "$uid": {
        ".read": "auth.uid === $uid || root.child('players').child($uid).child('isPublic').val() === true",
        ".write": "auth.uid === $uid"
      }
    },
    "community": {
      "posts": {
        ".read": true,
        ".write": "auth.uid != null"
      }
    }
  }
}
```

## 🐛 Debugging

Ouvre la console (F12) pour voir:
- Messages de connexion/déconnexion
- Erreurs Firebase
- Logs d'application

## 📄 Licence

MIT License - Libre d'utilisation

## 👥 Contributeurs

- **Hakimusprime** - Création et développement

## 💬 Support

Pour questions ou bugs:
1. Ouvre un issue sur GitHub
2. Décris le problème en détail
3. Attache des screenshots

## 🎨 Inspiration

Abyssus s'inspire de:
- World of Warcraft
- Dark Souls
- Duolingo
- RPG moderne

---

**Bienvenue dans l'Abîme!** 🌙✨