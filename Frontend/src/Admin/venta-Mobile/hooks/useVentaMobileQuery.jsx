import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { agregarProductoAVentaMobile, crearVentaMobile, obtenerVentaIdMobile, obtenerVentaPorUsuario } from "../api/ventaMobileApi"
import toast from "react-hot-toast"

//Todo: mejorar los toast.error para que muestren mensajes más específicos según el error recibido

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
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al crear el producto')
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
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al agregar el producto a la venta')
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