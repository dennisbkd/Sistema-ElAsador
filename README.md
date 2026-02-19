# 🍽️ Sistema El Asador

Sistema de gestión integral para restaurantes con soporte para punto de venta, gestión de inventario, ventas y administración.

## 🚀 Como Usar

### Modo Tradicional (Desarrollo Web)

```bash
# Terminal 1 - Backend
cd Backend
npm install
npm run start

# Terminal 2 - Frontend
cd Frontend
npm install
npm run dev
```

### Modo Desktop (Electron) 🆕

```bash
cd electron
# Windows:
setup.bat

# Linux/macOS:
chmod +x setup.sh && ./setup.sh

# Iniciar aplicación
npm run dev
```

**📖 Ver [electron/QUICKSTART.md](electron/QUICKSTART.md) para más detalles**

## 📁 Estructura del Proyecto

```
Sistema-ElAsador/
├── Backend/          # API REST + Socket.IO
│   ├── src/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── router/
│   │   ├── services/
│   │   └── config/
│   └── package.json
│
├── Frontend/         # React + Vite
│   ├── src/
│   │   ├── Admin/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── context/
│   └── package.json
│
└── electron/         # 🆕 Wrapper Desktop
    ├── main.js
    ├── preload.js
    └── utils/
```

## ✨ Características

- ✅ Gestión de ventas en tiempo real
- ✅ Control de inventario y stock
- ✅ Gestión de usuarios y roles
- ✅ Sistema de caja
- ✅ Reportes y estadísticas
- ✅ Socket.IO para actualizaciones en tiempo real
- ✅ Sistema de categorías y productos
- 🆕 **Aplicación de escritorio con Electron**
- 🆕 **Acceso móvil desde red local**

## 🌐 Acceso desde Dispositivos Móviles

Cuando ejecutas en modo Electron, la aplicación muestra la IP local:

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

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- Socket.IO
- Sequelize ORM
- MySQL / SQL Server
- JWT Authentication
- PDFKit (generación de tickets)

### Frontend
- React 18
- Vite
- React Router
- Axios
- Socket.IO Client
- TailwindCSS (o tu framework de estilos)

### Desktop (Nuevo)
- Electron 28
- electron-builder

## 📋 Requisitos

- Node.js v18+
- npm v9+
- MySQL o SQL Server
- (Opcional) Electron para modo desktop

## ⚙️ Configuración

### Backend

Crear archivo `.env` en `/Backend`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=elasador_db
JWT_SECRET=tu_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend

Crear archivo `.env` en `/Frontend`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 🔄 Ramas del Proyecto

- `main` - Versión para despliegue en nube (sin Electron)
- `desktop-electron` - Versión con integración Electron (actual)

## 📚 Documentación

### General
- [README.md](README.md) - Este archivo

### Electron (Modo Desktop)
- [electron/QUICKSTART.md](electron/QUICKSTART.md) - Inicio rápido
- [electron/README.md](electron/README.md) - Guía completa
- [electron/HOW_IT_WORKS.md](electron/HOW_IT_WORKS.md) - Explicación técnica
- [electron/BEST_PRACTICES.md](electron/BEST_PRACTICES.md) - Mejores prácticas
- [electron/TROUBLESHOOTING.md](electron/TROUBLESHOOTING.md) - Solución de problemas
- [electron/IMPLEMENTATION_SUMMARY.md](electron/IMPLEMENTATION_SUMMARY.md) - Resumen de implementación

## 🚀 Despliegue

### Desarrollo Local
```bash
# Sin Electron
cd Backend && npm run start
cd Frontend && npm run dev

# Con Electron
cd electron && npm run dev
```

### Producción Desktop
```bash
# Construir frontend
cd Frontend
npm run build

# Construir instalador
cd electron
npm run build  # o build:win, build:mac, build:linux
```

### Producción Nube
- Backend: Desplegar en Heroku, AWS, etc.
- Frontend: Desplegar en Vercel, Netlify, etc.
- Configurar variables de entorno de producción

## 🔐 Seguridad

- Autenticación JWT
- CORS configurado
- Roles y permisos de usuario
- Context isolation en Electron
- Variables de entorno para credentials

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para más detalles

## 👨‍💻 Autor

dennis

## 📞 Soporte

Para problemas o preguntas:
- Ver [TROUBLESHOOTING.md](electron/TROUBLESHOOTING.md)
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
