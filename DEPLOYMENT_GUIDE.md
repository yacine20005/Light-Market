# 🚀 Guide de Déploiement - Orbit Market API sur DigitalOcean

## Prérequis

- Un droplet DigitalOcean (Ubuntu 20.04+ recommandé)
- Un domaine configuré sur Namecheap
- Accès SSH à votre droplet

## 📋 Étapes de déploiement

### 1. Configuration initiale du serveur

```bash
# Connectez-vous à votre droplet
ssh root@YOUR_DROPLET_IP

# Lancez le script de configuration
bash deploy_setup.sh
```

### 2. Configuration DNS (Namecheap)

Dans votre panneau Namecheap :

- Allez dans "Domain List" > "Manage"
- Onglet "Advanced DNS"
- Ajoutez un enregistrement A :
  - Type: A Record
  - Host: api
  - Value: [IP de votre droplet]
  - TTL: Automatic

### 3. Préparation du projet

```bash
# Basculez vers l'utilisateur orbitmarket
su - orbitmarket

# Créez le répertoire du projet
mkdir -p ~/orbit-market
cd ~/orbit-market

# Clonez votre repository (remplacez par votre URL)
git clone https://github.com/VOTRE-USERNAME/Light-Market.git .
```

### 4. Configuration du domaine

Éditez les fichiers suivants :

**deploy.sh** :

```bash
DOMAIN="api.votre-domaine.com"  # Remplacez par votre domaine
```

**nginx-config.conf** :

```nginx
server_name api.votre-domaine.com;  # Remplacez par votre domaine
```

### 5. Déploiement

```bash
# Rendez le script exécutable
chmod +x deploy.sh

# Lancez le déploiement
./deploy.sh
```

### 6. Vérification

Testez votre API :

```bash
curl https://api.votre-domaine.com/health
```

## 🔧 Commandes utiles

### Gestion Docker

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer l'application
docker-compose restart

# Mettre à jour l'application
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Gestion Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

# Voir les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL/Certificats

```bash
# Renouveler les certificats SSL
sudo certbot renew --dry-run

# Vérifier les certificats
sudo certbot certificates
```

## 🔒 Sécurité

### Firewall (UFW)

```bash
# Activer le firewall
sudo ufw enable

# Autoriser SSH, HTTP et HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Vérifier le statut
sudo ufw status
```

### Mise à jour automatique

```bash
# Configurer les mises à jour automatiques
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Monitoring

### Vérification de santé

```bash
# Script de monitoring simple
#!/bin/bash
if curl -f https://api.votre-domaine.com/health > /dev/null 2>&1; then
    echo "✅ API is healthy"
else
    echo "❌ API is down"
    # Redémarrer l'application
    cd ~/orbit-market && docker-compose restart
fi
```

## 🚨 Dépannage

### Problèmes courants

1. **L'API ne répond pas**

   ```bash
   docker-compose logs
   sudo systemctl status nginx
   ```

2. **Erreur SSL**

   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

3. **Problème DNS**
   - Vérifiez que l'enregistrement A pointe vers la bonne IP
   - Attendez la propagation DNS (jusqu'à 24h)

### Logs importants

```bash
# Logs de l'application
docker-compose logs -f

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs système
sudo journalctl -u nginx -f
```

## 📱 Mise à jour de votre application mobile

Après le déploiement, mettez à jour l'URL de votre API dans votre app :

**services/api.ts** :

```typescript
const API_BASE_URL = 'https://api.votre-domaine.com';
```
