/* eslint-disable no-unused-vars */
// hooks/useVentaSocket.js - CORREGIDO
import { useCallback, useEffect } from 'react'
import { useSocket } from "../../../hooks/useSocket"
import { useQueryClient } from '@tanstack/react-query'

export const useVentaSocket = () => {
  const { escuchar, isConnected } = useSocket()
  const queryClient = useQueryClient()

  const invalidarConsultasProducto = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['productos'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['busqueda-producto-nombre'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['producto-id'], exact: false })
  }, [queryClient])

  // Al volver a la pestaña/pantalla, refrescar datos por si se perdieron
  // eventos mientras la pantalla estaba apagada (el socket puede seguir
  // "conectado" pero el navegador móvil pausa la recepción de mensajes)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        invalidarConsultasProducto()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [invalidarConsultasProducto])

  useEffect(() => {

    if (!isConnected) {
      return
    }

    // Al reconectarse también refrescar por si se perdieron eventos durante la desconexión
    invalidarConsultasProducto()

    const limpiarCrearVenta = escuchar('ventaCreada', (_data) => {
      invalidarConsultasProducto()
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    })

    const limpiarAgregarItemAventa = escuchar('productoAgregadoAVenta', (_data) => {
      invalidarConsultasProducto()
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    })

    return () => {
      limpiarCrearVenta?.()
      limpiarAgregarItemAventa?.()
    }
  }, [escuchar, queryClient, isConnected, invalidarConsultasProducto])

  return {
    isConnected,
  }
}