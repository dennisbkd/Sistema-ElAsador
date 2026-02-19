# 🚀 Inicio Rápido - Sistema El Asador Desktop

## Instalación en 3 Pasos

### 1️⃣ Ejecutar Script de Configuración

**Windows:**
```cmd
cd electron
setup.bat
```

**Linux/macOS:**
```bash
cd electron
chmod +x setup.sh
./setup.sh
```

### 2️⃣ Iniciar Aplicación

```bash
npm run dev
```

### 3️⃣ Conectar Móviles

1. Observa la IP mostrada en consola (ej: `192.168.1.X`)
2. En el móvil, abre el navegador
3. Navega a: `http://192.168.1.X:5173`

## ⚡ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción (construir instalador)
npm run build        # Según tu sistema operativo
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🆘 Problemas Comunes

### Error: "Puerto ocupado"
```bash
# Cerrar procesos en puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Móviles no conectan
1. Verifica que estén en la misma WiFi
2. Desactiva temporalmente el firewall
3. Usa la IP correcta (la que muestra la consola)

### Ver documentación completa
- [README.md](README.md) - Guía detallada
- [BEST_PRACTICES.md](BEST_PRACTICES.md) - Mejores prácticas

---

¿Necesitas ayuda? Revisa los archivos de documentación o contacta al equipo de desarrollo.
