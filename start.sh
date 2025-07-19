#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://192.168.1.112:8000"
HEALTH_ENDPOINT="/health"

echo -e "${BLUE}🚀 Démarrage de Light Market${NC}"

# Fonction pour vérifier si le serveur backend est démarré
check_backend() {
    echo -e "${YELLOW}🔍 Vérification du backend...${NC}"
    
    # Attendre que le serveur soit prêt
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "${API_URL}${HEALTH_ENDPOINT}" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend disponible !${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Tentative $attempt/$max_attempts - En attente du backend...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Le backend n'est pas accessible après $max_attempts tentatives${NC}"
    return 1
}

# Fonction pour tester l'API Xûr
test_xur_api() {
    echo -e "${YELLOW}🧪 Test de l'API Xûr...${NC}"
    
    # Test de l'endpoint debug
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "${API_URL}/xur/debug")
    http_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    body=$(echo $response | sed 's/HTTPSTATUS:[0-9]*$//')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ API Xûr fonctionnelle !${NC}"
        echo -e "${BLUE}📊 Aperçu des données:${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null | head -20
        return 0
    else
        echo -e "${RED}❌ API Xûr non fonctionnelle (Code: $http_code)${NC}"
        echo -e "${RED}Réponse: $body${NC}"
        return 1
    fi
}

# Vérifier les prérequis
echo -e "${YELLOW}🔧 Vérification des prérequis...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 requis${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js requis${NC}"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl requis${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis OK${NC}"

# Mode d'exécution
case "${1:-help}" in
    "backend")
        echo -e "${BLUE}🖥️  Démarrage du backend uniquement...${NC}"
        chmod +x start_server.sh
        ./start_server.sh
        ;;
    "frontend")
        echo -e "${BLUE}📱 Démarrage du frontend uniquement...${NC}"
        npm start
        ;;
    "test")
        echo -e "${BLUE}🧪 Mode test de l'API...${NC}"
        if check_backend; then
            test_xur_api
        else
            echo -e "${RED}❌ Impossible de tester l'API - Backend non disponible${NC}"
            exit 1
        fi
        ;;
    "full"|"")
        echo -e "${BLUE}🔄 Démarrage complet (backend + frontend)...${NC}"
        
        # Démarrer le backend en arrière-plan
        echo -e "${YELLOW}📡 Démarrage du backend...${NC}"
        chmod +x start_server.sh
        ./start_server.sh &
        backend_pid=$!
        
        # Attendre que le backend soit prêt
        if check_backend; then
            # Tester l'API
            test_xur_api
            
            echo -e "${GREEN}🎉 Backend prêt ! Démarrage du frontend...${NC}"
            npm start
        else
            echo -e "${RED}❌ Échec du démarrage du backend${NC}"
            kill $backend_pid 2>/dev/null
            exit 1
        fi
        ;;
    "help"|*)
        echo -e "${BLUE}📖 Utilisation:${NC}"
        echo -e "  $0 backend    - Démarre seulement le backend"
        echo -e "  $0 frontend   - Démarre seulement le frontend"
        echo -e "  $0 test       - Teste la connexion API"
        echo -e "  $0 full       - Démarre backend + frontend (défaut)"
        echo -e "  $0 help       - Affiche cette aide"
        ;;
esac
