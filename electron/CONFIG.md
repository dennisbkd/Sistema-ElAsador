# Configuración de Ejemplo

Este archivo muestra la configuración recomendada para diferentes entornos.

## Electron (este directorio)

No requiere archivo `.env` adicional. La configuración se maneja en `main.js`.

### Variables importantes en main.js:

```javascript
const BACKEND_PORT = 3000
const FRONTEND_PORT = 5173
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`
```

## Backend/.env

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=elasador_db

# JWT
JWT_SECRET=tu_secret_key_aqui_cambiala_en_produccion

# Frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Opcional: Puerto del servidor
PORT=3000
```

## Frontend/.env

```env
# URL del backend API
VITE_API_URL=http://localhost:3000

# URL del Socket.IO (generalmente la misma)
VITE_SOCKET_URL=http://localhost:3000
```

## Notas

### Modo Electron
- `ELECTRON_MODE` se establece automáticamente cuando ejecutas desde Electron
- No necesitas configurarlo manualmente
- Backend detecta esta variable y ajusta comportamiento

### Modo Desarrollo (sin Electron)
- Backend usa `localhost` en lugar de `0.0.0.0`
- CORS más restrictivo
- No muestra IP local

### Modo Producción (Nube)
```env
# Backend/.env
DB_HOST=tu-servidor-db.com
DB_PORT=3306
FRONTEND_URL=https://tu-dominio.com

# Frontend/.env
VITE_API_URL=https://api.tu-dominio.com
VITE_SOCKET_URL=https://api.tu-dominio.com
```

## Seguridad

⚠️ **IMPORTANTE**:
- Nunca commitear archivos `.env` con credenciales reales
- Usar `.env.example` como plantilla
- En producción, usar variables de entorno del servidor
- Cambiar `JWT_SECRET` en cada ambiente

## Ejemplo Completo

### Backend/.env.example
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=elasador_db
JWT_SECRET=change_this_in_production
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend/.env.example
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Copia estos archivos como `.env` y ajusta según tu configuración.
