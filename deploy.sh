#!/bin/bash
# Script de déploiement R-Market sur serveur Mali (SMDT)
# Exécuter sur le serveur : bash deploy.sh

set -e

echo "========================================="
echo "  R-Market - Déploiement SMDT Mali"
echo "========================================="
echo ""

# Couleurs du Mali
echo "🇲🇱 Déploiement sur serveur malien..."
echo ""

# 1. Mettre à jour le système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 2. Installer Node.js si pas présent
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

# 3. Installer PM2 pour garder le site en ligne
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    sudo npm install -g pm2
fi

# 4. Installer Nginx si pas présent
if ! command -v nginx &> /dev/null; then
    echo "📦 Installation de Nginx..."
    sudo apt install -y nginx
fi

# 5. Copier les fichiers du projet
echo ""
echo "📁 Copie des fichiers du projet..."
PROJECT_DIR="/var/www/r-market"
sudo mkdir -p $PROJECT_DIR
sudo cp -r . $PROJECT_DIR/
cd $PROJECT_DIR

# 6. Installer les dépendances
echo "📦 Installation des dépendances..."
sudo npm install --production

# 7. Build du projet
echo "🔨 Build du projet..."
sudo npm run build

# 8. Configurer PM2
echo "🚀 Configuration de PM2..."
sudo pm2 delete r-market 2>/dev/null || true
sudo pm2 start "npx vite preview --host 0.0.0.0 --port 3000" --name r-market
sudo pm2 save
sudo pm2 startup

# 9. Configurer Nginx
echo "🌐 Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/r-market > /dev/null << 'EOF'
server {
    listen 80;
    server_name r-market.ml www.r-market.ml;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache pour les assets statiques
    location /assets/ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/r-market /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 10. Configurer le firewall
echo "🔒 Configuration du firewall..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

echo ""
echo "========================================="
echo "  ✅ Déploiement terminé !"
echo "========================================="
echo ""
echo "🌐 Site accessible sur : http://r-market.ml"
echo "📊 Monitor PM2 : pm2 status"
echo "📋 Logs : pm2 logs r-market"
echo ""
echo "🔒 Pour HTTPS (Let's Encrypt) :"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d r-market.ml -d www.r-market.ml"
echo ""
