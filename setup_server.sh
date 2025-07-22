#!/bin/bash

# Deployment script for DigitalOcean
# Run this script on your droplet

echo "🚀 Setting up server for Orbit Market API..."

# System update
apt update && apt upgrade -y

# Install Python and necessary tools
apt install -y python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx

# Install Docker (optional but recommended)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application user
useradd -m -s /bin/bash orbitmarket
usermod -aG sudo orbitmarket

echo "✅ Basic configuration completed!"
echo "Now log in with the orbitmarket user"
