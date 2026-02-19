export class DashboardControlador {
  constructor ({ dashboardServicio }) {
    this.dashboardServicio = dashboardServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) {
        return res.status(respuesta?.statusError || 400).json({
          error: respuesta.error,
          timestamp: new Date().toISOString()
        })
      }
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      return res.status(500).json({
        error: 'Error al procesar la solicitud',
        mensaje: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // GET /dashboard/summary
  obtenerResumenGeneral = this.#manejarRespuesta(() => this.dashboardServicio.obtenerResumenGeneral())

  // GET /dashboard/sales-by-hour
  obtenerVentasPorHora = this.#manejarRespuesta(() => this.dashboardServicio.obtenerVentasPorHora())

  // GET /dashboard/top-products
  obtenerProductosMasVendidos = this.#manejarRespuesta((req) => {
    const limite = parseInt(req.query.limite, 10) || 10
    return this.dashboardServicio.obtenerProductosMasVendidos(limite)
  })

  // GET /dashboard/live-orders
  obtenerPedidosEnTiempoReal = this.#manejarRespuesta(() => this.dashboardServicio.obtenerPedidosEnTiempoReal())

  // GET /dashboard/recent-activity
  obtenerActividadReciente = this.#manejarRespuesta((req) => {
    const limite = parseInt(req.query.limite, 10) || 20
    return this.dashboardServicio.obtenerActividadReciente(limite)
  })

  // GET /dashboard/sales-by-type
  obtenerVentasPorTipo = this.#manejarRespuesta(() => this.dashboardServicio.obtenerVentasPorTipo())

  // GET /dashboard/sales-by-state
  obtenerVentasPorEstado = this.#manejarRespuesta(() => this.dashboardServicio.obtenerVentasPorEstado())

  // POST /dashboard/invalidate-cache - Invalidar caché (opcional)
  invalidarCache = this.#manejarRespuesta((req) => {
    this.dashboardServicio.invalidarCache()
    return {
      mensaje: 'Caché invalidado exitosamente',
      timestamp: new Date().toISOString()
    }
  }, 200)
}
