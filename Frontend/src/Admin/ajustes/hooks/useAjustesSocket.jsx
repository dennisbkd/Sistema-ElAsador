import React, { useEffect } from 'react'
import { useSocket } from '../../../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'

export const useAjustesSocket = () => {
  const { escuchar, isConnected } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isConnected) return


    const limpiarPedidoAjustado = escuchar('estado_venta_cambiado', (data) => {
      queryClient.invalidateQueries({ queryKey: ['venta-mobile-del-dia'] })
      queryClient.invalidateQueries({ queryKey: ['venta-mobile-id', data.ventaId] })
    })
    return () => {
      limpiarPedidoAjustado?.()
    }
  }, [isConnected, escuchar, queryClient])
}
