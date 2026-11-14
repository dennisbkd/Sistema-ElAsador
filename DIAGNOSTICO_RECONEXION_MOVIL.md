# Diagnóstico: reconexión lenta / "no se pudo conectar al servidor" en meseros móviles (iOS)

**Fecha del diagnóstico:** 2026-09-05
**Rama analizada:** `desktop-electron`
**Estado:** Diagnóstico aplicado. Se implementaron controles de sesión y reconexión; este documento conserva las causas y las recomendaciones operativas.

## 1. Síntoma reportado

Los meseros usan el sistema desde el navegador de su celular (más frecuente en iOS) apuntando a la IP local del portátil donde corre la app Electron (`http://<ip-lan>:<puerto>/mesero/pedidos`). Cuando el mesero bloquea el celular o cambia de app dejando la pestaña abierta por un rato, al volver:

- La reconexión es lenta (no en todos los casos, pero cada vez más frecuente).
- A veces termina mostrando "no se pudo conectar al servidor".
- Navegar manualmente hasta la raíz (`/`) a veces "arregla" el problema al instante — redirige al login y carga rápido.

## 2. Arquitectura relevante

La app corre como ejecutable Electron (carpeta `electron/`) que levanta:
- **Backend** Express + Socket.IO en el puerto 3000.
- **Frontend** Vite en el puerto 5173 (o el build servido), con `host: 0.0.0.0` cuando `ELECTRON_MODE=true`, para que sea alcanzable desde otros dispositivos de la LAN.

El portátil tiene IP fija pero está conectado por WiFi — es decir, la LAN es inalámbrica, no cableada, para el equipo servidor también.

## 3. Hallazgos verificados (código leído directamente)

### 3.1 No existe `AuthProvider` / contexto de autenticación

Buscando `AuthContext`, `AuthProvider`, `useAuth`, etc. no aparece nada: la autenticación no vive en un contexto de React ni en estado global. Todo pasa por lecturas directas a `localStorage`.

El guard de rutas protegidas es [Rutaprotegida.jsx](Frontend/src/Admin/components/Rutaprotegida.jsx):

```js
export const Rutaprotegida = ({ rolesPermitidos = [], children }) => {
  const token = getValidToken()
  const usuario = getValidUser()
  if (!token) return <Navigate to="/" replace />
  if (!usuario || !usuario.rol) return <Navigate to="/" replace />
  if (usuario.rol === 'ADMINISTRADOR') return children
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) return <Navigate to="/autorizacion-restringida" replace />
  return children
}
```

Es un chequeo **síncrono**, sin estado de "cargando", que solo llama a `getValidToken()` ([tokenUtils.js](Frontend/src/utils/tokenUtils.js)) — y esa función únicamente valida que el string tenga 3 partes separadas por punto (`isValidJWT`). **Nunca revisa el claim `exp` del token ni consulta al backend.** No existe ningún endpoint `/me` o `/verify` en el backend para confirmar que la sesión sigue viva al montar la app.

Consecuencia: un JWT vencido pero con formato válido se trata como "sesión activa" hasta que la primera llamada HTTP falle con 401.

### 3.2 JWT de 24h, sin refresh token

[Backend/src/config/token.js](Backend/src/config/token.js):

```js
this.expiracion = process.env.expiracion || '24h'
...
jwt.sign(usuario, this.PALABRA_SECRETA, { expiresIn: this.expiracion })
```

No hay ningún mecanismo de refresh token, ni en backend ni en frontend. Una vez vencido, la única forma de detectarlo es que una petición REST devuelva 401 y el interceptor de Axios haga logout.

### 3.3 Axios sin timeout + React Query con reintentos largos por defecto

[Frontend/src/config/axios.js](Frontend/src/config/axios.js):

```js
instancia.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = '/autorizacion-restringida'
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && window.location.pathname !== '/') {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.dispatchEvent(new Event('auth-logout'))
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
```

