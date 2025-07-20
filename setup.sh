#!/bin/bash

echo "🚀 Configuration de l'environnement Orbit Market..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Installer les dépendances Python
echo "📦 Installation des dépendances Python..."
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    echo "✅ Dépendances Python installées"
else
    echo "❌ requirements.txt introuvable"
    exit 1
fi

# Installer les dépendances Node.js
echo "📦 Installation des dépendances Node.js..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dépendances Node.js installées"
else
    echo "❌ package.json introuvable"
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  Veuillez configurer vos clés API dans le fichier .env"
fi

echo "🎉 Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "1. Backend: chmod +x start_server.sh && ./start_server.sh"
echo "2. Frontend: npm start"
echo ""
echo "Assurez-vous de configurer vos clés API Bungie dans le fichier .env"
