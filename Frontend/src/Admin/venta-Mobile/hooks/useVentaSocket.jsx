/* eslint-disable no-unused-vars */
// hooks/useVentaSocket.js - CORREGIDO
import { useEffect } from 'react'
import { useSocket } from "../../../hooks/useSocket"
import { useQueryClient } from '@tanstack/react-query'

export const useVentaSocket = () => {
  const { escuchar, isConnected } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {

    if (!isConnected) {
      return
    }

    const limpiarCrearVenta = escuchar('ventaCreada', (_data) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    })

    const limpiarAgregarItemAventa = escuchar('productoAgregadoAVenta', (_data) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    })

    return () => {
      limpiarCrearVenta?.()
      limpiarAgregarItemAventa?.()
    }
  }, [escuchar, queryClient, isConnected])

  return {
    isConnected,
  }
}