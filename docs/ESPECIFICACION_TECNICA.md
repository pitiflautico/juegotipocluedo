# CLUB MISTERIUM – ESPECIFICACIÓN TÉCNICA COMPLETA

## Índice
1. [Objetivo y Visión General](#objetivo-y-vision-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Técnico](#stack-tecnico)
4. [Modelo de Datos](#modelo-de-datos)
5. [Sistema de Roles](#sistema-de-roles)
6. [Mecánicas de Juego](#mecanicas-de-juego)
7. [Seguridad](#seguridad)

## Objetivo y Visión General

Construir un juego web multijugador cooperativo inspirado en Cluedo pero mejorado:

- **Tablero 2D interactivo** renderizado con PixiJS
- **Roles asimétricos** con habilidades únicas
- **Pistas privadas y públicas** para fomentar la colaboración
- **Misterios combinables y rejugables**
- **Partidas de 3-6 jugadores en tiempo real**
- **Servidor como autoridad** de todas las reglas

## Arquitectura del Sistema

### Capa 1: Frontend (Cliente Web)
- **Framework:** Next.js 14 + React 18 + TypeScript
- **Motor gráfico:** PixiJS para el tablero 2D
- **Estado global:** Zustand
- **Tiempo real:** Socket.IO Client
- **Estilos:** TailwindCSS

### Capa 2: Backend Laravel (API + Persistencia)
- **Framework:** Laravel 11 + PHP 8.2
- **Auth:** Laravel Sanctum (tokens)
- **Base de datos:** PostgreSQL
- **Cache:** Redis
- **Funciones:**
  - Gestión de usuarios
  - Historial de partidas
  - CRUD de casos y tableros
  - Panel de administración
  - APIs REST

### Capa 3: Game Engine (NestJS)
- **Framework:** NestJS + Node.js 20.x
- **Tiempo real:** Socket.IO Server
- **Cache:** Redis
- **Funciones:**
  - Gestión de salas
  - Lógica de turnos
  - Validación de acciones
  - Estado del juego
  - Eventos aleatorios

## Stack Técnico

### Frontend
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "pixi.js": "^7.0.0",
  "socket.io-client": "^4.6.0",
  "zustand": "^4.4.0",
  "tailwindcss": "^3.3.0"
}
```

### Backend Laravel
```json
{
  "php": "^8.2",
  "laravel/framework": "^11.0",
  "laravel/sanctum": "^4.0",
  "predis/predis": "^2.0"
}
```

### Game Engine
```json
{
  "node": "^20.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/websockets": "^10.0.0",
  "@nestjs/platform-socket.io": "^10.0.0",
  "socket.io": "^4.6.0",
  "ioredis": "^5.3.0"
}
```

## Modelo de Datos

### Users
```sql
id: UUID
name: VARCHAR(100)
email: VARCHAR(255) UNIQUE
password: VARCHAR(255)
avatar_url: VARCHAR(500)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Games
```sql
id: UUID
case_id: UUID FK
template_id: UUID FK
started_at: TIMESTAMP
ended_at: TIMESTAMP
status: ENUM(waiting, playing, finished, abandoned)
players_count: INT
winner_team: BOOLEAN
result_json: JSONB
created_at: TIMESTAMP
```

### Game Players
```sql
id: UUID
game_id: UUID FK
user_id: UUID FK
role_code: VARCHAR(50)
is_traitor: BOOLEAN
result: ENUM(win, lose, abandoned)
stats_json: JSONB
created_at: TIMESTAMP
```

### Game Cases
```sql
id: UUID
title: VARCHAR(200)
description: TEXT
killer_npc_id: INT
weapon_code: VARCHAR(50)
room_code: VARCHAR(50)
motive_text: TEXT
difficulty: INT
meta_json: JSONB
created_at: TIMESTAMP
```

### Game Templates
```sql
id: UUID
name: VARCHAR(100)
type: VARCHAR(50)
layout_json: JSONB
max_players: INT
created_at: TIMESTAMP
```

## Sistema de Roles

### 1. Detective
- **Habilidad activa:** Interrogar (obtiene 2 pistas en vez de 1)
- **Habilidad pasiva:** Puede compartir pistas sin coste de acción
- **Cooldown:** 3 turnos

### 2. Científico
- **Habilidad activa:** Análisis forense (revelar un objeto oculto)
- **Habilidad pasiva:** +1 acción al inspeccionar
- **Cooldown:** 4 turnos

### 3. Artista de Visiones
- **Habilidad activa:** Visión (revelar una habitación sin estar en ella)
- **Habilidad pasiva:** Ve pistas de habitaciones adyacentes
- **Cooldown:** 5 turnos

### 4. Cronista
- **Habilidad activa:** Cronología (ver el orden de eventos pasados)
- **Habilidad pasiva:** Registra automáticamente movimientos de NPCs
- **Cooldown:** 4 turnos

### 5. Infiltrado
- **Habilidad activa:** Camuflaje (moverse 2 veces sin ser detectado)
- **Habilidad pasiva:** Puede atravesar habitaciones bloqueadas
- **Cooldown:** 3 turnos

### 6. Manitas
- **Habilidad activa:** Reparar/Sabotear (abrir puertas cerradas)
- **Habilidad pasiva:** Puede usar objetos del entorno
- **Cooldown:** 3 turnos

## Mecánicas de Juego

### Turnos
- Cada jugador tiene **3 acciones** por turno
- Las acciones pueden ser:
  - **Mover:** Cambiar de habitación
  - **Inspeccionar:** Buscar pistas en la habitación actual
  - **Usar habilidad:** Activar la habilidad especial del rol
  - **Compartir pista:** Transferir información a otro jugador
  - **Hacer acusación:** Intentar resolver el caso

### Condiciones de Victoria
- **Victoria cooperativa:** Resolver correctamente el caso (culpable + arma + lugar + motivo)
- **Derrota:** Se acaba el tiempo (20-30 turnos según dificultad) o 3 acusaciones fallidas

### Pistas
- **Pistas públicas:** Visibles para todos (encontradas en habitaciones comunes)
- **Pistas privadas:** Solo para quien las encuentra (roles específicos o habitaciones secretas)
- **Pistas falsas:** Información engañosa (10-20% de las pistas)

## Seguridad

### Autenticación
- Laravel Sanctum con tokens de API
- Tokens con expiración configurable
- Refresh token para sesiones largas

### Validación de Acciones
- **Toda acción validada en el servidor**
- No se confía en datos del cliente
- Verificación de turnos, acciones disponibles y reglas

### Anti-trampas
- Rate limiting en Socket.IO
- Detección de patrones sospechosos
- Logs de todas las acciones críticas
- Verificación de secuencia de eventos

### Protección de Datos
- Contraseñas con bcrypt
- Información sensible en variables de entorno
- CORS configurado correctamente
- HTTPS obligatorio en producción

---

**Documento living** - Se actualiza según evoluciona el proyecto
