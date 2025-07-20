#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  Build pour production Vercel...${NC}"

# Build du frontend (si nécessaire)
echo -e "${BLUE}📦 Installation des dépendances frontend...${NC}"
npm install

# Build Expo pour le web
echo -e "${BLUE}🌐 Build Expo pour le web...${NC}"
npx expo export:web

# Vérifier que les dépendances Python sont listées
echo -e "${BLUE}🐍 Vérification des dépendances Python...${NC}"
if [ -f "requirements.txt" ]; then
    echo -e "${GREEN}✅ requirements.txt trouvé${NC}"
else
    echo -e "${BLUE}📝 Génération de requirements.txt...${NC}"
    pip3 freeze > requirements.txt
fi

echo -e "${GREEN}✅ Build terminé ! Prêt pour Vercel${NC}"
