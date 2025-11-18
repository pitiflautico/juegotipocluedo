# Guía de Despliegue - Club Misterium

Esta guía explica cómo desplegar Club Misterium en un servidor Linux (Ubuntu/Debian) sin usar Docker.

## Requisitos del Servidor

### Hardware Recomendado
- **CPU:** 4 vCPU o más
- **RAM:** 8 GB mínimo
- **Disco:** 50 GB SSD
- **Ancho de banda:** 100 Mbps

### Software
- Ubuntu 22.04 LTS (recomendado)
- Acceso root o sudo
- Dominio con DNS configurado

## Preparación del Servidor

### 1. Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Crear Usuario de Despliegue

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy
```

### 3. Configurar SSH

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "deploy@misterium"
ssh-copy-id deploy@tu-servidor.com

# En el servidor
sudo nano /etc/ssh/sshd_config
# Cambiar: PasswordAuthentication no
sudo systemctl restart sshd
```

## Instalación Automática

Hemos preparado un script que instala todo automáticamente:

```bash
# Clonar el repositorio
cd /tmp
git clone <REPO_URL> club-misterium-temp
cd club-misterium-temp

# Ejecutar script de despliegue
sudo bash scripts/deploy.sh
```

El script instalará:
- PHP 8.2 + extensiones
- Composer
- Node.js 20.x
- PostgreSQL
- Redis
- Nginx
- PM2

## Instalación Manual

Si prefieres instalar manualmente:

### 1. Instalar PHP y Composer

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-pgsql \
    php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip

# Instalar Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 3. Instalar PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb misterium_db
sudo -u postgres createuser misterium_user -P
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE misterium_db TO misterium_user;"
```

### 4. Instalar Redis

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 5. Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

## Configuración de Aplicaciones

### Backend (Laravel)

```bash
cd /var/www/club-misterium/backend

# Copiar y editar .env
cp .env.example .env
nano .env

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Generar clave
php artisan key:generate

# Ejecutar migraciones
php artisan migrate --force

# Cachear configuración
php artisan config:cache
php artisan route:cache

# Permisos
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Game Engine (NestJS)

```bash
cd /var/www/club-misterium/game-engine

# Copiar y editar .env
cp .env.example .env
nano .env

# Instalar y compilar
npm install --production
npm run build

# Iniciar con PM2
pm2 start dist/main.js --name misterium-engine
pm2 save
pm2 startup
```

### Frontend (Next.js)

```bash
cd /var/www/club-misterium/frontend

# Copiar y editar .env
cp .env.example .env.local
nano .env.local

# Compilar
npm install
npm run build

# Iniciar con PM2
pm2 start npm --name misterium-frontend -- start
pm2 save
```

## Configuración de Nginx

```bash
sudo nano /etc/nginx/sites-available/club-misterium
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Game Engine
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Activar sitio:

```bash
sudo ln -s /etc/nginx/sites-available/club-misterium /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL con Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Backups

### Configurar Backup Automático de Base de Datos

```bash
sudo nano /usr/local/bin/backup-db.sh
```

Contenido:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump misterium_db > $BACKUP_DIR/misterium_db_$DATE.sql

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "misterium_db_*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh

# Agregar a crontab
sudo crontab -e
# Agregar: 0 2 * * * /usr/local/bin/backup-db.sh
```

## Monitorización

### Ver logs de aplicaciones

```bash
# PM2
pm2 logs misterium-engine
pm2 logs misterium-frontend

# Laravel
tail -f /var/www/club-misterium/backend/storage/logs/laravel.log

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Estado de servicios

```bash
pm2 status
systemctl status nginx
systemctl status postgresql
systemctl status redis-server
```

## Actualización

```bash
cd /var/www/club-misterium
git pull

# Backend
cd backend
composer install --no-dev
php artisan migrate --force
php artisan cache:clear

# Game Engine
cd ../game-engine
npm install --production
npm run build
pm2 restart misterium-engine

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart misterium-frontend
```

## Troubleshooting

### Error de permisos en Laravel

```bash
sudo chown -R www-data:www-data /var/www/club-misterium/backend/storage
sudo chmod -R 775 /var/www/club-misterium/backend/storage
```

### Game Engine no se conecta

```bash
pm2 logs misterium-engine --lines 100
# Verificar puerto y Redis
```

### Frontend no carga

```bash
pm2 logs misterium-frontend --lines 100
# Verificar variables de entorno
```

## Seguridad

1. ✅ Deshabilitar autenticación por contraseña SSH
2. ✅ Configurar firewall (ufw)
3. ✅ Instalar fail2ban
4. ✅ SSL/HTTPS obligatorio
5. ✅ Mantener sistema actualizado
6. ✅ Backups regulares
7. ✅ Monitorizar logs

---

**¿Problemas?** Consulta los logs o abre un issue en el repositorio.
