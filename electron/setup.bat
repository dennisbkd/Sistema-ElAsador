@echo off
echo 🚀 Configurando Sistema El Asador - Modo Escritorio
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

for /f "delims=" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado
echo.

REM Instalar dependencias del Backend
echo 📦 Instalando dependencias del Backend...
cd ..\Backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias del Backend
    pause
    exit /b 1
)
echo ✅ Backend configurado
echo.

REM Instalar dependencias del Frontend
echo 📦 Instalando dependencias del Frontend...
cd ..\Frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias del Frontend
    pause
    exit /b 1
)
echo ✅ Frontend configurado
echo.

REM Instalar dependencias de Electron
echo 📦 Instalando dependencias de Electron...
cd ..\electron
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error instalando dependencias de Electron
    pause
    exit /b 1
)
echo ✅ Electron configurado
echo.

echo ============================================
echo ✨ Configuración completada exitosamente
echo ============================================
echo.
echo Para iniciar la aplicación:
echo   cd electron
echo   npm run dev
echo.
echo Para construir para producción:
echo   npm run build
echo.
pause
