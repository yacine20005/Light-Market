# 🌟 Light Market - Connexion Frontend-Backend

## 🚀 Mise en route rapide

### Configuration initiale

1. **Configuration automatique** :
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configuration manuelle** :
   ```bash
   # Backend
   pip3 install -r requirements.txt
   
   # Frontend
   npm install
   ```

3. **Configuration des variables d'environnement** :
   ```bash
   cp .env.example .env
   # Modifiez le fichier .env avec vos clés API Bungie
   ```

### Démarrage de l'application

#### Option 1: Démarrage automatique (recommandé)
```bash
chmod +x start.sh
./start.sh
```

#### Option 2: Démarrage manuel
```bash
# Terminal 1 - Backend
chmod +x start_server.sh
./start_server.sh

# Terminal 2 - Frontend
npm start
```

#### Option 3: Démarrage sélectif
```bash
./start.sh backend   # Backend seulement
./start.sh frontend  # Frontend seulement
./start.sh test      # Test de l'API seulement
```

## 🔧 Architecture de la connexion

### Backend (FastAPI)
- **Port**: 8000
- **Endpoints**:
  - `GET /` - Page d'accueil
  - `GET /health` - Vérification de santé
  - `GET /xur` - Inventaire de Xûr
  - `GET /xur/debug` - Informations de debug

### Frontend (React Native + Expo)
- **Service API**: `/services/api.ts`
- **Hook personnalisé**: `/hooks/useXur.ts`
- **Composant d'affichage**: `/components/XurItemCard.tsx`

### Flux de données

```
Frontend (React Native) 
    ↓ (HTTP Request)
API Service (/services/api.ts)
    ↓ (fetch)
Backend (FastAPI)
    ↓ (Bungie API)
Bungie Destiny 2 API
    ↓ (Manifest SQLite)
Données décodées
    ↓ (JSON Response)
Frontend (Interface utilisateur)
```

## 📱 Utilisation dans l'interface

### Hook useXur

```typescript
import { useXur } from '@/hooks/useXur';

export default function XurScreen() {
  const { 
    xurData,        // Données de Xûr
    isLoading,      // État de chargement
    error,          // Erreur éventuelle
    isXurPresent,   // Xûr est-il présent ?
    timeUntilXur,   // Temps avant/jusqu'à Xûr
    refreshXurData  // Fonction de rafraîchissement
  } = useXur();
  
  // Votre code...
}
```

### Service API

```typescript
import { apiService } from '@/services/api';

// Récupérer l'inventaire de Xûr
const xurData = await apiService.getXurInventory();

// Récupérer les informations de debug
const debugInfo = await apiService.getXurDebugInfo();
```

## 🧪 Tests et Debug

### Test de l'API
```bash
./start.sh test
```

### Composant de test intégré
Importez `ApiTestScreen` dans votre application pour tester manuellement l'API :

```typescript
import ApiTestScreen from '@/components/ApiTestScreen';
```

### Vérification manuelle
```bash
# Vérifier que le backend fonctionne
curl http://localhost:8000/health

# Tester l'endpoint Xûr
curl http://localhost:8000/xur/debug
```

## 🔄 États de l'application

### États possibles de Xûr :

1. **Chargement** : Récupération des données en cours
2. **Erreur** : Problème de connexion ou d'API
3. **Absent** : Xûr n'est pas présent (hors horaires)
4. **Présent** : Xûr est disponible avec son inventaire

### Gestion des erreurs :

- **502** : Erreur de l'API Bungie en amont
- **404** : Xûr n'est pas disponible actuellement
- **500** : Erreur de traitement des données

## 🛠️ Personnalisation

### Modifier l'URL de l'API
Dans votre fichier `.env` :
```
EXPO_PUBLIC_API_URL=http://your-api-url.com
```

### Ajouter de nouveaux endpoints
1. Créez la route dans le backend (`/backend/routers/`)
2. Ajoutez la méthode dans le service API (`/services/api.ts`)
3. Utilisez dans vos composants

### Personnaliser l'affichage des objets
Modifiez le composant `XurItemCard` dans `/components/XurItemCard.tsx`

## 📋 Dépannage

### Problèmes courants :

1. **"API non accessible"** :
   - Vérifiez que le backend est démarré
   - Vérifiez l'URL dans `.env`

2. **"Xûr n'est pas disponible"** :
   - Vérifiez les horaires (Vendredi 17h - Mardi 17h UTC)
   - Vérifiez vos clés API Bungie

3. **"Erreur de chargement"** :
   - Vérifiez votre connexion internet
   - Vérifiez les logs du backend

### Logs utiles :
```bash
# Logs du backend
./start_server.sh

# Logs du frontend
npm start
```

## 🎯 Prochaines étapes

- [ ] Notification push quand Xûr arrive
- [ ] Cache des données pour utilisation hors ligne
- [ ] Filtres par classe d'armure
- [ ] Historique des inventaires précédents
- [ ] Comparaison de stats d'armures

---

## 🤝 Contribution

Pour contribuer à ce projet :
1. Forkez le repository
2. Créez une branche feature
3. Testez vos modifications
4. Soumettez une pull request
