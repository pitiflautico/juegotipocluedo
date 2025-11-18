# CLUB MISTERIUM

Juego de tablero cooperativo online tipo Cluedo mejorado, con roles asimétricos, misterios rejugables y tiempo real.

## 🎯 Descripción

Club Misterium es un juego multijugador cooperativo (3-6 jugadores) donde los jugadores deben resolver misterios trabajando en equipo, cada uno con su rol único y habilidades especiales. El juego combina elementos de deducción, estrategia y cooperación en un tablero 2D interactivo.

## 🏗️ Arquitectura

El proyecto está dividido en 3 componentes principales:

### 1. **Backend (Laravel)**
- Gestión de usuarios y autenticación (Sanctum)
- Persistencia de partidas y estadísticas
- CRUD de casos, tableros y configuraciones
- Panel de administración
- APIs REST

**Stack:** PHP 8.2+, Laravel 11, PostgreSQL, Redis

### 2. **Game Engine (NestJS)**
- Motor de juego en tiempo real
- Gestión de salas y jugadores
- Lógica de turnos y acciones
- Validación de reglas
- Comunicación WebSocket (Socket.IO)

**Stack:** Node.js 20.x, NestJS, Socket.IO, Redis

### 3. **Frontend (Next.js + PixiJS)**
- Interfaz de usuario
- Tablero 2D interactivo (PixiJS)
- Lobby y gestión de salas
- Comunicación tiempo real con el game engine

**Stack:** Next.js 14, React 18, TypeScript, PixiJS, TailwindCSS, Zustand, Socket.IO Client

## 📁 Estructura del Proyecto

```
club-misterium/
├── backend/           # Laravel API & Admin Panel
├── game-engine/       # NestJS Game Engine
├── frontend/          # Next.js Frontend
├── docs/              # Documentación técnica
└── scripts/           # Scripts de despliegue y utilidades
```

## 🚀 Inicio Rápido

### Prerrequisitos

- PHP 8.2+
- Composer
- Node.js 20.x+
- PostgreSQL 14+
- Redis 6+

### Instalación

#### 1. Backend Laravel
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

#### 2. Game Engine NestJS
```bash
cd game-engine
npm install
cp .env.example .env
npm run build
```

#### 3. Frontend Next.js
```bash
cd frontend
npm install
cp .env.example .env.local
npm run build
```

### Desarrollo

```bash
# Terminal 1 - Backend Laravel
cd backend && php artisan serve

# Terminal 2 - Game Engine
cd game-engine && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

## 🎮 Características Principales

- **Roles asimétricos:** Detective, Científico, Artista de Visiones, Cronista, Infiltrado, Manitas
- **Sistema de turnos:** 3 acciones por jugador por turno
- **Pistas privadas y públicas:** Gestión de información asimétrica
- **Tableros dinámicos:** Mansión, museo, barco, etc.
- **Casos rejugables:** Diferentes misterios con elementos aleatorios
- **Eventos aleatorios:** Sorpresas durante la partida
- **Chat en tiempo real:** Comunicación entre jugadores
- **Estadísticas:** Seguimiento de rendimiento y logros

## 🔒 Seguridad

- Autenticación con tokens (Laravel Sanctum)
- Validación servidor-side de todas las acciones
- Rate limiting
- Protección anti-trampas
- HTTPS obligatorio en producción

## 📚 Documentación

La documentación técnica completa se encuentra en la carpeta `/docs`:

- [Especificación Técnica](docs/ESPECIFICACION_TECNICA.md)
- [Guía de Despliegue](docs/DESPLIEGUE.md)
- [API Reference](docs/API.md)
- [Arquitectura del Sistema](docs/ARQUITECTURA.md)

## 🛠️ Despliegue

El proyecto está diseñado para desplegarse en un único servidor Linux sin Docker.

Consulta [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) para instrucciones detalladas.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Equipo

Desarrollado con Claude Code

---

**Versión:** 1.0.0
**Última actualización:** 2025-01-18
