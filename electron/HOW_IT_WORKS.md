# 🔍 Cómo Funciona la Integración

## Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    ELECTRON APP                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              main.js (Main Process)              │   │
│  │  • Gestiona ventana                              │   │
│  │  • Levanta backend (child_process)               │   │
│  │  • Levanta frontend (child_process)              │   │
│  │  • Muestra IP local                              │   │
│  └───────┬──────────────────────────┬────────────────┘   │
│          │                          │                    │
│  ┌───────▼──────────┐      ┌───────▼──────────┐         │
│  │   Backend        │      │   Frontend       │         │
│  │   (Express)      │◄─────┤   (React+Vite)   │         │
│  │   :3000          │      │   :5173          │         │
│  │                  │      │                  │         │
│  │  • REST API      │      │  • UI React      │         │
│  │  • Socket.IO     │      │  • Socket client │         │
│  │  • Base de datos │      │  • Axios         │         │
│  └──────────────────┘      └──────────────────┘         │
│          ▲                          ▲                    │
└──────────┼──────────────────────────┼────────────────────┘
           │                          │
           │      Red Local WiFi      │
           │                          │
    ┌──────┴─────────────────────────┴──────┐
    │      📱 Dispositivos Móviles          │
    │   • Navegador web                     │
    │   • http://192.168.X.X:5173           │
    │   • Socket.IO connection              │
    └───────────────────────────────────────┘
```

## Flujo de Inicio (Detallado)

### 1. Usuario ejecuta `npm run dev`

```bash
electron .
```

### 2. Electron carga `main.js`

```javascript
app.whenReady().then(initialize)
```

### 3. Función `initialize()` se ejecuta

```javascript
async function initialize() {
  await startBackend()      // Paso 4
  await startFrontend()     // Paso 5
  displayNetworkInfo()      // Paso 6
  createWindow()            // Paso 7
}
```

### 4. `startBackend()` - Iniciar Backend

```javascript
const backendProcess = spawn(
  'npm.cmd',  // npm en Windows
  ['run', 'start'],
  {
    cwd: path.join(__dirname, '..', 'Backend'),
    env: {
      ...process.env,
      ELECTRON_MODE: 'true'  // 🔑 Variable clave
    }
  }
)
```

**¿Qué sucede?**
- Ejecuta `npm run start` en carpeta Backend
- Establece `ELECTRON_MODE=true`
- Backend detecta esta variable y:
  - Escucha en `0.0.0.0` (todas las interfaces)
  - Permite CORS desde IPs locales
  - Socket.IO acepta conexiones LAN

**Backend/src/main.js:**
```javascript
const host = process.env.ELECTRON_MODE === 'true' 
  ? '0.0.0.0'      // Accesible desde red
  : 'localhost'     // Solo local
```

### 5. `startFrontend()` - Iniciar Frontend

```javascript
const frontendProcess = spawn(
  'npm.cmd',
  ['run', 'dev'],
  {
    cwd: path.join(__dirname, '..', 'Frontend')
  }
)
```

**¿Qué sucede?**
- Ejecuta `npm run dev` (Vite)
- Vite inicia en `http://localhost:5173`
- Sirve la aplicación React

### 6. `displayNetworkInfo()` - Mostrar Info

```javascript
const localIp = getLocalIpAddress()
console.log(`📱 Acceso desde móviles: http://${localIp}:5173`)
```

**utils/network.js:**
```javascript
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces()
  // Busca primera IPv4 no interna
  // Ej: 192.168.1.10
}
```

### 7. `createWindow()` - Crear Ventana

```javascript
mainWindow = new BrowserWindow({
  width: 1400,
  height: 900,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true
  }
})

mainWindow.loadURL('http://localhost:5173')
```

**Resultado:**
- Ventana de Electron abierta
- Muestra interfaz React del frontend
- Usuario puede interactuar normalmente

## Comunicación Backend ↔ Frontend

### Desde Frontend (React)

```javascript
// En cualquier componente
import axios from 'axios'

// Llamada API REST
const response = await axios.get('http://localhost:3000/api/ventas')

// Socket.IO
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')
socket.emit('evento', datos)
socket.on('respuesta', (data) => { ... })
```

### Desde Móvil

```javascript
// MISMO código, diferente URL
const response = await axios.get('http://192.168.1.10:3000/api/ventas')

const socket = io('http://192.168.1.10:3000')
```

**¿Cómo es posible?**
- Backend escucha en `0.0.0.0` → Todas las IPs
- CORS permite IPs locales → `192.168.*.*`
- Socket.IO acepta conexiones LAN

## Variables de Entorno Clave

### `ELECTRON_MODE=true`

Establecida por Electron en el proceso del backend:

```javascript
// electron/main.js
env: {
  ...process.env,
  ELECTRON_MODE: 'true'  // 👈 Aquí se establece
}
```

Detectada en backend:

```javascript
// Backend/src/main.js
const esElectron = process.env.ELECTRON_MODE === 'true'

