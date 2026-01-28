import { AuthSesionError } from '../errors/index.js'

export class AuthControlador {
  constructor ({ authServicio }) {
    this.authServicio = authServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(respuesta?.statusError || 400).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      if (error instanceof AuthSesionError) {
        return res.status(error.statusCode).json({
          error: error.name,
          mensaje: error.message,
          usuario: error.usuario
        })
      }
      return res.status(500).json({ error: 'error al procesar la solicitud', errorDetalle: error.message })
    }
  }

  iniciarSesion = this.#manejarRespuesta((req) => this.authServicio.iniciarSesion({ body: req.body }), 200)
}
