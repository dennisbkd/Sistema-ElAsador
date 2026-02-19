# 🛠️ Solución de Problemas - Electron Desktop

## Problemas Comunes y Soluciones

### ❌ Error: "Puerto 3000 ya está en uso"

**Síntoma:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución Windows:**
```cmd
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza <PID> con el número mostrado)
taskkill /PID <PID> /F
```

**Solución macOS/Linux:**
```bash
# Ver y matar proceso
lsof -ti:3000 | xargs kill

# O más agresivo
sudo kill -9 $(lsof -t -i:3000)
```

---

### ❌ Error: "Puerto 5173 ya está en uso"

**Síntoma:**
Frontend de Vite no inicia o muestra error de puerto.

**Solución:**
Mismo proceso que con puerto 3000, pero usa `5173` en los comandos.

---

### ❌ Backend no inicia

**Síntoma:**
```
Error al iniciar backend
```

**Diagnóstico:**
```bash
cd Backend
npm run start
```

**Posibles causas:**

1. **Dependencias no instaladas:**
```bash
cd Backend
npm install
```

2. **Error en base de datos:**
   - Verifica que MySQL/SQL Server esté corriendo
   - Revisa credenciales en `Backend/.env`
   - Verifica nombre de base de datos

3. **Archivo .env faltante:**
```bash
cd Backend
cp .env.example .env  # Si existe
# Edita .env con tus credenciales
```

---

### ❌ Frontend no carga

**Síntoma:**
Ventana de Electron queda en blanco o muestra error.

**Solución:**

1. **Instalar dependencias:**
```bash
cd Frontend
npm install
```

2. **Limpiar caché de Vite:**
```bash
cd Frontend
rm -rf node_modules/.vite
npm run dev
```

3. **Verificar puerto:**
   - Asegúrate que puerto 5173 esté libre
   - O cambia el puerto en `Frontend/vite.config.js`

---

### 📱 Móviles no pueden conectar

**Síntoma:**
Desde el móvil no se puede acceder a `http://192.168.X.X:5173`

**Diagnóstico:**
```bash
# Verificar IP
ipconfig          # Windows
ifconfig          # macOS/Linux
ip addr show      # Linux alternativo
```

**Soluciones:**

1. **Verificar misma red WiFi:**
   - PC y móvil deben estar en la misma red
   - No funciona con datos móviles

2. **Firewall Windows:**
```cmd
# Permitir puerto 3000
netsh advfirewall firewall add rule name="El Asador Backend" dir=in action=allow protocol=TCP localport=3000

# Permitir puerto 5173
netsh advfirewall firewall add rule name="El Asador Frontend" dir=in action=allow protocol=TCP localport=5173
```

3. **Firewall macOS:**
```bash
# Ir a Preferencias del Sistema > Seguridad y Privacidad > Firewall
# Agregar excepciones para Node y Electron
```

4. **Verificar que backend escuche en 0.0.0.0:**
   - Debería mostrar en consola: "Acceso desde red"
   - Si no, verifica que `ELECTRON_MODE=true` esté activo

---

### ❌ Error: "Not allowed by CORS"

**Síntoma:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución:**

1. **Verificar que estés en modo Electron:**
   - El error puede aparecer si corres backend sin Electron
   - Debe mostrar "ELECTRON_MODE=true" en logs

2. **Verificar IP en rango local:**
   - CORS solo permite: 192.168.*.*, 10.*.*.*, 172.16-31.*.*
   - Si tu red usa otro rango, actualiza `Backend/src/config/corsUrl.js`

3. **Agregar origen manualmente:**
```javascript
// Backend/src/config/socket.js
const origenesPemitidos = [
  'http://localhost:5173',
  'http://TU-IP-AQUI:5173',  // Agregar tu IP
  process.env.FRONTEND_URL
]
```

---

### ❌ Socket.IO no conecta

**Síntoma:**
```
WebSocket connection failed
```

**Solución:**

1. **Verificar URL de Socket.IO en frontend:**
```javascript
// Debe usar IP correcta
const socket = io('http://192.168.X.X:3000')
```

2. **Verificar configuración CORS de Socket.IO:**
   - Revisa `Backend/src/config/socket.js`
   - Debe permitir tu IP

3. **Verificar puerto:**
   - Socket.IO usa el mismo puerto que backend (3000)

---

### ❌ Base de datos no conecta

**Síntoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solución:**

1. **Verificar que MySQL/SQL Server esté corriendo:**
```bash
# MySQL Windows
services.msc  # Buscar MySQL

# MySQL macOS/Linux
sudo systemctl status mysql
```

