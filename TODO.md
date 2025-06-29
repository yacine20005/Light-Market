# TodoList.md - Spark-Love (Débutants, sans serveur)

### 1️⃣ Démarrage du projet

- [ ] Installer Node.js (<https://nodejs.org/>) et Expo Go sur votre téléphone (App Store/Google Play)
- [ ] Créer le projet :

  ```bash
  npx create-expo-app spark-love
  cd spark-love
  npx expo start
  ```

- [ ] Ouvrir le projet dans VS Code
- [ ] Scanner le QR code avec Expo Go pour voir l’app sur votre téléphone

### 2️⃣ Organisation des fichiers

- [ ] Créer un dossier `components/` pour vos petits bouts d’interface (boutons, cartes, etc.)
- [ ] Créer un dossier `screens/` pour chaque écran (Accueil, Quiz, Résultats…)
- [ ] Créer un dossier `data/` pour stocker vos questions de quiz en local (ex : `questions.json`)

### 3️⃣ Navigation entre les écrans

- [ ] Installer la navigation :

  ```bash
  npx expo install @react-navigation/native @react-navigation/native-stack
  npx expo install react-native-screens react-native-safe-area-context
  ```

- [ ] Créer un fichier `App.js` (ou `App.tsx`) qui gère la navigation entre les écrans (voir doc : <https://reactnavigation.org/docs/getting-started>)
- [ ] Créer un écran d’accueil simple avec un bouton “Commencer le quiz”

### 4️⃣ Système de quiz local

- [ ] Créer un fichier `data/questions.json` avec quelques questions et réponses possibles (exemple ci-dessous)
- [ ] Créer un écran `QuizScreen` qui affiche une question à la fois, avec des boutons pour répondre
- [ ] Passer à la question suivante quand on clique sur une réponse
- [ ] À la fin, afficher un écran de résultats avec un résumé des réponses

**Exemple de questions.json :**

```json
[
  { "id": 1, "question": "Quel est ton plat préféré ?", "options": ["Pizza", "Sushi", "Burger"] },
  { "id": 2, "question": "Plutôt mer ou montagne ?", "options": ["Mer", "Montagne"] }
]
```

### 5️⃣ Stockage local (optionnel)

- [ ] Installer :

  ```bash
  npx expo install @react-native-async-storage/async-storage
  ```

- [ ] Sauvegarder les réponses de l’utilisateur dans le stockage local pour retrouver l’historique plus tard (voir doc : <https://react-native-async-storage.github.io/async-storage/docs/usage/>)

### 6️⃣ Améliorations visuelles

- [ ] Utiliser les composants de base de React Native (`View`, `Text`, `Button`, `Image`)
- [ ] Ajouter des couleurs et des images pour rendre l’app sympa
- [ ] Utiliser des icônes :

  ```bash
  npx expo install @expo/vector-icons
  ```

- [ ] Ajouter un écran “À propos” avec une petite présentation de l’app

### 7️⃣ Aller plus loin (quand vous serez à l’aise)

- [ ] Ajouter un écran pour créer ses propres questions
- [ ] Ajouter un mode “2 joueurs” sur le même téléphone (chacun répond à son tour)
- [ ] Ajouter un système de score ou de compatibilité

---

## 🔜 À faire plus tard / quand vous serez prêts (avancé)

Toutes ces fonctionnalités nécessitent un backend, une base de données, ou des connaissances plus avancées. Gardez-les pour la suite du projet !

### Authentification & Profils Utilisateur

- [ ] Authentification (Firebase, Google, etc.)
- [ ] Profils utilisateurs et connexion entre partenaires
- [ ] Stockage des profils et des réponses en ligne

### Système de quiz avancé

- [ ] Récupération des questions depuis un backend/API
- [ ] Organisation des questions par thèmes dynamiques
- [ ] Packs de questions générés par IA (OpenAI, etc.)
- [ ] Historique des quiz et progression sauvegardée en ligne

### Mini-jeux, défis & journal partagé

- [ ] Mini-jeux ou défis relationnels
- [ ] Journal intime partagé et sécurisé

### Notifications & Engagement

- [ ] Notifications push (Expo Notifications, Firebase Cloud Messaging)
- [ ] Rappels, suggestions, invitations

### Monétisation

- [ ] Publicités (AdMob, etc.)
- [ ] Achats in-app (packs premium, suppression pubs)
- [ ] Système de vies / limitation de quiz par jour

### UI/UX avancé

- [ ] Animations avancées (Reanimated, Lottie)
- [ ] Thème sombre/clair
- [ ] Accessibilité (a11y)

### Analytics & Monitoring

- [ ] Suivi d’utilisation (Firebase Analytics)
- [ ] Crash reporting
- [ ] A/B testing

### Déploiement & Distribution

- [ ] Préparation pour App Store / Play Store
- [ ] CI/CD (builds automatiques, tests)
- [ ] Publication et mises à jour

---

### Conseils

- Faites simple : une fonctionnalité à la fois !
- Testez sur votre téléphone à chaque modification
- Cherchez sur Google/YouTube “expo débutant” ou “react native débutant” pour des tutos vidéo
- Demandez de l’aide sur les forums si vous êtes bloqués

---

**Objectif : Avoir une app qui fonctionne en local, sans serveur, avec un quiz simple et une navigation basique.**

Bon courage, amusez-vous bien avec React Native & Expo ! 🚀