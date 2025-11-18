# Club Misterium - Game Engine

Game engine en tiempo real para Club Misterium. Gestiona la lógica de juego, salas, turnos y comunicación WebSocket.

## Requisitos

- Node.js 20.x o superior
- Redis 6+
- NPM o Yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Compilar proyecto
npm run build
```

## Desarrollo

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo debug
npm run start:debug
```

## Producción

```bash
# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## Estructura

```
src/
├── game/               # Módulo principal del juego
├── room/               # Gestión de salas
├── player/             # Gestión de jugadores
├── board/              # Lógica del tablero
├── turn/               # Sistema de turnos
├── events/             # Eventos del juego
└── common/             # Utilidades compartidas
```

## Eventos Socket.IO

### Cliente → Servidor

- `room:create` - Crear nueva sala
- `room:join` - Unirse a una sala
- `room:leave` - Salir de una sala
- `action:move` - Mover jugador
- `action:inspect` - Inspeccionar habitación
- `action:useAbility` - Usar habilidad especial
- `action:shareClue` - Compartir pista
- `chat:send` - Enviar mensaje de chat

### Servidor → Cliente

- `room:joined` - Confirmación de unión a sala
- `room:state` - Estado actual de la sala
- `player:joined` - Nuevo jugador unido
- `player:left` - Jugador salió
- `turn:start` - Inicio de turno
- `turn:end` - Fin de turno
- `game:update` - Actualización del estado del juego
- `event:triggered` - Evento aleatorio activado
- `chat:message` - Mensaje de chat

## Arquitectura

El motor de juego actúa como autoridad del servidor para todas las acciones de juego:

1. **Validación:** Todas las acciones del cliente son validadas
2. **Estado:** El estado del juego se mantiene en Redis
3. **Broadcast:** Las actualizaciones se envían a todos los clientes relevantes
4. **Persistencia:** Los resultados finales se envían al backend Laravel

## Monitorización

El servidor expone métricas en:
- Salas activas: GET /health
- Estado de Redis: automático
- Logs: stdout/stderr
