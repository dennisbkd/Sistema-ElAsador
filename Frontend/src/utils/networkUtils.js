/**
 * Obtiene la URL del backend automáticamente basándose en cómo se accede al frontend
 * - Si se accede vía localhost/127.0.0.1 → usa localhost:3000
 * - Si se accede vía IP de red → usa esa misma IP:3000
 */
export const getBackendUrl = () => {
  // Verificar que window y window.location estén disponibles
  if (typeof window === 'undefined' || !window.location) {
    return 'http://localhost:3000' // Fallback seguro
  }

  try {
    // Detectar automáticamente basado en window.location
    const hostname = window.location.hostname
    
    // Si estamos en localhost o 127.0.0.1, usar localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000'
    }
    
    // Si estamos en una IP de red, usar esa misma IP
    // Esto cubre: 192.168.x.x, 10.x.x.x, 172.16-31.x.x
    return `http://${hostname}:3000`
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // En caso de error, usar localhost como fallback
    return 'http://localhost:3000'
  }
}

/**
 * Obtiene la URL del socket (igual que el backend)
 */
export const getSocketUrl = () => {
  // Usar la misma lógica que el backend
  return getBackendUrl()
}

