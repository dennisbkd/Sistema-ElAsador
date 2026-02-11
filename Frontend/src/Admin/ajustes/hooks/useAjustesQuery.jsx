import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { agregarProductoAPedidoMesero, anularProductosDeVenta, anularVenta, cambiarEstadoVenta, imprimirComandaCocina, imprimirVenta, obtenerTotalesDiarios, obtenerVentaPorId, obtenerVentasAdmin, obtenerVentasPorMesas } from '../api/ajustesAdminApi'
import toast from 'react-hot-toast'

export const useAjustesQuery = ({ filtros, pageUrl }) => {
  const page = pageUrl || 1

  const pedidosQuery = useQuery({
    queryKey: ['ajustes-admin', filtros?.filtroEstado, filtros?.tipoVenta, page],
    queryFn: () => obtenerVentasAdmin({ filtros, page }),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  return {
    pedidosQuery,
    page
  }
}

export const useAjusteVentaId = (ventaId) => {
  const ventaQuery = useQuery({
    queryKey: ['ajuste-venta-id', ventaId],
    queryFn: () => obtenerVentaPorId(ventaId),
    enabled: !!ventaId,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
  return {
    venta: ventaQuery.data,
    isLoading: ventaQuery.isLoading,
    isError: ventaQuery.isError
  }
}

export const useAnularProductoDeVenta = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ventaId, productoData }) => anularProductosDeVenta(ventaId, productoData),
    onSuccess: () => {
      toast.success('Producto anulado con éxito')
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
    onError: (error) => {
      toast.error(`Error al anular el producto: ${error.response?.data?.errorDetalle || error.message}`)
    }
  })
}

export const useAnularVenta = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ventaId) => anularVenta(ventaId),
    onSuccess: () => {
      toast.success('Venta anulada con éxito')
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
    onError: (error) => {
      toast.error(`Error al anular la venta: ${error.response?.data?.mensaje || error.message}`)
    }
  })
}

export const useAgregarProductoPedidoAMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ventaId, detalle }) => agregarProductoAPedidoMesero({ ventaId, detalle }),
    onSuccess: () => {
      toast.success('Producto agregado con éxito')
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['busqueda-producto-nombre'] })
    },
    onError: (error) => {
      toast.error(`Error al agregar el producto: ${error.response?.data?.mensaje || error.message}`)
    }
  })
}

export const useCambiarEstadoVenta = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ventaId, nuevoEstado }) => cambiarEstadoVenta(ventaId, nuevoEstado),
    onSuccess: () => {
      toast.success('Estado de la venta actualizado con éxito')
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    },
    onError: (error) => {
      toast.error(`Error al cambiar el estado: ${error.response?.data?.mensaje || error.message}`)
    }
  })
}

export const useImprimirComandaCocina = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ventaId) => imprimirComandaCocina(ventaId),
    onSuccess: () => {
      toast.success('Comanda de cocina impresa con éxito')
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
    },
    onError: (error) => {
      toast.error(`Error al imprimir la comanda: ${error.response?.data?.mensaje || error.message}`)
    }
  })
}

export const useImprimirVenta = () => {
  return useMutation({
    mutationFn: (ventaId) => imprimirVenta(ventaId),
    onSuccess: () => {
      toast.success('Venta impresa con éxito')
    },
    onError: (error) => {
      toast.error(`Error al imprimir la venta: ${error.response?.data?.mensaje || error.message}`)
    }
  })

}


export const useVentasPorMesas = ({ filtroMesaNombre }) => {
  const ventasPorMesasQuery = useQuery({
    queryKey: ['ventas-por-mesas', filtroMesaNombre],
    queryFn: () => obtenerVentasPorMesas({ filtroMesaNombre }),
    enabled: !!filtroMesaNombre
  })
  return {
    ventasPorMesas: ventasPorMesasQuery.data || [],
    isLoadingVentasPorMesas: ventasPorMesasQuery.isLoading,
    isErrorVentasPorMesas: ventasPorMesasQuery.isError
  }
}

export const useVentasTotalesDiarios = () => {
  const ventasTotalesDiariosQuery = useQuery({
    queryKey: ['totales-diarios'],
    queryFn: () => obtenerTotalesDiarios(),
    staleTime: 5 * 60 * 1000
  })
  return {
    totalesDiarios: ventasTotalesDiariosQuery.data || {},
    isLoadingTotalesDiarios: ventasTotalesDiariosQuery.isLoading,
    isErrorTotalesDiarios: ventasTotalesDiariosQuery.isError
  }
}