La instancia de Axios **no define `timeout`** (por defecto es `0`, es decir infinito). El `QueryClient` en [App.jsx](Frontend/src/App.jsx) se crea sin `defaultOptions` (`new QueryClient()`), así que la mayoría de queries heredan el comportamiento por defecto de React Query: `retry: 3` con backoff exponencial (hasta ~30s de espera entre intentos) y `refetchOnWindowFocus`/`refetchOnReconnect` activos. Algunas pantallas sí sobreescriben esto (dashboard, venta móvil), pero no todas las que usa el flujo de mesero.

**Efecto combinado:** si al volver del background la conexión TCP quedó "semi-abierta" (típico de iOS Safari suspendiendo pestañas), una petición puede tardar mucho en fallar — varios reintentos con backoff — antes de que el 401 real dispare el logout. Esto coincide con la sensación de "tarda en reconectar" antes de terminar en "no se pudo conectar al servidor".

### 3.4 El socket de Socket.IO nunca verifica el JWT

Cliente, [SocketProvider.jsx](Frontend/src/context/SocketProvider.jsx):

```js
const nuevaConexionIo = io(socketUrl, {
  auth: {
    usuario: {
      id: decodeToken?.id,
      usuario: decodeToken?.usuario
    }
  },
  autoConnect: true,
  transports: ['websocket', 'polling'],
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.3,
  withCredentials: true
})
```

Solo se envía el **payload decodificado** (`id`, `usuario`), nunca el JWT firmado.

Servidor, [Backend/src/config/socket.js](Backend/src/config/socket.js):

```js
io.on('connection', (socket) => {
  const usuarioId = socket.handshake.auth.usuario?.id || null
  if (usuarioId) {
    socket.join(`usuario_${usuarioId}`)
  }
  ...
})
```

**No hay ningún `io.use(...)` de verificación** — el backend confía ciegamente en lo que el cliente dice ser. Contraste directo con las rutas REST, que sí pasan por [decodificarToken.js](Backend/middleware/decodificarToken.js) (`jwt.verify`, rechaza con 401 si expiró o es inválido).

**Consecuencia directa:** el socket puede seguir reconectando "exitosamente" con `reconnectionAttempts: Infinity` aunque el JWT ya haya expirado. Mientras tanto, cualquier llamada REST empieza a fallar con 401. El resultado es un estado incoherente: la UI puede mostrar "conectado" (socket) mientras nada carga (REST), que es exactamente el comportamiento errático reportado.

### 3.5 Manejo de background/foreground incompleto para iOS

`SocketProvider.jsx` (agregado/ampliado en el commit `021bd82`, "mejorar la configuración de conexión de Socket.IO y manejar reconexiones automáticas") escucha:

- `visibilitychange` → si vuelve a visible y el socket no está conectado, fuerza `socket.connect()`.
- `online` → fuerza reconexión.
- `offline` → marca `isConnected(false)`.
- `disconnect` con `reason === 'ping timeout'` y pestaña visible → reintenta conectar tras 700ms.

Esto está bien para la mayoría de casos, pero:

- **No maneja `pagehide`/`pageshow`**, que es el mecanismo que iOS Safari usa para el back-forward cache (bfcache). Cuando iOS restaura una pestaña desde bfcache tras un rato en background, el ciclo de vida no siempre dispara `visibilitychange` de la misma manera, y las conexiones de red (incluyendo WebSocket) pueden haber sido cortadas por el sistema sin que el evento `disconnect` del socket llegue a tiempo — de ahí la variabilidad ("no es en todos los casos, pero cada vez más frecuente en iOS").
- **Ninguna de estas rutas revalida el token.** Todas vuelven a llamar `getValidToken()`, que solo checa formato, no expiración.
- El commit también subió `pingTimeout` de 60s a 120s y `pingInterval` de 30s a 25s en el backend ([Backend/src/config/socket.js](Backend/src/config/socket.js)) — un intento previo de tolerar mejor la suspensión de pestañas en móvil, pero no resuelve el problema de fondo (falta de revalidación de sesión).

### 3.6 Por qué ir a `/` "arregla" el problema (una vez)

