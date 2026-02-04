import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { agregarProductoAPedidoMesero, anularProductosDeVenta, anularVenta, cambiarEstadoVenta, imprimirComandaCocina, imprimirVenta, obtenerVentaPorId, obtenerVentasAdmin } from '../api/ajustesAdminApi'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useAjustesQuery = ({ filtros }) => {
  const [page, setPage] = useState(1)
  const pedidosQuery = useQuery({
    queryKey: ['ajustes-admin', filtros?.filtroEstado, filtros?.tipoVenta, page],
    queryFn: () => obtenerVentasAdmin({ filtros, page })
  })

  const siguientePagina = () => {
    if (pedidosQuery.data?.length === 0) {
      return
    }
    setPage((prev) => prev + 1)
  }

  const anteriorPagina = () => {
    if (page === 1) {
      return
    }
    setPage((prev) => prev - 1)
  }

  return {
    pedidosQuery,
    siguientePagina,
    anteriorPagina,
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