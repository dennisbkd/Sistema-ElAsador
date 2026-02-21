const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const QRCode = require('qrcode')
const { getLocalIpAddress, waitForServer } = require('./utils/network')

let mainWindow = null
let qrWindow = null
let backendProcess = null
let frontendProcess = null

const BACKEND_PORT = 3000
const FRONTEND_PORT = 5173
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`
const FRONTEND_URL = `http://127.0.0.1:${FRONTEND_PORT}`

function isServerAlive(url, timeout = 1500) {
  return new Promise((resolve) => {
    const http = require('http')
    const req = http.get(url, (res) => {
      res.resume()
      resolve(true)
    })

    req.on('error', () => resolve(false))
    req.setTimeout(timeout, () => {
      req.destroy()
      resolve(false)
    })
  })
}

function killProcessTree(proc, label) {
  if (!proc || proc.killed || !proc.pid) {
    return
  }

  if (process.platform === 'win32') {
    // Ensure Windows kills the full process tree (npm -> node -> vite)
    spawn('taskkill', ['/pid', String(proc.pid), '/T', '/F'], { shell: true })
    return
  }

  proc.kill('SIGTERM')

  setTimeout(() => {
    if (!proc.killed) {
      proc.kill('SIGKILL')
    }
  }, 5000)
}

function buildMenu() {
  const menuTemplate = [
    {
      label: 'El Asador',
      submenu: [
        {
          label: 'QR Movil',
          click: () => {
            showQrWindow().catch((error) => {
              console.error('❌ Error al generar QR:', error)
            })
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'togglefullscreen' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

async function showQrWindow() {
  const localIp = getLocalIpAddress()
  const mobileUrl = `http://${localIp}:${FRONTEND_PORT}`
  const qrDataUrl = await QRCode.toDataURL(mobileUrl, { margin: 1, width: 240 })

  if (qrWindow) {
    qrWindow.close()
  }

  qrWindow = new BrowserWindow({
    width: 360,
    height: 420,
    resizable: false,
    minimizable: false,
    maximizable: false,
    parent: mainWindow || undefined,
    modal: !!mainWindow,
    title: 'QR Movil',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const qrHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>QR Movil</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #f6f5f2; }
      .wrap { height: 100vh; display: flex; align-items: center; justify-content: center; }
      .card { background: #fff; padding: 16px 18px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); text-align: center; }
      h2 { margin: 0 0 10px; font-size: 18px; }
      img { width: 240px; height: 240px; }
      .url { margin-top: 8px; font-size: 12px; color: #333; word-break: break-all; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h2>Acceso Movil</h2>
        <img src="${qrDataUrl}" alt="QR" />
        <div class="url">${mobileUrl}</div>
      </div>
    </div>
  </body>
</html>`

  qrWindow.on('closed', () => {
    qrWindow = null
  })

  await qrWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(qrHtml)}`)
}

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
  console.log('🎨 Iniciando servidor frontend...')

  const frontendPath = path.join(__dirname, '..', 'Frontend')
  const isWindows = process.platform === 'win32'

  console.log(`📁 Frontend path: ${frontendPath}`)

  if (await isServerAlive(FRONTEND_URL)) {
    console.log('✅ Frontend ya está activo, reutilizando servidor existente')
    return
  }

  return new Promise((resolve, reject) => {
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
        if (!hasResolved && error.includes('Port 5173 is already in use')) {
          waitForServer(FRONTEND_URL, 5000)
            .then(() => {
              hasResolved = true
              console.log('✅ Frontend ya estaba activo, continuando')
              resolve()
            })
            .catch(() => {
              hasResolved = true
              reject(new Error(`Frontend error: ${error}`))
            })
          return
        }

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
    buildMenu()
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
    killProcessTree(backendProcess, 'backend')
  }

  if (frontendProcess && !frontendProcess.killed) {
    console.log('🛑 Deteniendo frontend...')
    killProcessTree(frontendProcess, 'frontend')
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
