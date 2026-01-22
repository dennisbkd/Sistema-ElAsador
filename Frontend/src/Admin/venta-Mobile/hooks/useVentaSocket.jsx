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

    const limpiarCrearVenta = escuchar('ventaCreada', (data) => {
      console.log('💰 Venta creada recibida:', data)
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    })

    const limpiarAgregarItemAventa = escuchar('productoAgregadoAVenta', (data) => {
      console.log('🛒 Producto agregado a venta recibido:', data)
      queryClient.invalidateQueries({ queryKey: ['productos'] })
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