# Club Misterium - Frontend

Frontend de Club Misterium construido con Next.js, React, TypeScript y PixiJS.

## Requisitos

- Node.js 20.x o superior
- NPM o Yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

## Desarrollo

```bash
# Modo desarrollo
npm run dev

# El frontend estará disponible en http://localhost:3000
```

## Construcción

```bash
# Build para producción
npm run build

# Ejecutar en modo producción
npm start
```

## Testing

```bash
# Verificar tipos
npm run type-check

# Linting
npm run lint
```

## Estructura

```
app/                  # App Router (Next.js 14)
├── page.tsx         # Landing page
├── login/           # Página de login
├── register/        # Página de registro
├── dashboard/       # Dashboard del usuario
├── lobby/           # Lobby de partidas
└── game/[id]/       # Página principal del juego

components/
├── ui/              # Componentes de UI reutilizables
├── game/            # Componentes específicos del juego
│   ├── GameBoard.tsx       # Tablero con PixiJS
│   ├── PlayerHUD.tsx       # HUD del jugador
│   ├── CluesPanel.tsx      # Panel de pistas
│   ├── AbilitiesPanel.tsx  # Panel de habilidades
│   └── ChatBox.tsx         # Chat del juego
└── lobby/           # Componentes del lobby

lib/                 # Utilidades y configuraciones
├── api.ts          # Cliente API
├── socket.ts       # Cliente Socket.IO
└── utils.ts        # Funciones utilitarias

store/               # Estado global con Zustand
├── auth.ts         # Store de autenticación
├── game.ts         # Store del juego
├── lobby.ts        # Store del lobby
└── chat.ts         # Store del chat

types/               # Tipos TypeScript
hooks/               # Custom hooks
styles/              # Estilos globales
public/              # Assets estáticos
```

## Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **TailwindCSS** para estilos
- **Zustand** para gestión de estado
- **Socket.IO** para tiempo real
- **PixiJS** para el tablero 2D

## Páginas

### Landing (/)
Página de presentación del juego con información y botón de registro.

### Login (/login)
Autenticación de usuarios existentes.

### Register (/register)
Registro de nuevos usuarios.

### Dashboard (/dashboard)
Panel de usuario con:
- Estadísticas personales
- Historial de partidas
- Perfil

### Lobby (/lobby)
Lobby de partidas con:
- Lista de salas disponibles
- Crear nueva sala
- Unirse a sala existente

### Game (/game/[id])
Interfaz principal del juego con:
- Tablero 2D interactivo (PixiJS)
- Panel de pistas
- Panel de habilidades
- Chat
- HUD con información del turno

## Socket.IO

El cliente se conecta automáticamente al game engine y gestiona:
- Eventos de sala (join, leave, state)
- Eventos de juego (move, inspect, ability)
- Chat en tiempo real
- Actualizaciones del estado del juego

## API

Todas las llamadas a la API Laravel se gestionan a través de `lib/api.ts`:
- Autenticación (login, register, logout)
- Historial de partidas
- Casos y tableros
- Perfil de usuario
