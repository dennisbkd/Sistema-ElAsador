/* eslint-disable no-unused-vars */
/**
 * Valida si un string tiene formato de JWT válido
 * Un JWT válido debe tener 3 partes separadas por puntos: header.payload.signature
 */
export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') {
    return false
  }
  
  // Un JWT debe tener exactamente 3 partes separadas por puntos
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }
  
  // Cada parte debe ser base64url válido (no vacío)
  return parts.every(part => part.length > 0)
}

/**
 * Limpia el token y usuario del localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    // Disparar evento para desconectar socket
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-logout'))
    }
  } catch (error) {
    // Ignorar errores de localStorage
  }
}

/**
 * Obtiene y valida el token del localStorage
 * Retorna el token si es válido, null si no lo es
 * Limpia el localStorage si el token es inválido
 */
export const getValidToken = () => {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return null
    }
    
    if (!isValidJWT(token)) {
      // Token inválido, limpiar localStorage
      clearAuthData()
      return null
    }
    
    return token
  } catch (error) {
    return null
  }
}

/**
 * Obtiene y valida el usuario del localStorage
 * Retorna el usuario parseado si existe, null si no
 */
export const getValidUser = () => {
  try {
    const userStr = localStorage.getItem('usuario')
    if (!userStr) return null
    
    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    // Si falla el parseo, el dato está corrupto
    clearAuthData()
    return null
  }
}
