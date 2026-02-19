# 🍽️ Sistema El Asador - Modo Escritorio (Electron)

## 📋 Descripción

Esta carpeta contiene la integración de Electron para ejecutar el sistema como aplicación de escritorio. **No modifica la arquitectura original del proyecto** - simplemente actúa como un wrapper que:

- Levanta automáticamente el backend
- Inicia el frontend con Vite
- Abre una ventana de aplicación de escritorio
- Permite acceso desde dispositivos móviles en la red local

## 🚀 Inicio Rápido

### 1️⃣ Instalación

```bash
cd electron
npm install
```

### 2️⃣ Modo Desarrollo

```bash
npm run dev
```

Esto iniciará:
- ✅ Backend en `http://localhost:3000`
- ✅ Frontend en `http://localhost:5173`
- ✅ Aplicación Electron
- ✅ Muestra IP local para acceso móvil

### 3️⃣ Construcción para Producción

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 📱 Acceso desde Móviles

Al iniciar la aplicación, verás en consola:

```
============================================================
🍽️  SISTEMA EL ASADOR - MODO ESCRITORIO
============================================================

📍 Acceso desde esta computadora:
   http://localhost:5173

📱 Acceso desde dispositivos móviles en la red:
   http://192.168.1.X:5173

🔧 API Backend:
   http://192.168.1.X:3000

============================================================
```

Los dispositivos móviles en la misma red WiFi pueden acceder usando la IP mostrada.

## 📁 Estructura

```
electron/
├── main.js              # Proceso principal de Electron
├── preload.js           # Script de seguridad
├── package.json         # Configuración y dependencias
└── utils/
    └── network.js       # Utilidades de red (obtener IP, etc)
```

## ⚙️ Cómo Funciona

1. **Electron inicia** → lee `main.js`
2. **Levanta Backend** → ejecuta `npm run start` en carpeta Backend
3. **Espera confirmación** → verifica que servidor esté activo
4. **Levanta Frontend** → ejecuta `npm run dev` en carpeta Frontend
5. **Abre ventana** → carga `http://localhost:5173`
6. **Muestra IP local** → para acceso desde móviles

## 🔧 Modificaciones al Backend

Las modificaciones son **mínimas y condicionales** (solo activas en modo Electron):

### `Backend/src/main.js`
```javascript
// Escucha en 0.0.0.0 solo en modo Electron
const host = process.env.ELECTRON_MODE === 'true' ? '0.0.0.0' : 'localhost'
```

### `Backend/src/config/corsUrl.js`
```javascript
// Permite IPs locales solo en modo Electron
if (process.env.ELECTRON_MODE === 'true' && esIpLocal(origin)) {
  return callback(null, true)
}
```

### `Backend/src/config/socket.js`
```javascript
// Socket.IO acepta conexiones desde red local en modo Electron
```

## 🧪 Eliminar Electron

Si deseas eliminar la integración de Electron:

```bash
# Simplemente borra la carpeta
rm -rf electron
```

El sistema seguirá funcionando normalmente:

```bash
# Backend
cd Backend
npm run start

# Frontend
cd Frontend
npm run dev
```

## 🌐 Configuración de Red

### Firewall (Windows)

Si los móviles no pueden conectarse:

1. Abre **Windows Defender Firewall**
2. Permite conexiones entrantes en puerto **3000** y **5173**
3. O desactiva temporalmente el firewall para red privada

### Verificar IP Local

```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

Busca tu adaptador de red (WiFi o Ethernet) y usa la IPv4.

## 📦 Construcción para Producción

### Antes de construir:

1. **Construir Frontend**:
```bash
cd Frontend
npm run build
```

2. **Verificar Backend**:
Asegúrate que `node_modules` del backend esté instalado correctamente.

3. **Construir Electron**:
```bash
cd electron
npm run build
```

El instalador se generará en `electron/dist/`

## 🔑 Variables de Entorno

Electron establece automáticamente:

- `ELECTRON_MODE=true` → Para identificar ejecución desde Electron
- `NODE_ENV=development` → En modo desarrollo

## 📝 Notas Importantes

- ✅ **No afecta el despliegue en la nube** - Las modificaciones solo actúan cuando `ELECTRON_MODE=true`
- ✅ **Backend mantiene su lógica original** - Solo cambia dónde escucha (0.0.0.0 vs localhost)
- ✅ **CORS configurado dinámicamente** - Permite red local en Electron, estricto en producción
- ✅ **Socket.IO funciona en LAN** - Acepta conexiones desde cualquier IP local
- ✅ **Eliminación limpia** - Borra `/electron` y todo sigue funcionando

## 🆘 Solución de Problemas

### Backend no inicia
```bash
cd Backend
npm install
```

### Frontend no carga
```bash
cd Frontend
npm install
```

### Puerto ocupado
Cambia el puerto en:
- `Backend/src/main.js` → `const port = 3000`
- `electron/main.js` → `const BACKEND_PORT = 3000`

### Móviles no pueden conectar
- Verifica que estén en la misma red WiFi
- Desactiva temporalmente el firewall
- Confirma la IP local en consola

## 🔗 Recursos

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Socket.IO CORS](https://socket.io/docs/v4/handling-cors/)

## 👨‍💻 Desarrollo

### Arquitectura

```
┌─────────────────────────────────┐
│       Electron (main.js)        │
│  ┌──────────┐    ┌───────────┐  │
│  │ Backend  │    │ Frontend  │  │
│  │ :3000    │◄───┤ :5173     │  │
│  └──────────┘    └───────────┘  │
│         ▲              ▲         │
└─────────┼──────────────┼─────────┘
          │              │
     ┌────┴──────────────┴────┐
     │  Dispositivos Móviles  │
     │   (misma red WiFi)     │
     └────────────────────────┘
```

### Proceso de Inicio

1. Electron ejecuta `main.js`
2. `main.js` llama a `startBackend()` → spawn de `npm run start`
3. Espera mensaje "Servidor activo"
4. `main.js` llama a `startFrontend()` → spawn de `npm run dev`
5. Espera que Vite esté listo
6. Crea `BrowserWindow` y carga frontend
7. Muestra información de red en consola

### Limpieza al Cerrar

Cuando cierras la aplicación:
1. Se detecta evento `before-quit`
2. Se ejecuta función `cleanup()`
3. Se envía `SIGTERM` a backend y frontend
4. Si no responden en 5s, se envía `SIGKILL`

## 📄 Licencia

MIT - Mismo que el proyecto principal
