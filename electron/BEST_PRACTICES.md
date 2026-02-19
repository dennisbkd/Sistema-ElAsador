# 📘 Guía de Mejores Prácticas - Electron Integration

## 🎯 Separación de Entornos

### Modo Desarrollo (sin Electron)
```bash
# Terminal 1 - Backend
cd Backend
npm run start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### Modo Electron
```bash
cd electron
npm run dev
```

### Modo Producción (Nube)
- Despliegue tradicional sin Electron
- Backend en servidor (Heroku, AWS, etc.)
- Frontend en CDN (Vercel, Netlify, etc.)

## 🔐 Variables de Entorno

### Backend/.env
```env
# Desarrollo local
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306

# Producción (nube)
# FRONTEND_URL=https://tu-dominio.com
# DB_HOST=tu-servidor-db
```

### Frontend/.env
```env
# Desarrollo local y Electron
VITE_API_URL=http://localhost:3000

# Producción (nube)
# VITE_API_URL=https://api.tu-dominio.com
```

## 🚀 Flujo de Despliegue

### Para Nube (main branch)
1. NO incluir carpeta `/electron`
2. Desplegar Backend y Frontend por separado
3. Configurar variables de entorno de producción
4. El código funciona exactamente igual (sin ELECTRON_MODE)

### Para Desktop (desktop-electron branch)
1. Incluir carpeta `/electron`
2. Construir instalador con electron-builder
3. Distribuir ejecutable a clientes

## 🔄 Gestión de Ramas

```bash
# Rama principal (para nube)
git checkout main
# NO contiene /electron

# Rama desktop
git checkout desktop-electron
# Contiene /electron + modificaciones mínimas
```

## 🛡️ Seguridad

### CORS - Modo Producción
```javascript
// Solo orígenes específicos
const ACCEPTED_ORIGINS = [
  'https://tu-dominio.com',
  'https://app.tu-dominio.com'
]
```

### CORS - Modo Electron
```javascript
// Permite red local automáticamente
if (process.env.ELECTRON_MODE === 'true' && esIpLocal(origin)) {
  return callback(null, true)
}
```

## 📊 Monitoreo

### Logs en Desarrollo
```javascript
// Backend muestra IP automáticamente
console.log(`📱 Acceso desde red: http://${ipLocal}:${port}`)
```

### Logs en Producción
```javascript
// Usar servicio de logs profesional (Winston, Pino, etc.)
```

## 🧪 Testing

### Sin Electron
```bash
# Tests normales
npm test
```

### Con Electron
```bash
# Tests E2E con Spectron o Playwright
```

## 📦 Construcción

### Frontend para Nube
```bash
cd Frontend
npm run build
# Genera /dist para despliegue estático
```

### Frontend para Electron
```bash
cd Frontend
npm run build
# electron-builder toma los archivos de /dist
```

## 🔧 Configuración Condicional

### En Backend
```javascript
// Detectar modo Electron
const esElectron = process.env.ELECTRON_MODE === 'true'

// Configurar según modo
const host = esElectron ? '0.0.0.0' : 'localhost'
const corsOrigenes = esElectron ? permitirLocal() : origenesEspecificos()
```

### En Frontend
```javascript
// Detectar entorno
const esElectron = window?.electronAPI !== undefined

// Configurar según entorno
const baseURL = esElectron 
  ? 'http://localhost:3000' 
  : import.meta.env.VITE_API_URL
```

## 🗄️ Base de Datos

### Desarrollo Local
- MySQL/SQL Server local
- Datos de prueba

### Electron (Cliente)
- Mismo servidor de desarrollo
- O conexión a servidor remoto

### Producción
- Base de datos en servidor
- Backup automático

## 🌐 Networking

### Puertos
- Backend: 3000 (configurable)
- Frontend: 5173 (Vite default)
- Asegúrate que no estén ocupados

### Firewall
```bash
# Windows: Permitir puertos
netsh advfirewall firewall add rule name="El Asador Backend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="El Asador Frontend" dir=in action=allow protocol=TCP localport=5173
```

## 📱 Móviles en Red Local

### Requisitos
1. Misma red WiFi
2. Firewall configurado
3. IP estática (recomendado para producción local)

### Configuración IP Estática
1. Configurar router DHCP
2. Asignar IP fija a PC con Electron
3. Actualizar configuración de móviles

## 🔄 Actualización de Electron

### Método Manual
1. Usuario descarga nuevo instalador
2. Desinstala versión antigua
3. Instala nueva versión

### Método Automático (Futuro)
- Implementar electron-updater
- Auto-update desde servidor

## ⚠️ Errores Comunes

### "Puerto ya en uso"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

### "Cannot connect to backend"
1. Verificar que backend esté corriendo
2. Revisar firewall
3. Confirmar IP correcta

### "CORS error"
1. Verificar origen en DevTools
2. Revisar configuración de CORS
3. Confirmar que ELECTRON_MODE esté activo

## 📋 Checklist Pre-Despliegue

### Para Nube
- [ ] Eliminar referencias a Electron
- [ ] Configurar variables de entorno de producción
- [ ] CORS restringido a dominios específicos
- [ ] Backend NO escucha en 0.0.0.0 (solo en producción)
- [ ] Logs configurados
- [ ] Base de datos en servidor

### Para Desktop
- [ ] Instalar todas las dependencias
- [ ] Construir frontend (`npm run build`)
- [ ] Verificar backend funciona localmente
- [ ] Configurar icono de aplicación
- [ ] Probar en red local con móviles
- [ ] Construir instalador
- [ ] Probar instalador en máquina limpia

## 🎓 Recursos Adicionales

- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [Socket.IO CORS Configuration](https://socket.io/docs/v4/handling-cors/)
- [Vite Build Configuration](https://vitejs.dev/config/build-options.html)
- [electron-builder Documentation](https://www.electron.build/)

## 💡 Tips Finales

1. **Nunca commitear** `node_modules` o `dist`
2. **Usar .gitignore** apropiadamente
3. **Mantener separación** entre ramas main y desktop-electron
4. **Documentar cambios** específicos de Electron
5. **Probar regularmente** en ambos modos (con/sin Electron)
6. **Backup de base de datos** regularmente
7. **Monitorear rendimiento** en producción
8. **Actualizar dependencias** periódicamente

---

**Recuerda**: La integración de Electron debe ser **transparente** para el código de negocio. El backend y frontend deben funcionar perfectamente con o sin Electron.
