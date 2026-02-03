import React from 'react'
import { useAgregarProductoPedidoAMutation, useAjustesQuery, useCambiarEstadoVenta, useImprimirComandaCocina, useImprimirVenta } from './useAjustesQuery'

export const useAjustesManager = ({ filtros }) => {
  const { anteriorPagina, pedidosQuery, siguientePagina, page } = useAjustesQuery({ filtros })
  const agregarProductoApedido = useAgregarProductoPedidoAMutation()
  const imprimirComandaCocinaMutation = useImprimirComandaCocina()
  const imprimirVentaMutation = useImprimirVenta()
  const cambiarEstadoMutation = useCambiarEstadoVenta()

  const agregarProducto = (ventaId, detalle) => {
    agregarProductoApedido.mutate({ ventaId, detalle })
  }

  const imprimirComandaCocina = (ventaId) => {
    imprimirComandaCocinaMutation.mutate(ventaId)
  }

  const imprimirVenta = (ventaId) => {
    imprimirVentaMutation.mutate(ventaId)
  }

  const cambiarEstadoVenta = (ventaId, nuevoEstado) => {
    cambiarEstadoMutation.mutate({ ventaId, nuevoEstado })
  }

  return {
    pedidos: pedidosQuery.data || [],
    cargando: pedidosQuery.isLoading,
    error: pedidosQuery.isError,
    page,
    isPending: agregarProductoApedido.isPending,
    isPendingImprimir: imprimirComandaCocinaMutation.isPending || imprimirVentaMutation.isPending,
    isPendingCambiarEstado: cambiarEstadoMutation.isPending,
    agregarProducto,
    imprimirComandaCocina,
    cambiarEstadoVenta,
    imprimirVenta,
    refetch: pedidosQuery.refetch,
    anteriorPagina,
    siguientePagina
  }
}
