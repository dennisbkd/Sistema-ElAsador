#!/bin/bash

echo "🚀 Configurando Sistema El Asador - Modo Escritorio"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Instalar dependencias del Backend
echo "📦 Instalando dependencias del Backend..."
cd ../Backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del Backend"
    exit 1
fi
echo "✅ Backend configurado"
echo ""

# Instalar dependencias del Frontend
echo "📦 Instalando dependencias del Frontend..."
cd ../Frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del Frontend"
    exit 1
fi
echo "✅ Frontend configurado"
echo ""

# Instalar dependencias de Electron
echo "📦 Instalando dependencias de Electron..."
cd ../electron
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias de Electron"
    exit 1
fi
echo "✅ Electron configurado"
echo ""

echo "============================================"
echo "✨ Configuración completada exitosamente"
echo "============================================"
echo ""
echo "Para iniciar la aplicación:"
echo "  cd electron"
echo "  npm run dev"
echo ""
echo "Para construir para producción:"
echo "  npm run build"
echo ""
