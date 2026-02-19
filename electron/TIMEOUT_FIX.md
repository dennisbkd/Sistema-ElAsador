# ⚠️ Solución: Error de Timeout al Iniciar

## Problema

Cuando ejecutas `npm run dev`, aparece este error:

```
❌ Error durante la inicialización: Error: Timeout esperando servidor en http://localhost:3000
🧹 Cerrando aplicación...
🛑 Deteniendo backend...
```

## Causas Comunes y Soluciones

### 1. 🔴 Archivo .env NO configurado (MÁS COMÚN)

El backend necesita conectarse a una base de datos, pero no encuentra la configuración.

**Solución:**

```bash
# 1. Ir a la carpeta Backend
cd Backend

# 2. Copiar el ejemplo
copy .env.example .env    # Windows
# o
cp .env.example .env      # Linux/Mac

# 3. Editar el archivo .env con tus credenciales
```

**Configuración mínima requerida en Backend/.env:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=elasador_db
JWT_SECRET=cualquier_texto_secreto_123
FRONTEND_URL=http://localhost:5173
```

### 2. 🔴 Base de datos NO está corriendo

**Verificar MySQL:**

Windows:
```cmd
# Abrir Servicios (services.msc)
# Buscar "MySQL" y verificar que esté "Ejecutando"
```

Linux/Mac:
```bash
sudo systemctl status mysql
# o
brew services list | grep mysql
```

**Iniciar MySQL si está detenido:**

Windows: Servicios → MySQL → Iniciar

Linux:
```bash
sudo systemctl start mysql
```

Mac:
```bash
brew services start mysql
```

### 3. 🔴 Base de datos NO existe

**Crear la base de datos:**

```sql
-- Conectar a MySQL
mysql -u root -p

-- Crear base de datos
CREATE DATABASE elasador_db;

-- Verificar
SHOW DATABASES;

-- Salir
exit;
```

### 4. 🔴 Credenciales incorrectas

Verifica en `Backend/.env`:
- `DB_USER` debe ser un usuario válido de MySQL
- `DB_PASSWORD` debe ser la contraseña correcta
- `DB_NAME` debe existir en tu servidor

**Probar conexión:**

```bash
mysql -u root -p -h localhost
# Ingresa tu password
# Si NO puedes conectar, las credenciales están mal
```

### 5. 🔴 Puerto 3000 ya está en uso

**Verificar y liberar:**

Windows:
```cmd
netstat -ano | findstr :3000
taskkill /PID <numero_pid> /F
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill
```

### 6. 🟡 Dependencias no instaladas

**Instalar todo:**

```bash
# Opción 1: Usar script de setup
cd electron
setup.bat    # Windows
./setup.sh   # Linux/Mac

# Opción 2: Manual
cd Backend && npm install
cd ../Frontend && npm install
cd ../electron && npm install
```

## 🔍 Diagnóstico Paso a Paso

### Paso 1: Verificar configuración

```bash
cd electron
npm run pre-check
```

Esto te dirá exactamente qué falta.

### Paso 2: Probar Backend manualmente

```bash
cd Backend
npm run start
```

**Si funciona:** El problema está en Electron, no en el Backend
**Si NO funciona:** Lee el error y corrígelo primero

Errores comunes:
- `ECONNREFUSED`: Base de datos no está corriendo
- `ER_ACCESS_DENIED`: Usuario/password incorrectos
- `ER_BAD_DB_ERROR`: Base de datos no existe
- `Cannot find module`: Falta npm install

### Paso 3: Verificar Frontend

```bash
cd Frontend
npm run dev
```

Debe mostrar:
```
VITE v7.x.x  ready in XXXms
➜  Local:   http://localhost:5173/
```

### Paso 4: Intentar Electron nuevamente

```bash
cd electron
npm run dev
```

## 📋 Checklist Completo

Antes de ejecutar `npm run dev`, verifica:

- [ ] MySQL/SQL Server está **corriendo**
- [ ] Archivo `Backend/.env` **existe y está configurado**
- [ ] Base de datos **existe** en MySQL
- [ ] Puedes **conectarte manualmente** a MySQL con esas credenciales
- [ ] Puerto 3000 está **libre** (no usado por otro proceso)
- [ ] Puerto 5173 está **libre**
- [ ] `Backend/node_modules` **existe** (npm install)
- [ ] `Frontend/node_modules` **existe** (npm install)
- [ ] `electron/node_modules` **existe** (npm install)

## 🚀 Inicio Correcto Esperado

Cuando todo está bien configurado, deberías ver:

```
🍽️  INICIANDO SISTEMA EL ASADOR
============================================================

📦 Paso 1/4: Iniciando Backend...
🚀 Iniciando servidor backend...
[BACKEND] Servidor activo en el puerto: 3000
✅ Backend proceso iniciado, verificando disponibilidad...
🔍 Verificando disponibilidad del Backend...
   ⌛ Conectando al servidor...
   ✓ Servidor respondió con código 200
✅ Backend listo y disponible

📦 Paso 2/4: Iniciando Frontend...
🎨 Iniciando servidor frontend...
[FRONTEND] VITE v7.x.x  ready in XXXms
✅ Frontend proceso iniciado, verificando disponibilidad...
🔍 Verificando disponibilidad del Frontend...
   ✓ Servidor respondió con código 200
✅ Frontend listo y disponible

📦 Paso 3/4: Configurando red...

============================================================
🍽️  SISTEMA EL ASADOR - MODO ESCRITORIO
============================================================

📍 Acceso desde esta computadora:
   http://localhost:5173

📱 Acceso desde dispositivos móviles en la red:
   http://192.168.X.X:5173
   
============================================================

📦 Paso 4/4: Abriendo ventana de aplicación...
✅ Aplicación iniciada correctamente
```

## 🆘 Si Nada Funciona

1. **Revisar logs del Backend:**
```bash
cd Backend
npm run start > backend.log 2>&1
# Revisar backend.log
```

2. **Ejecutar sin Electron (modo tradicional):**
```bash
# Terminal 1
cd Backend
npm run start

# Terminal 2
cd Frontend
npm run dev

# Navegar manualmente a http://localhost:5173
```

Si funciona sin Electron pero no con Electron, reporta el problema con:
- Versión de Node: `node --version`
- Versión de npm: `npm --version`
- Sistema operativo
- Contenido de `backend.log`

## 📝 Ejemplo de .env Funcional

```env
# Configuración que SÍ funciona (ejemplo real)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mipassword123
DB_NAME=elasador_db
DB_DIALECT=mysql

JWT_SECRET=mi_secreto_super_seguro_123456

FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

**Importante:** 
- NO uses comillas en los valores
- NO dejes espacios alrededor del `=`
- Cambia los valores según tu configuración real

---

**¿Solucionó tu problema?** Si no, por favor proporciona:
1. Contenido de `Backend/.env` (sin passwords)
2. Error exacto del Backend cuando se ejecuta manualmente
3. Resultado de `npm run pre-check`
