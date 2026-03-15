import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { agregarProductoAVentaMobile, crearVentaMobile, obtenerVentaIdMobile, obtenerVentaPorUsuario } from "../api/ventaMobileApi"
import toast from "react-hot-toast"

//Todo: mejorar los toast.error para que muestren mensajes más específicos según el error recibido

const obtenerMensajeError = (error, mensajeFallback) => {
  return error?.response?.data?.mensaje || error?.response?.data?.error || mensajeFallback
}

export const useVentaPorUsuario = ({ filtroEstado }) => {
  const pedidosQuery = useQuery({
    queryKey: ['venta-mobile-del-dia', filtroEstado],
    queryFn: () => obtenerVentaPorUsuario({ filtroEstado }),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  })


  return {
    pedidos: pedidosQuery.data || [],
    isLoading: pedidosQuery.isLoading,
    isError: pedidosQuery.isError
  }
}

export const useCrearVenta = () => {
  const clientQuery = useQueryClient()
  return useMutation({
    mutationKey: ['crear-venta'],
    mutationFn: ({ pedido }) => crearVentaMobile({ pedido }),
    onSuccess: () => {
      toast.success('Venta creada con éxito')
      clientQuery.invalidateQueries({ queryKey: ['venta-mobile-del-dia'] })
      clientQuery.invalidateQueries({ queryKey: ['productos'], exact: false })
      clientQuery.invalidateQueries({ queryKey: ['busqueda-producto-nombre'], exact: false })
    },
    onError: (error) => {
      toast.error(obtenerMensajeError(error, 'Error al crear la venta'))
    }
  })
}

export const useAgregarProductoAVenta = () => {
  const clientQuery = useQueryClient()
  return useMutation({
    mutationKey: ['agregar-producto-venta'],
    mutationFn: ({ ventaId, detalle }) => agregarProductoAVentaMobile({ ventaId, detalle }),
    onSuccess: () => {
      toast.success('Producto agregado a la venta con éxito')
      clientQuery.invalidateQueries({ queryKey: ['venta-mobile-del-dia'] })
      clientQuery.invalidateQueries({ queryKey: ['venta-mobile-id'] })
      clientQuery.invalidateQueries({ queryKey: ['productos'], exact: false })
      clientQuery.invalidateQueries({ queryKey: ['busqueda-producto-nombre'], exact: false })
    },
    onError: (error) => {
      toast.error(obtenerMensajeError(error, 'Error al agregar el producto a la venta'))
    }
  })
}

export const useVentaPorId = ({ ventaId }) => {
  const ventaQuery = useQuery({
    queryKey: ['venta-mobile-id', ventaId],
    queryFn: () => obtenerVentaIdMobile({ ventaId }),
    enabled: !!ventaId,
    staleTime: 1000 * 60 * 5, //5 minutos
  })
  return {
    venta: ventaQuery.data || {},
    isLoadingVenta: ventaQuery.isLoading,
    isErrorVenta: ventaQuery.isError
  }
}