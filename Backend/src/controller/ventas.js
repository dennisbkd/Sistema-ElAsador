import { StockInsuficienteError, ProductoSinStockError } from '../errors/index.js'

export class ControladorVenta {
  constructor ({ ventaServicio }) {
    this.ventaServicio = ventaServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
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
      return res.status(500).json({ error: 'error al procesar la solicitud', errorDetalle: error.message })
    }
  }

  crearVenta = this.#manejarRespuesta((req) => this.ventaServicio.crearVenta({
    body: req.body,
    usuarioId: req.usuario?.id,
    io: req.app.get('io')
  }), 201)

  ventasDelDiaDetallados = this.#manejarRespuesta((req) => this.ventaServicio.ventasDelDiaDetallado({
    filtroEstado: req.query.filtroEstado,
    usuarioId: req.usuario?.id
  }))

  agregarProductoAVenta = this.#manejarRespuesta((req) => this.ventaServicio.agregarProductoAVenta({
    body: req.body,
    ventaId: req.params.id,
    io: req.app.get('io')
  }))

  obtenerVentaId = this.#manejarRespuesta((req) => this.ventaServicio.obtenerVentaId({
    ventaId: req.params.id
  }))
}
