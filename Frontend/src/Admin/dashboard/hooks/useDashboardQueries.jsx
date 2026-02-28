import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'

const DASHBOARD_STALE_TIME = 30000 // 30 segundos

export const useDashboardResumen = () => {
  return useQuery({
    queryKey: ['dashboard', 'resumen'],
    queryFn: dashboardApi.obtenerResumen,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: 60000, // Refetch cada 60 segundos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

export const useDashboardVentasPorHora = () => {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-hora'],
    queryFn: dashboardApi.obtenerVentasPorHora,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: 120000, // Refetch cada 2 minutos
    retry: 2
  })
}

export const useDashboardProductosMasVendidos = (limite = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'productos-vendidos', limite],
    queryFn: () => dashboardApi.obtenerProductosMasVendidos(limite),
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: 120000,
    retry: 2
  })
}

export const useDashboardPedidosEnTiempoReal = () => {
  return useQuery({
    queryKey: ['dashboard', 'pedidos-tiempo-real'],
    queryFn: dashboardApi.obtenerPedidosEnTiempoReal,
    staleTime: 15000, // 15 segundos
    refetchInterval: 30000, // Refetch cada 30 segundos
    retry: 2
  })
}

export const useDashboardActividadReciente = (limite = 20) => {
  return useQuery({
    queryKey: ['dashboard', 'actividad-reciente', limite],
    queryFn: () => dashboardApi.obtenerActividadReciente(limite),
    staleTime: 20000, // 20 segundos
    refetchInterval: 45000, // Refetch cada 45 segundos
    retry: 2
  })
}

export const useDashboardVentasPorTipo = () => {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-tipo'],
    queryFn: dashboardApi.obtenerVentasPorTipo,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: 60000, // Refetch cada 60 segundos
    retry: 2
  })
}

export const useDashboardVentasPorEstado = () => {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-estado'],
    queryFn: dashboardApi.obtenerVentasPorEstado,
    staleTime: 15000, // 15 segundos
    refetchInterval: 30000, // Refetch cada 30 segundos
    retry: 2
  })
}

export const useDashboardReporteVentas = ({ fechaInicio, fechaFin, enabled = false } = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'reporte-ventas', fechaInicio, fechaFin],
    queryFn: () => dashboardApi.obtenerReporteVentas({ fechaInicio, fechaFin }),
    staleTime: 300000, // 5 minutos
    enabled,
    retry: 1
  })
}
