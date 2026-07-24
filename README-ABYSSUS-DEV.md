# 🔮 GUIDE DE DÉVELOPPEMENT - ABYSSUS (SAUVEGARDE)

Ce document contient toutes les directives pour faire évoluer Abyssus sans casser la nouvelle interface moderne.

## 1. 🔑 CONNEXION GOOGLE
La connexion Google a été intégrée via `signInWithPopup(auth, provider)`.
Lorsqu'un nouveau joueur se connecte, Firestore crée automatiquement un document dans la collection `users` avec ses stats de base (HP: 10, XP: 0).

## 2. ⏳ RÉGÉNÉRATION DES HP (1 HEURE)
**Logique à implémenter dans Firebase (Cloud Functions ou côté Client) :**
- Quand le joueur tombe à 0 HP (`hp: 0`), enregistrez un champ `lastDeathAt: Date.now()`.
- Dans le Frontend, calculez le temps restant : `const timeRemaining = 3600000 - (Date.now() - user.lastDeathAt)`.
- Si `timeRemaining <= 0`, mettez à jour Firestore : `hp: 10` et effacez `lastDeathAt`.

## 3. 🖼️ QUIZ IMAGES ET EMOJIS
Pour ajouter des quiz avec images ou emojis, modifiez la structure de vos questions dans Firestore.
**Format recommandé dans Firebase :**
```json
{
  "type": "image", // ou "text" ou "emoji"
  "question": "Qui est ce personnage ?",
  "mediaUrl": "https://lien-vers-limage.com/img.jpg", // ou "🌟⚔️👦🏼" pour emoji
  "options": ["Naruto", "Goku", "Luffy", "Ichigo"],
  "correctAnswer": 1
}
```
Dans le composant `QuizPlayer.tsx`, faites un rendu conditionnel :
`if (q.type === 'image') return <img src={q.mediaUrl} />`
`if (q.type === 'emoji') return <div className="text-4xl">{q.mediaUrl}</div>`

## 4. ⚔️ RELIQUES, ARMES ET INVENTAIRE
Créez une collection Firestore `items` contenant toutes les reliques du jeu.
```json
{
  "id": "relique_001",
  "name": "Épée Abyssale",
  "type": "weapon",
  "rarity": "Legendary",
  "effect": "Booste l'XP de 10%"
}
```
Dans le profil de l'utilisateur, gardez un tableau `inventory: ["relique_001", "relique_002"]`.

## 5. 📸 PHOTO DE PROFIL (DÉBLOCAGE PAR NIVEAU)
Dans la page Profil, vérifiez le niveau du joueur. 
Exemple de code :
`const canChangeAvatar = user.rankIndex >= 5; // Rang A (Niv 5)`
Si c'est vrai, affichez le bouton d'upload. Sinon, affichez un cadenas 🔒 "Débloqué au Rang A".

## 6. 🏟️ DUELS ET TOURNOIS
- **Duels :** Créez une collection `rooms`. Deux joueurs rejoignent une room. Le premier qui répond correctement inflige des dégâts à l'autre.
- **Tournois :** Gérez un statut "Admin" dans Firestore (`role: 'abyssal_entity'`). Seuls ces rôles voient le bouton "Créer un Tournoi".

## 7. 📥 BOÎTE À IDÉES (REQUÊTES)
Dans la page `Communauté`, ajoutez un formulaire qui pousse un document dans une collection Firestore `suggestions`.
