const os = require('os')
const http = require('http')

/**
 * Obtiene la dirección IP local de la máquina
 * @returns {string} Dirección IP local (ej: 192.168.1.10)
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces()
  
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      // Ignorar direcciones internas (127.0.0.1) y no-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  
  return 'localhost'
}

/**
 * Espera a que un servidor esté disponible
 * @param {string} url - URL del servidor a verificar
 * @param {number} timeout - Tiempo máximo de espera en milisegundos
 * @param {number} interval - Intervalo entre intentos en milisegundos
 * @returns {Promise<void>}
 */
function waitForServer(url, timeout = 30000, interval = 500) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    let attempts = 0
    
    const check = () => {
      attempts++
      const elapsed = Date.now() - startTime
      
      // Mostrar progreso cada 5 segundos
      if (attempts % 10 === 0) {
        console.log(`   ⏳ Esperando servidor... (${Math.floor(elapsed / 1000)}s transcurridos)`)
      }
      
      http.get(url, (res) => {
        if (res.statusCode) {
          console.log(`   ✓ Servidor respondió con código ${res.statusCode}`)
          resolve()
        } else {
          retry()
        }
      }).on('error', (err) => {
        // Solo mostrar errores específicos, no todos
        if (attempts === 1) {
          console.log(`   ⌛ Conectando al servidor...`)
        }
        retry()
      })
    }
    
    const retry = () => {
      const elapsed = Date.now() - startTime
      if (elapsed >= timeout) {
        console.error(`   ❌ Timeout después de ${Math.floor(elapsed / 1000)} segundos`)
        console.error(`   URL intentada: ${url}`)
        console.error(`   Intentos realizados: ${attempts}`)
        reject(new Error(`Timeout esperando servidor en ${url} después de ${attempts} intentos`))
      } else {
        setTimeout(check, interval)
      }
    }
    
    check()
  })
}

/**
 * Obtiene todas las direcciones IP de la máquina
 * @returns {Array<{name: string, address: string, internal: boolean}>}
 */
function getAllNetworkInterfaces() {
  const interfaces = os.networkInterfaces()
  const addresses = []
  
  for (const [name, ifaces] of Object.entries(interfaces)) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4') {
        addresses.push({
          name,
          address: iface.address,
          internal: iface.internal
        })
      }
    }
  }
  
  return addresses
}

module.exports = {
  getLocalIpAddress,
  waitForServer,
  getAllNetworkInterfaces
}

module.exports = {
  getLocalIpAddress,
  waitForServer,
  getAllNetworkInterfaces
}
