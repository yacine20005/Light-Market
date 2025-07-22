#!/bin/bash

# Deployment script for Orbit Market API
# Run this on your DigitalOcean droplet

set -e  # Stop script on error

DOMAIN="api.yacine-hamadouche.me"
APP_DIR="/home/orbitmarket/orbit-market"
REPO_URL="https://github.com/yacine20005/Orbit-Market.git"

echo "🚀 Deploying Orbit Market API..."

# Create application directory
sudo mkdir -p $APP_DIR
sudo chown orbitmarket:orbitmarket $APP_DIR

# Navigate to directory
cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    echo "📥 Updating code..."
    git pull origin main
else
    echo "📦 Cloning repository..."
    git clone $REPO_URL .
fi

# Build and launch application with Docker
echo "🐳 Building Docker image..."
docker compose down --remove-orphans || true
docker compose build --no-cache
docker compose up -d

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
sleep 10

# Check that application is working
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Application started successfully!"
else
    echo "❌ Error: Application is not responding"
    docker compose logs
    exit 1
fi

# Nginx configuration
echo "🌐 Configuring Nginx..."
sudo cp nginx-config.conf /etc/nginx/sites-available/orbit-market
sudo sed -i "s/api.votre-domaine.com/$DOMAIN/g" /etc/nginx/sites-available/orbit-market
sudo ln -sf /etc/nginx/sites-available/orbit-market /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL configuration with Let's Encrypt
echo "🔒 Configuring SSL..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email ya.hamadouche@gmail.com


echo "🎉 Deployment completed!"
echo "📍 Your API is accessible at: https://$DOMAIN"
echo "🔍 Check health: https://$DOMAIN/health"
