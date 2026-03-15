import { useVentaSocket } from '../Admin/venta-Mobile/hooks/useVentaSocket'
import { useProductoSocket } from '../Admin/gestion-items/producto/hooks/useProductoSocket'

export const useSocketMesero = ({ onStockActualizado } = {}) => {
  const ventaSocket = useVentaSocket()
  const productoSocket = useProductoSocket({ onStockActualizado })

  return {
    isConnected: ventaSocket.isConnected && productoSocket.isConnected
  }
}
