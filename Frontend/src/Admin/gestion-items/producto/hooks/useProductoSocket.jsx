import { useCallback, useEffect } from 'react'
import { useSocket } from '../../../../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'

export const useProductoSocket = ({ onStockActualizado } = {}) => {
  const { escuchar, isConnected } = useSocket()
  const queryClient = useQueryClient()

  const invalidarConsultasProducto = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['productos'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['busqueda-producto-nombre'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['producto-id'], exact: false })
  }, [queryClient])

  useEffect(() => {
    if (!isConnected) {
      return
    }

    invalidarConsultasProducto()

    const limpiarProductoActualizado = escuchar('productoActualizado', (data) => {
      console.log('📦 Producto actualizado recibido:', data)
      invalidarConsultasProducto()
    })

    const limpiarStockActualizado = escuchar('stock_actualizado', (data) => {
      invalidarConsultasProducto()
      if (typeof onStockActualizado === 'function') {
        onStockActualizado(data)
      }
    })

    return () => {
      limpiarProductoActualizado?.()
      limpiarStockActualizado?.()
    }
  }, [isConnected, escuchar, invalidarConsultasProducto, onStockActualizado])

  return {
    isConnected
  }
}
