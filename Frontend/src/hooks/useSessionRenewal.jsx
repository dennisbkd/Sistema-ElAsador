import { useEffect, useRef } from 'react'
import { instancia } from '../config/axios'
import { getValidToken, debeRenovarToken } from '../utils/tokenUtils'

// Si al token le quedan menos de 2h de vida, se renueva de forma transparente
const UMBRAL_RENOVACION_SEGUNDOS = 2 * 60 * 60
// Además de al volver a la pestaña, se revisa cada 15 min mientras esté visible
const INTERVALO_CHEQUEO_MS = 15 * 60 * 1000

/**
 * Desliza la sesión del usuario mientras está activo: si el token todavía es
 * válido pero le queda poco tiempo, pide uno nuevo antes de que expire.
 * Así un mesero que sigue usando el sistema durante todo su turno no choca
 * con el límite de 24h del JWT ni con los reintentos/errores que eso dispara.
 *
 * Si la renovación falla (token ya vencido, sin red, etc.) simplemente no hace
 * nada: el flujo normal de 401 / verificación de expiración se encarga del logout.
 */
export const useSessionRenewal = () => {
  const renovandoRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const renovarSiHaceFalta = async () => {
      if (renovandoRef.current) return

      const token = getValidToken()
      if (!token || !debeRenovarToken(token, UMBRAL_RENOVACION_SEGUNDOS)) return

      renovandoRef.current = true
      try {
        const { data } = await instancia.post('/auth/renovar')
        if (data?.token) {
          localStorage.setItem('token', data.token)
          window.dispatchEvent(new Event('auth-token-updated'))
        }
      } catch {
        // Se ignora: si el token ya no sirve, el interceptor de 401 o la
        // verificación de expiración en getValidToken() harán el logout.
      } finally {
        renovandoRef.current = false
      }
    }

    renovarSiHaceFalta()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        renovarSiHaceFalta()
      }
    }

    const intervalo = setInterval(renovarSiHaceFalta, INTERVALO_CHEQUEO_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(intervalo)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
}
