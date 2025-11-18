#!/bin/bash

#######################################
# CLUB MISTERIUM - Script de Despliegue
# Para servidor Linux (Ubuntu/Debian)
#######################################

set -e

echo "🎮 CLUB MISTERIUM - Deployment Script"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/club-misterium"
BACKEND_DIR="$PROJECT_DIR/backend"
GAME_ENGINE_DIR="$PROJECT_DIR/game-engine"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# 1. Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# 2. Install dependencies
print_status "Installing dependencies..."

# PHP and extensions
if ! command -v php &> /dev/null; then
    print_status "Installing PHP 8.2..."
    add-apt-repository ppa:ondrej/php -y
    apt update
    apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-pgsql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip
else
    print_status "PHP already installed"
fi

# Composer
if ! command -v composer &> /dev/null; then
    print_status "Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
else
    print_status "Composer already installed"
fi

# Node.js
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    print_status "Node.js already installed"
fi

# PostgreSQL
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    apt install -y postgresql postgresql-contrib
else
    print_status "PostgreSQL already installed"
fi

# Redis
if ! command -v redis-cli &> /dev/null; then
    print_status "Installing Redis..."
    apt install -y redis-server
    systemctl enable redis-server
    systemctl start redis-server
else
    print_status "Redis already installed"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    apt install -y nginx
    systemctl enable nginx
else
    print_status "Nginx already installed"
fi

# 3. Create database
print_status "Setting up database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'misterium_db'" | grep -q 1 || \
    sudo -u postgres createdb misterium_db

sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = 'misterium_user'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER misterium_user WITH PASSWORD 'changeme';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE misterium_db TO misterium_user;"

# 4. Clone or update repository
if [ -d "$PROJECT_DIR" ]; then
    print_status "Updating repository..."
    cd $PROJECT_DIR
    git pull
else
    print_status "Cloning repository..."
    git clone <REPOSITORY_URL> $PROJECT_DIR
fi

# 5. Deploy Backend (Laravel)
print_status "Deploying backend..."
cd $BACKEND_DIR

if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please configure $BACKEND_DIR/.env before continuing"
fi

composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 6. Deploy Game Engine (NestJS)
print_status "Deploying game engine..."
cd $GAME_ENGINE_DIR

if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please configure $GAME_ENGINE_DIR/.env before continuing"
fi

npm install --production
npm run build

# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Start or restart game engine
pm2 delete misterium-engine 2>/dev/null || true
pm2 start dist/main.js --name misterium-engine
pm2 save
pm2 startup

# 7. Deploy Frontend (Next.js)
print_status "Deploying frontend..."
cd $FRONTEND_DIR

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    print_warning "Please configure $FRONTEND_DIR/.env.local before continuing"
fi

npm install
npm run build

# Start or restart frontend
pm2 delete misterium-frontend 2>/dev/null || true
pm2 start npm --name misterium-frontend -- start
pm2 save

# 8. Configure Nginx
print_status "Configuring Nginx..."

cat > /etc/nginx/sites-available/club-misterium <<'EOF'
server {
    listen 80;
    server_name misterium.example.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Laravel)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Game Engine (Socket.IO)
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/club-misterium /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 9. Setup firewall
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 10. Final steps
print_status "Deployment completed!"
echo ""
echo "=========================================="
echo "Next steps:"
echo "1. Configure .env files in each directory"
echo "2. Update database credentials"
echo "3. Configure domain in Nginx"
echo "4. Install SSL certificate (certbot)"
echo "=========================================="
echo ""
echo "Services status:"
pm2 status
echo ""
systemctl status nginx --no-pager
