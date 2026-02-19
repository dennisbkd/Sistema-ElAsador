import os from 'node:os'

/**
 * Obtiene la dirección IP local de la máquina
 * @returns {string} Dirección IP local (ej: 192.168.1.10)
 */
export function obtenerIpLocal () {
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
 * Obtiene todas las direcciones IP de la máquina
 * @returns {Array<{nombre: string, direccion: string, interna: boolean}>}
 */
export function obtenerTodasLasInterfaces () {
  const interfaces = os.networkInterfaces()
  const direcciones = []

  for (const [nombre, ifaces] of Object.entries(interfaces)) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4') {
        direcciones.push({
          nombre,
          direccion: iface.address,
          interna: iface.internal
        })
      }
    }
  }

  return direcciones
}
