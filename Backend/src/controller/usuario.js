export class ControladorUsuario {
  constructor ({ usuarioServicio }) {
    this.UsuarioServicio = usuarioServicio
  }

  #manejarRespuesta = (servicioFn, statusCode = 200, statusCodeError = 404) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(statusCodeError).json({ error: respuesta.error })
      return res.status(statusCode).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  obtenerUsuarios = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.obtenerUsuarios(req.query.offset, req.query.limit, req.query.filtroRol))

  editarUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.editarUsuario({ data: req.body, id: req.params.id }))

  agregarUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.agregarUsuario({ datos: req.body }), 200, 409)

  cambiarEstadoUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.cambiarEstadoUsuario({ id: req.params.id }))

  obtenerTotalUsuarios = this.#manejarRespuesta(() =>
    this.UsuarioServicio.obtenerTotalUsuarios())

  eliminarUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.eliminarUsuario({ id: req.params.id }), 200, 409)
}
