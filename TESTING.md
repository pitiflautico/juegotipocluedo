# 🧪 Guía de Pruebas - Club Misterium

Esta guía te ayudará a probar todas las funcionalidades del juego de manera sistemática.

## 📋 Checklist de Pruebas

### ✅ Backend Laravel

#### Autenticación
- [ ] **Registro de usuario**
  ```bash
  curl -X POST http://localhost:8000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@test.com",
      "password": "password123",
      "password_confirmation": "password123"
    }'
  ```
  - ✅ Debe retornar usuario y token
  - ✅ Debe crear PlayerStats automáticamente
  - ✅ Password debe tener mínimo 8 caracteres
  - ✅ Email debe ser único

- [ ] **Login**
  ```bash
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "detective@test.com",
      "password": "password"
    }'
  ```
  - ✅ Credenciales correctas: retorna token
  - ✅ Credenciales incorrectas: error 422
  - ✅ Revoca tokens antiguos

- [ ] **Me (usuario actual)**
  ```bash
  curl -X GET http://localhost:8000/api/auth/me \
    -H "Authorization: Bearer {TOKEN}"
  ```
  - ✅ Retorna usuario con stats cargadas
  - ✅ Sin token: error 401

#### Casos de Juego
- [ ] **Listar casos**
  ```bash
  curl -X GET http://localhost:8000/api/cases \
    -H "Authorization: Bearer {TOKEN}"
  ```
  - ✅ Retorna 5 casos
  - ✅ No expone solución
  - ✅ Incluye dificultad y descripción

- [ ] **Filtrar por dificultad**
  ```bash
  curl -X GET "http://localhost:8000/api/cases?difficulty=1" \
    -H "Authorization: Bearer {TOKEN}"
  ```
  - ✅ Retorna solo casos de dificultad 1

#### Tableros
- [ ] **Listar tableros**
  ```bash
  curl -X GET http://localhost:8000/api/templates \
    -H "Authorization: Bearer {TOKEN}"
  ```
  - ✅ Retorna 3 tableros
  - ✅ Incluye layout_json completo
  - ✅ Habitaciones y conexiones válidas

---

### ✅ Frontend

#### Páginas
- [ ] **Landing Page** (/)
  - ✅ Muestra información del juego
  - ✅ Botones de Login y Registro funcionan
  - ✅ Redirige a dashboard si ya está autenticado

- [ ] **Login** (/login)
  - ✅ Validación de email
  - ✅ Validación de password
  - ✅ Mensaje de error claro
  - ✅ Redirección a dashboard después de login

- [ ] **Register** (/register)
  - ✅ Validación de todos los campos
  - ✅ Confirmación de password
  - ✅ Mensaje de error de email duplicado
  - ✅ Redirección a dashboard después de registro

- [ ] **Dashboard** (/dashboard)
  - ✅ Requiere autenticación (redirige a /login)
  - ✅ Muestra estadísticas del usuario
  - ✅ Muestra partidas recientes (vacío inicialmente)
  - ✅ Botón "Jugar Ahora" lleva a /lobby

- [ ] **Lobby** (/lobby)
  - ✅ Requiere autenticación
  - ✅ Se conecta a Socket.IO
  - ✅ Modal de crear sala funciona
  - ✅ Puede seleccionar caso (5 opciones)
  - ✅ Puede seleccionar tablero (3 opciones)
  - ✅ Muestra resumen antes de crear
  - ✅ Crea sala y redirige a /game/[id]

---

### ✅ Game Engine

#### Conexión Socket.IO
- [ ] **Conectar al servidor**
  ```javascript
  // En consola del navegador
  const socket = io('http://localhost:4000');
  socket.on('connect', () => console.log('Connected!'));
  ```
  - ✅ Se conecta exitosamente
  - ✅ Recibe evento 'connect'

#### Eventos de Sala
- [ ] **Crear sala**
  ```javascript
  socket.emit('room:create', {
    caseId: 'case-uuid',
    templateId: 'template-uuid',
    maxPlayers: 6
  }, (response) => console.log(response));
  ```
  - ✅ Retorna ID de sala
  - ✅ Sala se crea con estado 'waiting'

