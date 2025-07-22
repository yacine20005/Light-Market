#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Détecter l'IP locale automatiquement
LOCAL_IP=$(hostname -I | awk '{print $1}')
API_URL="http://${LOCAL_IP}:8000"
HEALTH_ENDPOINT="/health"

echo -e "${BLUE}🌐 IP détectée: ${LOCAL_IP}${NC}"
echo -e "${BLUE}🔗 API URL: ${API_URL}${NC}"

# Mettre à jour le fichier .env avec l'IP détectée
echo -e "${YELLOW}📝 Mise à jour du fichier .env...${NC}"
if grep -q "EXPO_PUBLIC_API_URL" .env; then
    sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${API_URL}|" .env
else
    echo "" >> .env
    echo "# Configuration de l'API pour l'application mobile" >> .env
    echo "EXPO_PUBLIC_API_URL=${API_URL}" >> .env
fi
echo -e "${GREEN}✅ Fichier .env mis à jour avec l'IP: ${LOCAL_IP}${NC}"

echo -e "${BLUE}🚀 Démarrage de Orbit Market${NC}"

# Fonction pour nettoyer les processus existants
cleanup_existing_processes() {
    echo -e "${YELLOW}🧹 Nettoyage des processus existants...${NC}"
    
    # Tuer les processus utilisant le port 8000 (backend)
    local backend_pids=$(lsof -ti:8000 2>/dev/null)
    if [ ! -z "$backend_pids" ]; then
        echo -e "${YELLOW}⚡ Arrêt des processus backend existants: $backend_pids${NC}"
        kill -9 $backend_pids 2>/dev/null
        sleep 1
    fi
    
    # Tuer les processus utilisant le port 8081 (Expo)
    local expo_pids=$(lsof -ti:8081 2>/dev/null)
    if [ ! -z "$expo_pids" ]; then
        echo -e "${YELLOW}⚡ Arrêt des processus Expo existants: $expo_pids${NC}"
        kill -9 $expo_pids 2>/dev/null
        sleep 1
    fi
    
    # Tuer les processus uvicorn spécifiquement
    local uvicorn_pids=$(pgrep -f "uvicorn.*backend.main" 2>/dev/null)
    if [ ! -z "$uvicorn_pids" ]; then
        echo -e "${YELLOW}⚡ Arrêt des processus uvicorn existants: $uvicorn_pids${NC}"
        kill -9 $uvicorn_pids 2>/dev/null
        sleep 1
    fi
    
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
}

# Fonction pour gérer l'arrêt propre
cleanup_on_exit() {
    echo -e "\n${YELLOW}🛑 Arrêt en cours...${NC}"
    if [ ! -z "$backend_pid" ]; then
        echo -e "${YELLOW}⚡ Arrêt du backend (PID: $backend_pid)...${NC}"
        kill $backend_pid 2>/dev/null
    fi
    cleanup_existing_processes
    echo -e "${GREEN}👋 Au revoir !${NC}"
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup_on_exit SIGINT SIGTERM

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
    
    # Test du statut du manifest d'abord
    echo -e "${BLUE}📋 Vérification du statut du manifest...${NC}"
    manifest_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "${API_URL}/manifest/status")
    manifest_http_code=$(echo $manifest_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    manifest_body=$(echo $manifest_response | sed 's/HTTPSTATUS:[0-9]*$//')
    
    if [ "$manifest_http_code" = "200" ]; then
        echo -e "${GREEN}✅ Endpoint manifest disponible !${NC}"
        echo -e "${BLUE}📊 Statut du manifest:${NC}"
        echo "$manifest_body" | python3 -m json.tool 2>/dev/null || echo "$manifest_body"
    else
        echo -e "${RED}❌ Endpoint manifest non accessible (Code: $manifest_http_code)${NC}"
    fi
    
    # Test de l'endpoint debug
    echo -e "${BLUE}🔍 Test de l'endpoint Xûr debug...${NC}"
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
        
        # Si l'API Xûr ne fonctionne pas, proposer de forcer la mise à jour du manifest
        echo -e "${YELLOW}🔧 Tentative de mise à jour forcée du manifest...${NC}"
        update_response=$(curl -s -X POST -w "HTTPSTATUS:%{http_code}" "${API_URL}/manifest/update")
        update_http_code=$(echo $update_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
        update_body=$(echo $update_response | sed 's/HTTPSTATUS:[0-9]*$//')
        
        if [ "$update_http_code" = "200" ]; then
            echo -e "${GREEN}✅ Mise à jour du manifest réussie !${NC}"
            echo "$update_body" | python3 -m json.tool 2>/dev/null || echo "$update_body"
            
            # Retester l'API après la mise à jour
            echo -e "${BLUE}🔄 Nouveau test de l'API Xûr...${NC}"
            sleep 2
            retry_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "${API_URL}/xur/debug")
            retry_http_code=$(echo $retry_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
            
            if [ "$retry_http_code" = "200" ]; then
                echo -e "${GREEN}✅ API Xûr fonctionnelle après mise à jour !${NC}"
                return 0
            else
                echo -e "${RED}❌ API Xûr toujours non fonctionnelle après mise à jour${NC}"
            fi
        else
            echo -e "${RED}❌ Échec de la mise à jour du manifest (Code: $update_http_code)${NC}"
            echo "$update_body"
        fi
        
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
        cleanup_existing_processes
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
    "update-manifest")
        echo -e "${BLUE}🔄 Mise à jour forcée du manifest...${NC}"
        if check_backend; then
            echo -e "${YELLOW}🔧 Demande de mise à jour du manifest...${NC}"
            update_response=$(curl -s -X POST -w "HTTPSTATUS:%{http_code}" "${API_URL}/manifest/update")
            update_http_code=$(echo $update_response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
            update_body=$(echo $update_response | sed 's/HTTPSTATUS:[0-9]*$//')
            
            if [ "$update_http_code" = "200" ]; then
                echo -e "${GREEN}✅ Mise à jour réussie !${NC}"
                echo "$update_body" | python3 -m json.tool 2>/dev/null || echo "$update_body"
            else
                echo -e "${RED}❌ Échec de la mise à jour (Code: $update_http_code)${NC}"
                echo "$update_body"
            fi
        else
            echo -e "${RED}❌ Backend non disponible${NC}"
            exit 1
        fi
        ;;
    "full"|"")
        echo -e "${BLUE}🔄 Démarrage complet (backend + frontend)...${NC}"
        
        # Nettoyer les processus existants
        cleanup_existing_processes
        
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
        echo -e "  $0 backend         - Démarre seulement le backend"
        echo -e "  $0 frontend        - Démarre seulement le frontend"
        echo -e "  $0 test            - Teste la connexion API"
        echo -e "  $0 update-manifest - Force la mise à jour du manifest"
        echo -e "  $0 full            - Démarre backend + frontend (défaut)"
        echo -e "  $0 help            - Affiche cette aide"
        ;;
esac
