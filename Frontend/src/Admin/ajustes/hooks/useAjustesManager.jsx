import React from 'react'
import { useAgregarProductoPedidoAMutation, useAjustesQuery, useCambiarEstadoVenta, useImprimirComandaCocina, useImprimirVenta, useVentasPorMesas, useVentasTotalesDiarios } from './useAjustesQuery'

export const useAjustesManager = ({ filtros, filtroMesaNombre, pageUrl }) => {
  const { anteriorPagina, pedidosQuery, siguientePagina, page } = useAjustesQuery({ filtros, pageUrl })
  const { ventasPorMesas, isErrorVentasPorMesas, isLoadingVentasPorMesas } = useVentasPorMesas({ filtroMesaNombre })
  const { isErrorTotalesDiarios, isLoadingTotalesDiarios, totalesDiarios } = useVentasTotalesDiarios()
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
    ventasEncontradas: ventasPorMesas || [],
    cargando: pedidosQuery.isLoading,
    isLoadingVentasPorMesas,
    error: pedidosQuery.isError || isErrorVentasPorMesas,
    page,
    isPending: agregarProductoApedido.isPending,
    isPendingImprimir: imprimirComandaCocinaMutation.isPending || imprimirVentaMutation.isPending,
    isPendingCambiarEstado: cambiarEstadoMutation.isPending,
    isLoadingTotalesDiarios,
    isErrorTotalesDiarios,
    totalesDiarios,
    agregarProducto,
    imprimirComandaCocina,
    cambiarEstadoVenta,
    imprimirVenta,
    refetch: pedidosQuery.refetch,
    anteriorPagina,
    siguientePagina
  }
}
