/* eslint-disable no-unused-vars */
import { jwtDecode } from 'jwt-decode'

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
 * Revisa el claim `exp` del JWT (sin verificar firma) para saber si ya venció.
 * Se usa solo para reaccionar rápido en el cliente (p. ej. al volver del background);
 * la verificación real de firma/expiración siempre la hace el backend.
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    if (!decoded?.exp) return false
    return decoded.exp < Date.now() / 1000
  } catch (error) {
    return true
  }
}

/**
 * Indica si conviene renovar el token: todavía es válido, pero le queda menos
 * del umbral indicado de vida (por defecto 2h). Se usa para deslizar la sesión
 * mientras el usuario sigue activo, sin esperar a que el token expire.
 */
export const debeRenovarToken = (token, umbralSegundos = 2 * 60 * 60) => {
  try {
    const decoded = jwtDecode(token)
    if (!decoded?.exp) return false
    const segundosRestantes = decoded.exp - Date.now() / 1000
    return segundosRestantes > 0 && segundosRestantes < umbralSegundos
  } catch (error) {
    return false
  }
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
    
    if (!isValidJWT(token) || isTokenExpired(token)) {
      // Token inválido o vencido, limpiar localStorage
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
