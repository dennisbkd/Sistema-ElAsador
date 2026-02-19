# 📱 Guía de Prueba - Acceso desde Móvil

## ✅ Cambios realizados

1. **networkUtils.js**: Mejorada detección automática (maneja cadenas vacías correctamente)
2. **Frontend/.env**: Variables comentadas para usar detección automática
3. **Backend/.env**: Limpiado duplicados y configuraciones con IPs fijas
4. **Logs añadidos**: Verás en consola qué URL está usando el frontend

## 🧪 Cómo probar

### Paso 1: Reiniciar completamente la aplicación

```bash
# Detener la aplicación si está corriendo (Ctrl+C)

# Limpiar cache de Vite (opcional pero recomendado)
cd C:/ELASADOR/Sistema-ElAsador/Frontend
rm -rf node_modules/.vite

# Volver a electron e iniciar
cd C:/ELASADOR/Sistema-ElAsador/electron
npm run dev
```

### Paso 2: Verificar en la consola

Cuando la aplicación inicie, verás:

```
============================================================
🍽️  SISTEMA EL ASADOR - MODO ESCRITORIO
============================================================

📍 Acceso desde esta computadora:
   http://127.0.0.1:5173

📱 Acceso desde dispositivos móviles en la red:
   http://192.168.1.12:5173    <-- Usa esta IP

🔧 API Backend:
   http://192.168.1.12:3000
```

### Paso 3: Probar desde la PC primero

1. Abre las DevTools (F12)
2. Ve a la consola
3. Deberías ver:
   ```
   🔍 Detectando backend automáticamente desde hostname: localhost
   ✅ URL detectada (localhost): http://localhost:3000
   🔗 Backend URL: http://localhost:3000
   ```
4. Intenta iniciar sesión
5. Debería funcionar correctamente

### Paso 4: Probar desde el móvil

1. **Conecta tu celular a la misma WiFi**
2. **Abre el navegador del celular**
3. **Ve a:** `http://192.168.1.12:5173` (usa la IP que aparece en tu consola)
4. **Abre la consola del navegador móvil** (opcional):
   - Chrome Android: chrome://inspect
   - Safari iOS: Conecta al Mac y usa Safari Developer Tools
5. **Deberías ver en la consola:**
   ```
   🔍 Detectando backend automáticamente desde hostname: 192.168.1.12
   ✅ URL detectada (red local): http://192.168.1.12:3000
   🔗 Backend URL: http://192.168.1.12:3000
   ```
6. **Intenta iniciar sesión**

## 🐛 Solución de problemas

### El móvil no puede conectarse al backend

**Síntoma:** Login falla, timeout, o error de conexión

**Verificar:**

1. **¿El móvil y la PC están en la misma WiFi?**
   ```bash
   # En la PC, verifica tu IP:
   ipconfig  # Windows
   # Busca "IPv4 Address" en la sección WiFi
   ```

2. **¿El firewall de Windows está bloqueando?**
   - Ve a: Configuración → Privacidad y seguridad → Firewall de Windows
   - Permite Node.js y Electron en red privada

3. **¿El backend está escuchando en 0.0.0.0?**
   - En los logs de Electron busca:
     ```
     [BACKEND] Servidor activo en el puerto: 3000
     [BACKEND] 📍 Acceso local: http://localhost:3000
     [BACKEND] 📱 Acceso desde red: http://192.168.x.x:3000
     ```

4. **¿El CORS está funcionando?**
   - En los logs del backend busca errores de CORS
   - No deberías ver: "Not allowed by CORS"

### El socket no se conecta desde el móvil

**Verificar en la consola del navegador:**
```
🔌 Conectando socket a: http://192.168.1.12:3000
✅ Socket conectado después de login
```

Si ves error de conexión socket, verifica que `ELECTRON_MODE=true` esté configurado.

## 📋 Checklist de verificación

Antes de abrir un issue, verifica:

- [ ] La aplicación Electron se reinició completamente
- [ ] El móvil está en la misma WiFi
- [ ] La consola muestra la URL correcta detectada
- [ ] El backend muestra "Acceso desde red: http://192.168.x.x:3000"
- [ ] No hay errores de CORS en los logs del backend
- [ ] El firewall permite las conexiones

## 🔍 Logs útiles para debugging

### En la consola del navegador (PC o móvil):
- `🔍 Detectando backend automáticamente...`
- `✅ URL detectada: http://...`
- `🔗 Backend URL: http://...`
- `🔌 Conectando socket a: http://...`

### En la terminal de Electron (consola del backend):
- `Servidor activo en el puerto: 3000`
- `📱 Acceso desde red: http://192.168.x.x:3000`

## 💡 Tip: Modo desarrollo avanzado

Si necesitas más logs, abre las DevTools de Electron:
```javascript
// En electron/main.js ya está habilitado en modo development:
if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools()
}
```
