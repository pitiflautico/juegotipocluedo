# 🎮 CLUB MISTERIUM - Guía de Inicio Rápido

¡Bienvenido a Club Misterium! Esta guía te ayudará a poner en marcha el juego en minutos.

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **PHP 8.2+** ([Descargar](https://www.php.net/downloads))
- **Composer** ([Descargar](https://getcomposer.org/download/))
- **Node.js 20.x+** ([Descargar](https://nodejs.org/))
- **PostgreSQL 14+** ([Descargar](https://www.postgresql.org/download/))
- **Redis 6+** ([Descargar](https://redis.io/download))

## 🚀 Instalación Rápida

### 1. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
sudo -u postgres createdb misterium_db

# Crear usuario
sudo -u postgres createuser misterium_user -P
# (Ingresa la contraseña cuando te la pida)

# Dar permisos
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE misterium_db TO misterium_user;"
```

### 2. Configurar Backend (Laravel)

```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env

# Editar .env con tus credenciales de BD
nano .env
# Configura: DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate:fresh --seed
```

**Usuarios de prueba creados:**
- `admin@clubmisterium.com` / `password`
- `detective@test.com` / `password`
- `scientist@test.com` / `password`
- `visionary@test.com` / `password`
- `chronicler@test.com` / `password`
- `infiltrator@test.com` / `password`
- `handyman@test.com` / `password`

### 3. Configurar Game Engine (NestJS)

```bash
cd game-engine

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# El .env por defecto debería funcionar
# PORT=4000
# REDIS_HOST=127.0.0.1
# REDIS_PORT=6379
```

### 4. Configurar Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env.local

# El .env.local por defecto debería funcionar
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## ▶️ Ejecutar el Juego

Necesitas **3 terminales** abiertas:

### Terminal 1 - Backend Laravel
```bash
cd backend
php artisan serve

# Servidor corriendo en http://localhost:8000
```

### Terminal 2 - Game Engine
```bash
cd game-engine
npm run start:dev

# Servidor corriendo en http://localhost:4000
```

### Terminal 3 - Frontend
```bash
cd frontend
npm run dev

# Aplicación disponible en http://localhost:3000
```

## 🎯 Cómo Jugar

### 1. Crear Cuenta o Login
- Visita `http://localhost:3000`
- Haz click en "Crear Cuenta" o usa un usuario de prueba
- Ejemplo: `detective@test.com` / `password`

### 2. Ir al Dashboard
- Verás tus estadísticas (0 partidas al inicio)
- Haz click en "Jugar Ahora"

### 3. Crear una Sala en el Lobby
- Haz click en "Crear Nueva Sala"
- Selecciona un **Caso de Misterio**:
  - El Secreto de la Mansión (Fácil)
  - El Misterio del Museo (Medio)
  - Crimen en Alta Mar (Difícil)
  - La Herencia Maldita (Medio)
  - El Último Espectáculo (Difícil)

- Selecciona un **Tablero**:
  - Mansión Victorian (9 habitaciones)
  - Museo de Historia Natural (8 habitaciones)
  - Crucero de Lujo (9 habitaciones)

- Haz click en "Crear Sala"

### 4. Esperar Jugadores (3-6 jugadores)
- Comparte el ID de la sala con tus amigos
- O abre múltiples pestañas con diferentes usuarios de prueba para probar solo

### 5. Jugar
Una vez en el juego verás:

**Tablero Principal (PixiJS)**
- Habitaciones interactivas con colores
- Click en una habitación para seleccionarla
- Jugadores representados como círculos de colores

**Panel HUD (Arriba)**
- Turno actual
- Jugador activo (¡tu turno! si es tu momento)
- Acciones restantes (3 círculos)

**Panel de Acciones (Derecha)**
- **Mover**: Selecciona una habitación en el tablero y haz click
- **Inspeccionar**: Busca pistas en la habitación actual
- **Usar Habilidad**: Activa tu habilidad especial del rol
- **Hacer Acusación**: Intenta resolver el caso (¡cuidado! solo 3 intentos)

**Panel de Pistas**
- Muestra todas las pistas que has encontrado
- Las pistas falsas están marcadas en rojo

**Panel de Habilidades**
- Tu rol y habilidades especiales
- Cooldown de la habilidad activa
- Descripción de habilidad pasiva

**Chat**
- Comunícate con tu equipo
- Coordina estrategias
- Comparte deducciones

### 6. Ganar el Juego
Para ganar, debes:
1. **Explorar** el tablero moviéndote entre habitaciones
2. **Inspeccionar** para encontrar pistas
3. **Usar habilidades** estratégicamente
4. **Compartir información** con el equipo
5. **Deducir** quién es el culpable, con qué arma y en qué habitación
6. **Acusar** cuando estés seguro

**Condiciones de Victoria:**
- ✅ Acusar correctamente (culpable + arma + habitación + motivo)

**Condiciones de Derrota:**
- ❌ 3 acusaciones incorrectas
- ❌ Se acaba el tiempo (30 turnos)

## 🎭 Los 6 Roles

Cada partida asigna roles únicos:

1. **🔍 Detective**
   - Activa: Interrogar (obtiene 2 pistas en vez de 1)
   - Pasiva: Comparte pistas gratis (sin gastar acción)

2. **🔬 Científico**
   - Activa: Análisis forense (revela objeto oculto)
   - Pasiva: +1 acción al inspeccionar

3. **🔮 Visionario**
   - Activa: Visión (inspecciona habitación remota)
   - Pasiva: Ve pistas de habitaciones adyacentes

4. **📚 Cronista**
   - Activa: Cronología (ve eventos pasados)
   - Pasiva: Registro automático de movimientos NPCs

5. **🥷 Infiltrado**
   - Activa: Camuflaje (2 movimientos gratis)
   - Pasiva: Atraviesa puertas bloqueadas

6. **🔧 Manitas**
   - Activa: Reparar/Sabotear (abre puertas)
   - Pasiva: Usa objetos del entorno

## 💡 Consejos para Principiantes

1. **Comunícate**: El chat es tu mejor herramienta
2. **Muévete estratégicamente**: No visites las mismas habitaciones
3. **Usa tus habilidades**: Tienen cooldown, úsalas pronto
4. **Cuidado con pistas falsas**: Aparecen marcadas en rojo
5. **Coordina con tu equipo**: Cada rol es importante
6. **No te apresures a acusar**: Solo tienes 3 intentos

## 🐛 Problemas Comunes

### "No puedo conectar al backend"
- Verifica que `php artisan serve` esté corriendo
- Revisa que sea puerto 8000

### "Error de Socket.IO"
- Verifica que el game engine esté corriendo
- Revisa que sea puerto 4000
- Asegúrate que Redis esté activo: `redis-cli ping`

### "Error de base de datos"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `backend/.env`
- Ejecuta migraciones: `php artisan migrate:fresh --seed`

### "Tablero no se renderiza"
- Asegúrate de tener Node.js 20.x+
- Reinstala dependencias: `cd frontend && rm -rf node_modules && npm install`

## 📚 Más Información

- [README Principal](README.md)
- [Especificación Técnica](docs/ESPECIFICACION_TECNICA.md)
- [Guía de Despliegue](docs/DESPLIEGUE.md)

## 🎊 ¡Diviértete!

Ahora estás listo para resolver misterios. ¡Buena suerte, detective!

---

**¿Problemas?** Revisa los logs en cada terminal para ver errores específicos.