- [ ] **Unirse a sala**
  ```javascript
  socket.emit('room:join', {
    roomId: 'room-id',
    playerInfo: {
      userId: 'user-id',
      name: 'Player Name'
    }
  });
  ```
  - ✅ Recibe evento 'room:joined'
  - ✅ Otros jugadores reciben 'player:joined'
  - ✅ Se asigna rol automáticamente

---

### ✅ Juego Completo

#### Flujo Completo
1. [ ] **Login con 3 usuarios diferentes**
   - User 1: `detective@test.com` / `password`
   - User 2: `scientist@test.com` / `password`
   - User 3: `visionary@test.com` / `password`

2. [ ] **User 1 crea sala**
   - Selecciona "El Secreto de la Mansión"
   - Selecciona "Mansión Victorian"
   - Crea sala

3. [ ] **User 2 y 3 se unen** (en otras pestañas)
   - Copiar ID de sala
   - Unirse a la sala (implementar en frontend)

4. [ ] **Verificar tablero PixiJS**
   - ✅ Se renderiza el tablero
   - ✅ Muestra 9 habitaciones
   - ✅ Conexiones visibles
   - ✅ Jugadores aparecen en posiciones

5. [ ] **Probar acciones**
   - [ ] **Mover**:
     - Seleccionar habitación en tablero
     - Click en "Mover"
     - Verificar que jugador se mueve

   - [ ] **Inspeccionar**:
     - Click en "Inspeccionar"
     - Verificar que aparecen pistas en panel

   - [ ] **Chat**:
     - Escribir mensaje
     - Verificar que otros jugadores lo ven

   - [ ] **Usar Habilidad**:
     - Esperar turno propio
     - Click en botón de habilidad
     - Verificar cooldown

6. [ ] **Verificar sistema de turnos**
   - ✅ Solo el jugador activo puede actuar
   - ✅ Se muestran 3 acciones por turno
   - ✅ Acciones se decrementan correctamente
   - ✅ Turno pasa al siguiente jugador

---

## 🐛 Problemas Conocidos

### Backend
- [ ] Verificar permisos de archivos en `storage/`
- [ ] Verificar conexión a PostgreSQL
- [ ] Verificar Redis está corriendo

### Game Engine
- [ ] Socket.IO CORS puede dar problemas
- [ ] Redis debe estar activo para estado del juego
- [ ] Verificar puerto 4000 no está en uso

### Frontend
- [ ] Next.js dev server en puerto 3000
- [ ] PixiJS requiere navegadores modernos
- [ ] WebSocket puede bloquearse por firewall

---

## 📊 Resultados Esperados

### Performance
- Backend: < 200ms por request
- Socket.IO: < 50ms latencia
- Frontend: < 1s tiempo de carga inicial

### Funcionalidad
- ✅ 0 errores de JavaScript en consola
- ✅ 0 warnings de TypeScript
- ✅ 0 errores PHP en logs
- ✅ Socket.IO conectado sin errores

---

## 🔧 Debugging

### Ver logs del backend
```bash
tail -f backend/storage/logs/laravel.log
```

### Ver logs del game engine
```bash
# En terminal donde corre npm run start:dev
# Los logs aparecen automáticamente
```

### Ver errores del frontend
```bash
# Abrir DevTools del navegador (F12)
# Pestaña Console
```

### Verificar Redis
```bash
redis-cli ping
# Debe retornar: PONG
```

### Verificar PostgreSQL
```bash
psql -U misterium_user -d misterium_db -c "SELECT COUNT(*) FROM users;"
# Debe retornar: 7 (usuarios de seed)
```

---

## ✅ Criterios de Aceptación

El juego se considera **funcional** si:

1. ✅ Se puede registrar y hacer login
2. ✅ Se pueden crear salas desde el lobby
3. ✅ Múltiples jugadores pueden unirse
4. ✅ El tablero PixiJS se renderiza correctamente
5. ✅ Los jugadores pueden moverse por el tablero
6. ✅ Las acciones de inspeccionar y usar habilidad funcionan
7. ✅ El chat en tiempo real funciona
8. ✅ El sistema de turnos funciona
9. ✅ No hay errores críticos en logs

---

## 📝 Reporte de Bugs

Si encuentras bugs, documenta:
1. **Pasos para reproducir**
2. **Comportamiento esperado**
3. **Comportamiento actual**
4. **Screenshots/logs**
5. **Entorno** (navegador, OS, versión)

---

¡Buena suerte con las pruebas! 🎮
