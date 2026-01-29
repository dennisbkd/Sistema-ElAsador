import React, { useEffect } from 'react'
import { useSocket } from '../../../../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'

export const useProductoSocket = () => {
  const { escuchar, isConnected } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isConnected) {
      return
    }

    const limpiarProductoActualizado = escuchar('productoActualizado', (data) => {
      console.log('📦 Producto actualizado recibido:', data)
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    })

    return () => {
      limpiarProductoActualizado?.()
    }

  }, [isConnected, escuchar, queryClient])

  return {
    isConnected,
  }
}