// Backend/src/config/corsUrl.js
if (process.env.ELECTRON_MODE === 'true' && esIpLocal(origin)) {
  return callback(null, true)
}

// Backend/src/config/socket.js
if (process.env.ELECTRON_MODE === 'true') {
  // Permitir IPs locales
}
```

## Seguridad

### Electron

```javascript
// preload.js - Aísla contextos
contextBridge.exposeInMainWorld('electronAPI', {
  // Solo exponer APIs seguras
})

// main.js - BrowserWindow
webPreferences: {
  nodeIntegration: false,     // ❌ No exponer Node al renderer
  contextIsolation: true      // ✅ Aislar contextos
}
```

### CORS (Backend)

```javascript
// Desarrollo SIN Electron
origin: 'http://localhost:5173'  // Solo este

// Desarrollo CON Electron
if (esIpLocal(origin)) {
  callback(null, true)  // 192.168.*.* OK
}
```

### Socket.IO

```javascript
// Mismo principio
cors: {
  origin: (origin, callback) => {
    if (esElectron && esIpLocal(origin)) {
      callback(null, true)
    }
  }
}
```

## Proceso de Cierre

### Usuario cierra ventana

```javascript
app.on('before-quit', cleanup)

function cleanup() {
  // 1. Enviar SIGTERM a backend
  backendProcess.kill('SIGTERM')
  
  // 2. Enviar SIGTERM a frontend
  frontendProcess.kill('SIGTERM')
  
  // 3. Si no responden en 5s, forzar (SIGKILL)
  setTimeout(() => {
    if (!backendProcess.killed) {
      backendProcess.kill('SIGKILL')
    }
  }, 5000)
}
```

## Comparación: Con vs Sin Electron

### SIN Electron (Desarrollo Normal)

```bash
# Terminal 1
cd Backend
npm run start
# Escucha: localhost:3000
# CORS: Solo localhost:5173
# Socket.IO: Solo localhost

# Terminal 2
cd Frontend
npm run dev
# http://localhost:5173
```

### CON Electron

```bash
# Terminal único
cd electron
npm run dev

# Electron inicia TODO automáticamente
# Backend escucha: 0.0.0.0:3000
# CORS: IPs locales permitidas
# Socket.IO: Acepta LAN
# Ventana automática
```

## Ventajas de Este Enfoque

1. **No rompe el original**: Sin Electron, todo funciona igual
2. **Modular**: Electron está aislado en `/electron`
3. **Fácil mantenimiento**: Cambios mínimos en backend
4. **Eliminación limpia**: Borrar `/electron` = vuelta al original
5. **Despliegue separado**: Rama `main` sin Electron para nube

## Desventajas a Considerar

1. **Dos procesos hijos**: Consume más recursos
2. **Tiempo de inicio**: ~10-15 segundos (backend + frontend)
3. **Dependencias duplicadas**: Backend y Frontend tienen sus node_modules
4. **Debugging complejo**: Tres procesos simultáneos

## Optimizaciones Futuras

### Para Producción Desktop

1. **Pre-compilar frontend**: Usar `dist/` estático en lugar de Vite dev
2. **Backend empaquetado**: Usar `pkg` para crear ejecutable
3. **Auto-actualización**: Implementar `electron-updater`
4. **Base de datos local**: SQLite en lugar de MySQL

### Código de ejemplo (futuro)

```javascript
// electron/main.js (producción)
const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  await startBackend()
  await startFrontend()
  mainWindow.loadURL('http://localhost:5173')
} else {
  // Producción: todo empaquetado
  mainWindow.loadFile(path.join(__dirname, '../Frontend/dist/index.html'))
  // Backend como ejecutable incluido
}
```

## Preguntas Frecuentes

### ¿Por qué no modificar el código original más?

Para mantener compatibilidad con despliegue en nube. El cambio es **condicional** usando `ELECTRON_MODE`.

### ¿Por qué dos procesos en lugar de integrar?

Mantiene la arquitectura original intacta. Backend y Frontend son independientes.

### ¿Funciona en producción?

Sí, pero requiere construir el instalador con `electron-builder`.

### ¿Puedo usar otra base de datos?

Sí, configura en `Backend/.env`. Funciona con MySQL, SQL Server, PostgreSQL, etc.

### ¿Y si quiero SOLO escritorio (sin móviles)?

Cambia `0.0.0.0` por `localhost` en `Backend/src/main.js`. CORS seguirá funcionando.

---

**Resumen**: Electron actúa como orquestador que levanta backend y frontend, configura networking para LAN, y presenta todo en una ventana de escritorio. El código de negocio NO cambia.
