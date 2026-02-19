const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const { getLocalIpAddress, waitForServer } = require('./utils/network')

let mainWindow = null
let backendProcess = null
let frontendProcess = null

const BACKEND_PORT = 3000
const FRONTEND_PORT = 5173
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`
const FRONTEND_URL = `http://127.0.0.1:${FRONTEND_PORT}`

// Función para crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  })

  mainWindow.loadURL(FRONTEND_URL)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Iniciar el backend
async function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor backend...')

    const backendPath = path.join(__dirname, '..', 'Backend')
    const isWindows = process.platform === 'win32'

    console.log(`📁 Backend path: ${backendPath}`)

    // Usar node directamente sin npm para evitar problemas de buffering
    backendProcess = spawn(
      'node',
      ['src/server.js'],
      {
        cwd: backendPath,
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'development',
          ELECTRON_MODE: 'true'
        }
      }
    )

    let hasResolved = false
    let backendOutput = []

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString()
      backendOutput.push(output)
      console.log(`[BACKEND] ${output.trim()}`)

      if (!hasResolved && output.includes('Servidor activo')) {
        hasResolved = true
        console.log('✅ Backend proceso iniciado, verificando disponibilidad...')
        setTimeout(() => resolve(), 1000)
      }
    })

    backendProcess.stderr.on('data', (data) => {
      const error = data.toString()
      console.error(`[BACKEND ERROR] ${error.trim()}`)
      
      if (error.includes('EADDRINUSE') || 
          error.includes('ECONNREFUSED') || 
          error.includes('Cannot find module')) {
        if (!hasResolved) {
          hasResolved = true
          reject(new Error(`Backend error: ${error}`))
        }
      }
    })

    backendProcess.on('error', (error) => {
      console.error('❌ Error al iniciar backend:', error)
      if (!hasResolved) {
        hasResolved = true
        reject(error)
      }
    })

    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`❌ Backend se cerró con código: ${code}`)
        console.error('📋 Output del backend:')
        backendOutput.forEach(line => console.error(line))
        
        if (!hasResolved) {
          hasResolved = true
          reject(new Error(`Backend se cerró inesperadamente con código ${code}`))
        }
      }
    })

    setTimeout(() => {
      if (!hasResolved) {
        console.log('⚠️  Backend no mostró mensaje de inicio, verificando con waitForServer...')
        hasResolved = true
        resolve()
      }
    }, 10000)
  })
}

// Iniciar el frontend (Vite)
async function startFrontend() {
  return new Promise((resolve, reject) => {
    console.log('🎨 Iniciando servidor frontend...')

    const frontendPath = path.join(__dirname, '..', 'Frontend')
    const isWindows = process.platform === 'win32'

    console.log(`📁 Frontend path: ${frontendPath}`)

    frontendProcess = spawn(
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      {
        cwd: frontendPath,
        shell: true,
        env: {
          ...process.env,
          ELECTRON_MODE: 'true'
        }
      }
    )

    let hasResolved = false
    let frontendOutput = []

    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString()
      frontendOutput.push(output)
      console.log(`[FRONTEND] ${output.trim()}`)

      if (!hasResolved && (output.includes('Local:') || output.includes('ready in'))) {
        hasResolved = true
        console.log('✅ Frontend proceso iniciado, verificando disponibilidad...')
        setTimeout(() => resolve(), 1000)
      }
    })

    frontendProcess.stderr.on('data', (data) => {
      const error = data.toString()
      console.log(`[FRONTEND] ${error.trim()}`)
      
      if (error.includes('EADDRINUSE') || error.includes('Error:')) {
        if (!hasResolved && error.includes('Error:')) {
          hasResolved = true
          reject(new Error(`Frontend error: ${error}`))
        }
      }
    })

    frontendProcess.on('error', (error) => {
      console.error('❌ Error al iniciar frontend:', error)
      if (!hasResolved) {
        hasResolved = true
        reject(error)
      }
    })

    frontendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`❌ Frontend se cerró con código: ${code}`)
        console.error('📋 Output del frontend:')
        frontendOutput.forEach(line => console.error(line))
        
        if (!hasResolved) {
          hasResolved = true
          reject(new Error(`Frontend se cerró inesperadamente con código ${code}`))
        }
      }
    })

    setTimeout(() => {
      if (!hasResolved) {
        console.log('⚠️  Frontend no mostró mensaje de inicio, verificando con waitForServer...')
        hasResolved = true
        resolve()
      }
    }, 15000)
  })
}

// Mostrar información de red
function displayNetworkInfo() {
  const localIp = getLocalIpAddress()
  
  console.log('\n' + '='.repeat(60))
  console.log('🍽️  SISTEMA EL ASADOR - MODO ESCRITORIO')
  console.log('='.repeat(60))
  console.log(`\n📍 Acceso desde esta computadora:`)
  console.log(`   ${FRONTEND_URL}`)
  console.log(`\n📱 Acceso desde dispositivos móviles en la red:`)
  console.log(`   http://${localIp}:${FRONTEND_PORT}`)
  console.log(`\n🔧 API Backend:`)
  console.log(`   http://${localIp}:${BACKEND_PORT}`)
  console.log('\n' + '='.repeat(60) + '\n')
}

// Función principal de inicialización
async function initialize() {
  try {
    console.log('\n' + '='.repeat(60))
    console.log('🍽️  INICIANDO SISTEMA EL ASADOR')
    console.log('='.repeat(60) + '\n')

    console.log('📦 Paso 1/4: Iniciando Backend...')
    await startBackend()
    console.log('✅ Backend listo y disponible')

    console.log('\n📦 Paso 2/4: Iniciando Frontend...')
    await startFrontend()
    console.log('✅ Frontend listo y disponible')

    console.log('\n📦 Paso 3/4: Configurando red...')
    displayNetworkInfo()

    console.log('📦 Paso 4/4: Abriendo ventana de aplicación...')
    createWindow()
    console.log('✅ Aplicación iniciada correctamente\n')

  } catch (error) {
    console.error('\n' + '='.repeat(60))
    console.error(`❌ Error durante la inicialización: ${error.message}`)
    console.error('='.repeat(60))
    console.error('\n💡 Sugerencias:')
    console.error('   - Verifica que MySQL/SQL Server esté corriendo')
    console.error('   - Revisa el archivo Backend/.env')
    console.error('   - Asegúrate que los puertos 3000 y 5173 estén libres')
    console.error('   - Ejecuta: npm run pre-check para verificar configuración\n')
    
    cleanup()
    
    setTimeout(() => {
      app.quit()
    }, 2000)
  }
}

// Limpiar procesos al cerrar
function cleanup() {
  console.log('🧹 Cerrando aplicación...')

  if (backendProcess && !backendProcess.killed) {
    console.log('🛑 Deteniendo backend...')
    backendProcess.kill('SIGTERM')
    
    setTimeout(() => {
      if (!backendProcess.killed) {
        backendProcess.kill('SIGKILL')
      }
    }, 5000)
  }

  if (frontendProcess && !frontendProcess.killed) {
    console.log('🛑 Deteniendo frontend...')
    frontendProcess.kill('SIGTERM')
    
    setTimeout(() => {
      if (!frontendProcess.killed) {
        frontendProcess.kill('SIGKILL')
      }
    }, 5000)
  }
}

// Eventos de Electron
app.whenReady().then(initialize)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    cleanup()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', cleanup)

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason)
})
