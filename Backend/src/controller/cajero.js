import { VentaErrorComun } from '../errors/index.js'

export class CajeroControlador {
  constructor ({ cajeroServicio }) {
    this.cajeroServicio = cajeroServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      if (error instanceof VentaErrorComun) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message
        })
      }
      return res.status(500).json({ error: 'error al procesar la solicitud', errorDetalle: error.message })
    }
  }

  registrarPago = this.#manejarRespuesta((req) => this.cajeroServicio.registrarPago({
    body: req.body,
    usuarioId: req.usuario?.id,
    io: req.app.get('io')
  }), 201)

  abrirCaja = this.#manejarRespuesta((req) => this.cajeroServicio.abrirCaja({
    usuarioId: req.usuario?.id,
    body: req.body
  }), 201)

  cerrarCaja = this.#manejarRespuesta((req) => this.cajeroServicio.cerrarCaja({
    usuarioId: req.usuario?.id,
    body: req.body
  }), 200)

  obtenerCajaAbierta = this.#manejarRespuesta((req) => this.cajeroServicio.obtenerCajaAbierta({
    usuarioId: req.usuario?.id
  }), 200)
}
