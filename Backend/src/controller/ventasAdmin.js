import { ProductoSinStockError, StockInsuficienteError, VentaErrorComun, VentaSearchError } from '../errors/index.js'

export class ControladorVentaAdmin {
  constructor ({ ventasAdminServicio }) {
    this.ventasAdminServicio = ventasAdminServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      if (error instanceof VentaSearchError) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message
        })
      }
      if (error instanceof ProductoSinStockError) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message,
          productoId: error.productoId
        })
      }
      if (error instanceof StockInsuficienteError) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message,
          producto: error.producto,
          disponible: error.disponible,
          solicitado: error.solicitado
        })
      }
      if (error instanceof VentaErrorComun) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message
        })
      }
      return res.status(500).json({ error: 'error al procesar la solicitud', errorDetalle: error.message })
    }
  }

  obtenerVentasAdmin = this.#manejarRespuesta((req) => this.ventasAdminServicio.obtenerVentasAdmin({
    filtros: {
      filtroEstado: req.query.filtroEstado,
      tipoVenta: req.query.tipoVenta
    },
    page: {
      limit: Number(req.query.limit) || 5,
      offset: Number(req.query.offset) || 0
    }
  }))

  obtenerVentasPorMesas = this.#manejarRespuesta((req) => this.ventasAdminServicio.obtenerVentasPorMesas({
    filtro: req.query.filtroMesaNombre
  }))

  obtenerVentaPorId = this.#manejarRespuesta((req) => this.ventasAdminServicio.obtenerVentaPorId({
    ventaId: req.params.id
  }))

  agregarProductoAPedidoMesero = this.#manejarRespuesta((req) => this.ventasAdminServicio.agregarProductoAPedidoMesero({
    ventaId: req.params.id,
    body: req.body,
    io: req.app.get('io')
  }))

  asignarReservaAMesero = this.#manejarRespuesta((req) => this.ventasAdminServicio.asignarReservaAMesero({
    ventaId: req.params.id,
    body: req.body,
    io: req.app.get('io')
  }))

  anularProductoDeVenta = this.#manejarRespuesta((req) => this.ventasAdminServicio.anularProductoDeVenta({
    ventaId: req.params.id,
    body: req.body,
    io: req.app.get('io')
  }))

  anularVenta = this.#manejarRespuesta((req) => this.ventasAdminServicio.anularVenta({
    ventaId: req.params.id,
    io: req.app.get('io')
  }))

  cambiarEstadoVenta = this.#manejarRespuesta((req) => this.ventasAdminServicio.cambiarEstadoVenta({
    ventaId: req.params.id,
    body: req.body,
    io: req.app.get('io')
  }))

  imprimirComandaCocina = this.#manejarRespuesta((req) => this.ventasAdminServicio.imprimirComandaCocina({
    ventaId: req.params.id
  }))

  imprimirVenta = this.#manejarRespuesta((req) => this.ventasAdminServicio.imprimirFacturaVenta({
    ventaId: req.params.id
  }))

  obtenerTotalesDiarios = this.#manejarRespuesta((req) => this.ventasAdminServicio.obtenerTotalesDiarios())
}