La ruta raíz (`/`) no está protegida por `Rutaprotegida` y no dispara ninguna petición de datos — solo renderiza el login. Al loguearse de nuevo:
1. Se emite el evento `auth-login`, que hace que `SocketProvider` destruya el socket viejo y cree uno nuevo con un token fresco.
2. Se obtiene un JWT nuevo de 24h.
3. No hay ningún fetch colgado esperando timeout, porque el login no depende de queries previas.

Esto explica por qué "carga rápido" comparado con quedarse en una ruta protegida cuyo primer fetch puede estar colgado por el timeout infinito de Axios + reintentos de React Query.

### 3.7 Hallazgo secundario — no es la causa raíz en este despliegue

[Backend/src/config/corsUrl.js](Backend/src/config/corsUrl.js) y [Backend/src/config/socket.js](Backend/src/config/socket.js) tienen una lista hardcodeada de orígenes permitidos (incluye `http://192.168.1.9:5173`), usada solo si `ELECTRON_MODE !== 'true'`. Como [electron/main.js](electron/main.js) sí exporta `ELECTRON_MODE=true` al lanzar los procesos, en este despliegue se usa el regex de IPs locales (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`), así que el CORS no debería estar bloqueando nada mientras la app se lance vía Electron. Queda documentado por si en algún momento se corre backend/frontend fuera de Electron (por ejemplo en desarrollo manual) — ahí sí podría fallar si tu IP no coincide con la lista hardcodeada.

## 4. Conclusión — causas más probables, en orden de impacto

1. **Falta de revalidación de sesión al volver del background.** No hay chequeo de expiración de JWT en el cliente ni endpoint de verificación en el backend — la app solo se entera de que la sesión venció cuando una petición REST falla.
2. **Ausencia de timeout en Axios + reintentos largos de React Query por defecto**, que hace que el primer fetch tras el resume tarde mucho en fallar antes de mostrar el error real.
3. **El socket no verifica el JWT**, dando una falsa sensación de "conectado" mientras las llamadas REST ya rechazan el token vencido. Esta discrepancia entre "socket OK" y "REST falla" es la raíz del comportamiento errático — más visible en iOS por su manejo agresivo de pestañas en background (throttling/suspensión de timers y sockets sin aviso claro a la app, y bfcache que no siempre dispara los eventos que el código actual escucha).

La combinación de estos tres factores explica tanto la variabilidad (depende de cuánto tiempo pasó, si el JWT ya venció, y cómo iOS decidió suspender esa pestaña en particular) como la mayor incidencia en iOS frente a otras plataformas.

## 5. Cambios implementados

Se aplicaron los siguientes cambios:

- Axios tiene un timeout de 15 segundos y React Query limita los reintentos a uno.
- Socket.IO verifica el JWT firmado durante el handshake.
- El cliente valida la expiración local del JWT y renueva sesiones próximas a vencer.
- Se manejan `visibilitychange`, `pageshow`, `online` y desconexiones iniciadas por el servidor.
- Las reconexiones automáticas del socket están limitadas para evitar ciclos agresivos; al volver a la pestaña se actualiza el token y se intenta una conexión controlada.

## 6. Recomendaciones operativas y pendientes

1. Probar con la laptop conectada por Ethernet. Al estar el host y varios móviles en WiFi, una caída selectiva de clientes puede ser del punto de acceso, interferencia o ahorro de energía del router; que un celular nuevo funcione no descarta ese problema.
2. Durante el próximo incidente, comprobar desde un móvil afectado si `http://192.168.1.6:5173` abre y si `http://192.168.1.6:3000` responde. Si ambos fallan, el problema es red/firewall, no autenticación.
3. Si la página abre pero el login falla, revisar la consola de Electron buscando `TOKEN_EXPIRED`, `TOKEN_INVALID`, `ECONNRESET` o `Not allowed by CORS`.
4. Mantener como mejora futura un refresh token dedicado si se requiere una sesión sin límite práctico de duración.
