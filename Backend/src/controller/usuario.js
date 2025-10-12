export class ControladorUsuario {
  constructor ({ usuarioServicio }) {
    this.UsuarioServicio = usuarioServicio
  }

  #manejarRespuesta = (servicioFn) => async (req, res) => {
    try {
      const respuesta = await servicioFn(req)
      if (respuesta?.error) return res.status(404).json({ error: respuesta.error })
      return res.status(200).json(respuesta)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  obtenerUsuarios = this.#manejarRespuesta(() =>
    this.UsuarioServicio.obtenerUsuarios())

  editarUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.editarUsuario({ data: req.body, id: req.params.id }))

  agregarUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.agregarUsuario({ datos: req.body }))

  cambiarEstadoUsuario = this.#manejarRespuesta((req) =>
    this.UsuarioServicio.cambiarEstadoUsuario({ id: req.params.id }))
}