2. **Verificar credenciales:**
```env
# Backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=elasador_db
```

3. **Crear base de datos si no existe:**
```sql
CREATE DATABASE elasador_db;
```

---

### ❌ Electron no abre ventana

**Síntoma:**
Backend y frontend inician pero no aparece ventana.

**Solución:**

1. **Verificar logs:**
   - Busca errores en consola
   - Electron puede estar esperando que servidores estén listos

2. **Timeout muy corto:**
```javascript
// electron/main.js
await waitForServer(BACKEND_URL, 60000)  // Aumentar a 60s
```

3. **Limpiar caché de Electron:**
```bash
cd electron
rm -rf node_modules
npm install
```

---

### ⚠️ Aplicación muy lenta

**Causas comunes:**

1. **Modo watch de backend:**
   - `--watch` en desarrollo recarga automáticamente
   - Normal para desarrollo, no usar en producción

2. **DevTools abierto:**
   - Cierra DevTools si no los necesitas
   - Comenta esta línea:
```javascript
// electron/main.js
// mainWindow.webContents.openDevTools()
```

3. **Muchos logs:**
   - Reduce console.log en backend

---

### ❌ Build falla (electron-builder)

**Síntoma:**
```
Error: Cannot find module 'electron-builder'
```

**Solución:**

1. **Instalar dependencias:**
```bash
cd electron
npm install
```

2. **Construir frontend primero:**
```bash
cd Frontend
npm run build
```

3. **Verificar que exista Frontend/dist:**
```bash
ls Frontend/dist
```

4. **Intentar build nuevamente:**
```bash
cd electron
npm run build
```

---

### ❌ Instalador no funciona

**Síntoma:**
Instalador se crea pero no ejecuta la app correctamente.

**Solución:**

1. **Verificar recursos incluidos:**
```json
// electron/package.json
"extraResources": [
  {
    "from": "../Backend",
    "to": "Backend"
  }
]
```

2. **Cambiar a modo producción:**
   - El instalador debe usar archivos estáticos
   - Ver sección de producción en `BEST_PRACTICES.md`

---

### 🔄 Resetear todo

Si nada funciona, resetear completamente:

```bash
# 1. Borrar node_modules de todo
rm -rf Backend/node_modules
rm -rf Frontend/node_modules
rm -rf electron/node_modules

# 2. Reinstalar todo
cd Backend && npm install
cd ../Frontend && npm install
cd ../electron && npm install

# 3. Verificar configuración
cd electron
npm run check

# 4. Intentar iniciar
npm run dev
```

---

## Verificación Pre-Inicio

Antes de ejecutar `npm run dev`, verifica:

```bash
cd electron
npm run check
```

Este comando verifica:
- ✅ Estructura de directorios
- ✅ Archivos principales existen
- ✅ Dependencias instaladas
- ✅ Puertos disponibles

---

## Logs y Debugging

### Ver logs detallados de Electron:
```bash
cd electron
cross-env DEBUG=* npm run dev
```

### Ver logs de backend:
```bash
cd Backend
npm run start
# Observa la consola
```

### Ver logs de frontend:
```bash
cd Frontend
npm run dev
# Observa la consola
```

### Logs de Socket.IO:
```javascript
// Agregar en backend
import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {...},
  transports: ['websocket', 'polling'],
  debug: true  // 👈 Agregar esto
})
```

---

## Soporte Adicional

Si el problema persiste:

1. **Revisa documentación:**
   - [README.md](README.md)
   - [HOW_IT_WORKS.md](HOW_IT_WORKS.md)
   - [BEST_PRACTICES.md](BEST_PRACTICES.md)

2. **Verifica versiones:**
```bash
node --version    # Debe ser v18+
npm --version     # Debe ser v9+
```

3. **Busca en logs:**
   - Backend: Errores de base de datos, CORS
   - Frontend: Errores de conexión API
   - Electron: Errores de spawn, child process

4. **Prueba sin Electron:**
```bash
# Terminal 1
cd Backend
npm run start

# Terminal 2
cd Frontend
npm run dev

# Si funciona sin Electron, el problema está en electron/main.js
```

---

## Información del Sistema

Para reportar problemas, incluye:

```bash
# Sistema operativo
# Windows: winver
# macOS: sw_vers
# Linux: lsb_release -a

# Versiones
node --version
npm --version
npx electron --version

# Estructura
tree -L 2  # o dir /s en Windows
```

---

**Última actualización:** Febrero 2026
