const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

console.log('🔍 Verificación previa al inicio...\n')

const checks = {
  passed: [],
  warnings: [],
  errors: []
}

// Verificar Backend
const backendPath = path.join(__dirname, '..', 'Backend')
const backendEnv = path.join(backendPath, '.env')
const backendNodeModules = path.join(backendPath, 'node_modules')

console.log('📦 Backend:')
if (fs.existsSync(backendPath)) {
  console.log('   ✅ Carpeta Backend existe')
  checks.passed.push('Backend directory')
} else {
  console.log('   ❌ Carpeta Backend NO encontrada')
  checks.errors.push('Backend directory missing')
}

if (fs.existsSync(backendEnv)) {
  console.log('   ✅ Archivo .env existe')
  checks.passed.push('Backend .env')
} else {
  console.log('   ⚠️  Archivo .env NO encontrado - puede causar errores')
  checks.warnings.push('Backend .env missing')
}

if (fs.existsSync(backendNodeModules)) {
  console.log('   ✅ Dependencias instaladas')
  checks.passed.push('Backend dependencies')
} else {
  console.log('   ❌ Dependencias NO instaladas - ejecuta: cd Backend && npm install')
  checks.errors.push('Backend dependencies missing')
}

// Verificar Frontend
const frontendPath = path.join(__dirname, '..', 'Frontend')
const frontendNodeModules = path.join(frontendPath, 'node_modules')

console.log('\n📦 Frontend:')
if (fs.existsSync(frontendPath)) {
  console.log('   ✅ Carpeta Frontend existe')
  checks.passed.push('Frontend directory')
} else {
  console.log('   ❌ Carpeta Frontend NO encontrada')
  checks.errors.push('Frontend directory missing')
}

if (fs.existsSync(frontendNodeModules)) {
  console.log('   ✅ Dependencias instaladas')
  checks.passed.push('Frontend dependencies')
} else {
  console.log('   ❌ Dependencias NO instaladas - ejecuta: cd Frontend && npm install')
  checks.errors.push('Frontend dependencies missing')
}

// Verificar Electron
const electronNodeModules = path.join(__dirname, 'node_modules')

console.log('\n📦 Electron:')
if (fs.existsSync(electronNodeModules)) {
  console.log('   ✅ Dependencias instaladas')
  checks.passed.push('Electron dependencies')
} else {
  console.log('   ❌ Dependencias NO instaladas - ejecuta: npm install')
  checks.errors.push('Electron dependencies missing')
}

// Verificar puertos
console.log('\n🔌 Verificando puertos...')
const checkPort = (port) => {
  return new Promise((resolve) => {
    const net = require('net')
    const server = net.createServer()
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false)
      } else {
        resolve(true)
      }
    })
    
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    
    server.listen(port, '127.0.0.1')
  })
}

Promise.all([
  checkPort(3000),
  checkPort(5173)
]).then(([port3000, port5173]) => {
  if (port3000) {
    console.log('   ✅ Puerto 3000 disponible')
    checks.passed.push('Port 3000 available')
  } else {
    console.log('   ⚠️  Puerto 3000 en uso - puede causar conflictos')
    checks.warnings.push('Port 3000 in use')
  }
  
  if (port5173) {
    console.log('   ✅ Puerto 5173 disponible')
    checks.passed.push('Port 5173 available')
  } else {
    console.log('   ⚠️  Puerto 5173 en uso - puede causar conflictos')
    checks.warnings.push('Port 5173 in use')
  }
  
  // Resumen
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN:')
  console.log('='.repeat(60))
  console.log(`✅ Verificaciones exitosas: ${checks.passed.length}`)
  console.log(`⚠️  Advertencias: ${checks.warnings.length}`)
  console.log(`❌ Errores: ${checks.errors.length}`)
  
  if (checks.errors.length > 0) {
    console.log('\n❌ ERRORES que deben corregirse:')
    checks.errors.forEach(err => console.log(`   - ${err}`))
    console.log('\n💡 Ejecuta setup.bat (Windows) o setup.sh (Linux/Mac) para corregir')
    process.exit(1)
  } else if (checks.warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:')
    checks.warnings.forEach(warn => console.log(`   - ${warn}`))
    console.log('\n✨ Puedes continuar, pero es recomendable revisar las advertencias')
    process.exit(0)
  } else {
    console.log('\n✨ Todo está listo para iniciar la aplicación!')
    process.exit(0)
  }
})
