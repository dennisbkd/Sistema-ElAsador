
import { useAgregarProductoAVenta, useCrearVenta, useVentaPorId, useVentaPorUsuario } from './useVentaMobileQuery'

export const useVentaMobileManager = ({ filtroEstado, ventaId }) => {
  const { pedidos, isLoading, isError } = useVentaPorUsuario({ filtroEstado })
  const { venta, isLoadingVenta, isErrorVenta } = useVentaPorId({ ventaId })
  const crearVentaMutation = useCrearVenta()
  const agregarProductoMutation = useAgregarProductoAVenta()

  const crearVenta = (pedido) => {
    crearVentaMutation.mutate({ pedido })
  }
  const agregarProductoAVenta = (ventaId, detalle) => {
    agregarProductoMutation.mutate({ ventaId, detalle })
  }

  return {
    pedidos,
    isLoadingPedidos: isLoading,
    isErrorPedidos: isError,
    crearVenta,
    agregarProductoAVenta,
    isPending: crearVentaMutation.isPending || agregarProductoMutation.isPending,
    venta,
    isLoadingVenta,
    isErrorVenta
  }
}
