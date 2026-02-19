const os = require('os')
const http = require('http')

console.log('🔍 DIAGNÓSTICO DE RED\n')
console.log('=' .repeat(60))

// 1. Obtener IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'No encontrada'
}

const localIP = getLocalIP()
console.log('\n📍 IP Local detectada:', localIP)

// 2. Verificar que los puertos estén disponibles
function checkPort(port, name) {
  return new Promise((resolve) => {
    const server = http.createServer()
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve({ port, name, status: '✅ EN USO (Correcto)', available: false })
      } else {
        resolve({ port, name, status: '❌ Error: ' + err.message, available: false })
      }
    })
    
    server.once('listening', () => {
      server.close()
      resolve({ port, name, status: '⚠️  DISPONIBLE (debería estar en uso)', available: true })
    })
    
    server.listen(port, '0.0.0.0')
  })
}

// 3. Verificar conectividad HTTP
function testBackend() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000`, (res) => {
      resolve({ 
        status: '✅ Respondiendo', 
        code: res.statusCode,
        working: true
      })
    })
    
    req.on('error', (err) => {
      resolve({ 
        status: '❌ No responde: ' + err.message,
        working: false
      })
    })
    
    req.setTimeout(2000, () => {
      req.destroy()
      resolve({ status: '❌ Timeout', working: false })
    })
  })
}

async function runDiagnostics() {
  try {
    // Verificar puertos
    console.log('\n🔌 Estado de puertos:')
    const backend = await checkPort(3000, 'Backend')
    const frontend = await checkPort(5173, 'Frontend')
    
    console.log(`   Puerto 3000 (Backend): ${backend.status}`)
    console.log(`   Puerto 5173 (Frontend): ${frontend.status}`)
    
    // Verificar backend
    console.log('\n🌐 Conectividad:')
    const backendTest = await testBackend()
    console.log(`   Backend HTTP: ${backendTest.status}`)
    
    if (backendTest.code) {
      console.log(`   Código HTTP: ${backendTest.code}`)
    }
    
    // URLs de acceso
    console.log('\n📱 URLs para acceso:')
    console.log(`   Desde PC: http://localhost:5173`)
    console.log(`   Desde móvil: http://${localIP}:5173`)
    console.log(`   Backend PC: http://localhost:3000`)
    console.log(`   Backend móvil: http://${localIP}:3000`)
    
    // Verificar variables de entorno
    console.log('\n⚙️  Variables de entorno:')
    console.log(`   ELECTRON_MODE: ${process.env.ELECTRON_MODE || 'NO DEFINIDA'}`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NO DEFINIDA'}`)
    
    // Resumen
    console.log('\n' + '='.repeat(60))
    if (!backend.available && !frontend.available && backendTest.working) {
      console.log('✅ TODO FUNCIONA CORRECTAMENTE')
      console.log('\n💡 Para acceder desde el móvil:')
      console.log(`   1. Conecta el móvil a la misma WiFi`)
      console.log(`   2. Abre el navegador`)
      console.log(`   3. Ve a: http://${localIP}:5173`)
    } else {
      console.log('⚠️  HAY PROBLEMAS:')
      if (backend.available) {
        console.log('   - El backend (puerto 3000) no está corriendo')
      }
      if (frontend.available) {
        console.log('   - El frontend (puerto 5173) no está corriendo')
      }
      if (!backendTest.working) {
        console.log('   - El backend no responde a peticiones HTTP')
      }
      console.log('\n💡 Solución: Ejecuta "npm run dev" desde /electron')
    }
    
  } catch (error) {
    console.error('\n❌ Error en diagnóstico:', error.message)
  }
}

// Ejecutar diagnóstico
console.log('Analizando configuración...\n')
setTimeout(runDiagnostics, 1000)
