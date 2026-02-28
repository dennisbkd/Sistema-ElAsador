import { instancia } from "../../../config/axios"

const API_DASHBOARD = '/dashboard'

export const dashboardApi = {
  // GET /dashboard/summary
  obtenerResumen: async () => {
      const { data } = await instancia.get(`${API_DASHBOARD}/summary`)
      return data
  },
  // GET /dashboard/sales-by-hour
  obtenerVentasPorHora: async () => {
      const { data } = await instancia.get(`${API_DASHBOARD}/sales-by-hour`)
      return data
  },
  // GET /dashboard/top-products
  obtenerProductosMasVendidos: async (limite = 10) => {
      const { data } = await instancia.get(`${API_DASHBOARD}/top-products`, {
        params: { limite }
      })
      return data
  },
  // GET /dashboard/live-orders
  obtenerPedidosEnTiempoReal: async () => {
      const { data } = await instancia.get(`${API_DASHBOARD}/live-orders`)
      return data
  },
  // GET /dashboard/recent-activity
  obtenerActividadReciente: async (limite = 20) => {
      const { data } = await instancia.get(`${API_DASHBOARD}/recent-activity`, {
        params: { limite }
      })
      return data
  },
  // GET /dashboard/sales-by-type
  obtenerVentasPorTipo: async () => {
      const { data } = await instancia.get(`${API_DASHBOARD}/sales-by-type`)
      return data
  },
  // GET /dashboard/sales-by-state
  obtenerVentasPorEstado: async () => {
      const { data } = await instancia.get(`${API_DASHBOARD}/sales-by-state`)
      return data
  },
  // POST /dashboard/invalidate-cache
  invalidarCache: async () => {
      const { data } = await instancia.post(`${API_DASHBOARD}/invalidate-cache`)
      return data
  }
}
