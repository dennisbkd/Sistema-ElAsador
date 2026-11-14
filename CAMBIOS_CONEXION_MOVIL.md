# Cambios aplicados para conexión móvil

## Alcance

Este documento registra los cambios realizados para mejorar la conexión de dispositivos móviles al sistema. No incluye configuraciones realizadas en el router.

## Cambios aplicados en el código

### Frontend

#### `Frontend/src/config/axios.js`

- Se configuró un timeout de 15 segundos para las peticiones HTTP.
- Se mantiene la detección dinámica del backend según la IP desde la que se abre el frontend.
- Las respuestas `401` limpian la sesión y redirigen al inicio.

#### `Frontend/src/App.jsx`

- React Query quedó configurado con:
  - Un reintento por consulta.
  - Un segundo de espera entre reintentos.

Esto evita que una petición móvil quede esperando demasiado tiempo después de una desconexión.

#### `Frontend/src/utils/tokenUtils.js`

- Se agregó validación de expiración del JWT mediante el claim `exp`.
- Los tokens inválidos o vencidos se eliminan automáticamente del almacenamiento local.
- Se agregó soporte para detectar tokens próximos a vencer.

#### `Frontend/src/hooks/useSessionRenewal.jsx`

- Se agregó renovación automática del token cuando faltan menos de dos horas para su expiración.
- La renovación se revisa:
  - Al cargar la aplicación.
  - Al volver a hacer visible la pestaña.
  - Cada 15 minutos.
- Después de renovar el token se notifica al socket para que utilice el token actualizado.

#### `Frontend/src/context/SocketProvider.jsx`

- El socket envía el JWT firmado durante el handshake.
- Se agregaron controles para:
  - `visibilitychange`.
  - `pageshow`, incluyendo restauración desde bfcache en iPhone.
  - Eventos `online` y `offline`.
  - Desconexiones iniciadas por el servidor.
- Al reconectar se vuelve a cargar el token vigente.
- Las reconexiones automáticas se limitaron a ocho intentos para evitar ciclos excesivos o saturación.

### Backend

#### `Backend/src/config/socket.js`

- Socket.IO verifica el JWT firmado durante el handshake.
- Se rechazan tokens:
  - Ausentes.
  - Inválidos.
  - Vencidos.
- El usuario autenticado se guarda en `socket.data.usuario`.
- Se mantienen los parámetros de tolerancia para conexiones móviles:
  - `pingTimeout`: 120 segundos.
  - `pingInterval`: 25 segundos.

#### Autenticación

- Se agregó el endpoint:

```text
POST /auth/renovar
```

- Este endpoint genera un nuevo JWT a partir de un token todavía válido.

## Configuración manual realizada en Windows

### Perfil de red WiFi

La conexión WiFi de la laptop se cambió de perfil **Público** a perfil **Privado** usando PowerShell como administrador:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

### Reglas del Firewall de Windows

Se crearon reglas de entrada para permitir el acceso desde la red local:

```powershell
New-NetFirewallRule -DisplayName "El Asador Frontend 5173" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 5173 `
  -Action Allow `
  -Profile Private
```

```powershell
New-NetFirewallRule -DisplayName "El Asador Backend 3000" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 3000 `
  -Action Allow `
  -Profile Private
```

Estas reglas permiten:

- Frontend Vite: puerto `5173`.
- Backend Express y Socket.IO: puerto `3000`.

### Dirección IP observada

Después del cambio de router, la laptop obtuvo esta configuración:

```text
IP local:       192.168.0.21
Máscara:        255.255.255.0
Puerta de enlace: 192.168.0.1
```

El acceso actual desde los dispositivos móviles es:

```text
http://192.168.0.21:5173
```

La IP anterior `192.168.1.6` pertenecía a la red anterior y ya no debe utilizarse.

## Validaciones realizadas

- ESLint del frontend: correcto.
- Build del frontend usando el minificador disponible: correcto.
- Se verificó que el frontend escucha en la red local mediante Vite.
- Se verificó que el backend escucha en `0.0.0.0` en modo Electron.
- Android logró conectarse correctamente después de los cambios.
- En iPhone, alternar el WiFi fuerza la recuperación de conexiones suspendidas.

## Configuraciones no incluidas

No se realizaron ni documentan cambios del router, incluyendo:

- Reserva DHCP de la IP `192.168.0.21`.
- Desactivación de AP Isolation o Client Isolation.
- Configuración de redes de invitados.
- Selección de canal o banda WiFi.
