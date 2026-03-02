import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { abrirCaja, cerrarCaja, obtenerCajaAbierta, registrarPago } from '../api/cajaApi'
import toast from 'react-hot-toast'
import { asignarReservaAMesero } from '../../ajustes/api/ajustesAdminApi'

export const useCajaQueryAbrir = () => {
  // const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['abrir-caja'],
    mutationFn: ({ montoInicial }) => abrirCaja({ montoInicial }),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['caja-abierta'] })
      toast.success('Caja abierta con éxito')
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || 'Error al abrir la caja')
    }
  })
}

export const useCajaQueryObtenerAbierta = () => {
  return useQuery({
    queryKey: ['caja-abierta'],
    queryFn: () => obtenerCajaAbierta(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}

export const useCajaCerrar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cerrar-caja'],
    mutationFn: ({ body }) => cerrarCaja({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caja-abierta'] })
      toast.success('Caja cerrada con éxito')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errorDetalle || 'Error al cerrar la caja')
    }
  })
}

export const useRegistrarPago = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['registrar-pago'],
    mutationFn: ({ ventaId, metodoPago }) => registrarPago({ ventaId, metodoPago }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caja-abierta'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['totales-diarios'] })
      toast.success('Pago registrado con éxito')
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || 'Error al registrar el pago')
    }
  })
}

export const useAsignarMeseroAPedido = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['asignar-pedido'],
    mutationFn: ({ ventaId, body }) => asignarReservaAMesero({ ventaId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ajuste-venta-id'] })
      queryClient.invalidateQueries({ queryKey: ['ajustes-admin'] })
      toast.success('Mesero asignado con éxito')
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || 'Error al asignar mesero')
    }
  })
}