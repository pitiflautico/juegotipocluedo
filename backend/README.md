# Club Misterium - Backend API

Backend Laravel para el juego Club Misterium. Gestiona usuarios, autenticación, historial de partidas y administración del sistema.

## Requisitos

- PHP 8.2 o superior
- Composer 2.x
- PostgreSQL 14+
- Redis 6+

## Instalación

```bash
# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# (Opcional) Poblar base de datos con datos de ejemplo
php artisan db:seed

# Crear usuario administrador
php artisan tinker
>>> \App\Models\User::factory()->create(['email' => 'admin@example.com', 'name' => 'Admin'])
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
php artisan serve

# El API estará disponible en http://localhost:8000
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obtener usuario actual

### Partidas
- `GET /api/games` - Listar partidas del usuario
- `GET /api/games/{id}` - Detalle de partida
- `GET /api/games/history` - Historial completo

### Casos
- `GET /api/cases` - Listar casos disponibles
- `GET /api/cases/{id}` - Detalle de caso

### Tableros
- `GET /api/templates` - Listar tableros
- `GET /api/templates/{id}` - Detalle de tablero

## Testing

```bash
# Ejecutar tests
php artisan test

# Con coverage
php artisan test --coverage
```

## Estructura

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/          # Controladores de API
│   │   └── Admin/        # Panel de administración
│   ├── Middleware/       # Middlewares personalizados
│   └── Requests/         # Form requests
├── Models/               # Modelos Eloquent
└── Services/             # Lógica de negocio

database/
├── migrations/           # Migraciones
├── seeders/             # Seeders
└── factories/           # Factories para testing

config/                  # Archivos de configuración
routes/                  # Definición de rutas
```

## Administración

El panel de administración está disponible en `/admin` (requiere rol de administrador).

Funcionalidades:
- Gestión de usuarios
- CRUD de casos y tableros
- Monitorización de partidas activas
- Estadísticas generales
