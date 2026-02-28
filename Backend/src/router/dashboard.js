import { Router } from 'express'
import { verificarRol } from '../../middleware/verificarRol.js'
import { DashboardControlador } from '../controller/dashboard.js'

export const rutaDashboard = ({ dashboardServicio }) => {
  const rutas = Router()
  const controladorDashboard = new DashboardControlador({ dashboardServicio })

  // Todos los endpoints requieren autenticación y rol ADMIN o GERENTE
  rutas.get('/summary', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerResumenGeneral)
  rutas.get('/sales-by-hour', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerVentasPorHora)
  rutas.get('/top-products', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerProductosMasVendidos)
  rutas.get('/live-orders', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerPedidosEnTiempoReal)
  rutas.get('/recent-activity', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerActividadReciente)
  rutas.get('/sales-by-type', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerVentasPorTipo)
  rutas.get('/sales-by-state', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.obtenerVentasPorEstado)
  rutas.post('/invalidate-cache', verificarRol(['ADMINISTRADOR', 'CAJERO']), controladorDashboard.invalidarCache)

  return rutas
}
