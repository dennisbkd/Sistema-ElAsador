const fs = require('fs')
const path = require('path')

const checks = {
  success: [],
  warnings: [],
  errors: []
}

function log(type, message) {
  const prefix = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  console.log(`${prefix[type]} ${message}`)
  checks[type + 's'].push(message)
}

function checkDirectory(dirPath, name) {
  const fullPath = path.join(__dirname, '..', dirPath)
  if (fs.existsSync(fullPath)) {
    log('success', `Directorio ${name} encontrado`)
    return true
  } else {
    log('error', `Directorio ${name} NO encontrado: ${dirPath}`)
    return false
  }
}

function checkFile(filePath, name) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (fs.existsSync(fullPath)) {
    log('success', `Archivo ${name} encontrado`)
    return true
  } else {
    log('error', `Archivo ${name} NO encontrado: ${filePath}`)
    return false
  }
}

function checkNodeModules(dirPath, name) {
  const fullPath = path.join(__dirname, '..', dirPath, 'node_modules')
  if (fs.existsSync(fullPath)) {
    log('success', `Dependencias de ${name} instaladas`)
    return true
  } else {
    log('warning', `Dependencias de ${name} NO instaladas - ejecuta: cd ${dirPath} && npm install`)
    return false
  }
}

function checkPort(port, name) {
  return new Promise((resolve) => {
    const net = require('net')
    const server = net.createServer()
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        log('error', `Puerto ${port} (${name}) ya está en uso`)
        resolve(false)
      } else {
        resolve(true)
      }
    })
    
    server.once('listening', () => {
      server.close()
      log('success', `Puerto ${port} (${name}) está disponible`)
      resolve(true)
    })
    
    server.listen(port, '127.0.0.1')
  })
}

async function runChecks() {
  console.log('\n🔍 Verificando configuración del sistema...\n')
  
  console.log('📁 Estructura de directorios:')
  checkDirectory('Backend', 'Backend')
  checkDirectory('Frontend', 'Frontend')
  checkDirectory('electron', 'Electron')
  
  console.log('\n📄 Archivos principales:')
  checkFile('Backend/package.json', 'Backend package.json')
  checkFile('Backend/src/main.js', 'Backend main.js')
  checkFile('Backend/src/server.js', 'Backend server.js')
  checkFile('Frontend/package.json', 'Frontend package.json')
  checkFile('Frontend/src/main.jsx', 'Frontend main.jsx')
  checkFile('electron/main.js', 'Electron main.js')
  checkFile('electron/package.json', 'Electron package.json')
  
  console.log('\n📦 Dependencias:')
  checkNodeModules('Backend', 'Backend')
  checkNodeModules('Frontend', 'Frontend')
  checkNodeModules('electron', 'Electron')
  
  console.log('\n🔌 Puertos:')
  await checkPort(3000, 'Backend')
  await checkPort(5173, 'Frontend')
  
  console.log('\n📊 Resumen:')
  console.log(`✅ Éxitos: ${checks.success.length}`)
  console.log(`⚠️  Advertencias: ${checks.warnings.length}`)
  console.log(`❌ Errores: ${checks.errors.length}`)
  
  if (checks.errors.length === 0 && checks.warnings.length === 0) {
    console.log('\n🎉 ¡Todo está configurado correctamente!')
    console.log('   Puedes ejecutar: npm run dev')
  } else if (checks.errors.length === 0) {
    console.log('\n⚠️  Hay advertencias. Considera instalar dependencias faltantes.')
    console.log('   Ejecuta: npm run setup o instala manualmente.')
  } else {
    console.log('\n❌ Hay errores que deben corregirse antes de continuar.')
    console.log('   Revisa los mensajes arriba.')
    process.exit(1)
  }
  
  console.log('')
}

// Ejecutar
runChecks().catch(err => {
  console.error('❌ Error durante verificación:', err)
  process.exit(1)
})
