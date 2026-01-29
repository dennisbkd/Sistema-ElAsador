import React from 'react'
import { useVentaSocket } from '../Admin/venta-Mobile/hooks/useVentaSocket'
import { useProductoSocket } from '../Admin/gestion-items/producto/hooks/useProductoSocket'

export const useSocketMesero = () => {
  const ventaSocket = useVentaSocket()
  const productoSocket = useProductoSocket()

  return {
    isConnected: ventaSocket.isConnected && productoSocket.isConnected
  }
}
