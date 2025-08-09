export class ControladorUsuario {
  constructor ({ usuarioServicio }) {
    this.UsuarioServicio = usuarioServicio
  }

  obtenerUsuarios = async (req, res) => {
    const usuarios = await this.UsuarioServicio.obtenerUsuarios()
    if (usuarios.error) return res.status(404).json({ error: usuarios.error })

    return res.status(200).json(usuarios)
  }

  editarUsuario = async (req, res) => {
    const datos = req.body
    const { id } = req.params
    const usuarioActualizado = await this.UsuarioServicio.editarUsuario({ datos, id })
    if (usuarioActualizado.error) return res.status(404).json({ error: usuarioActualizado.error })

    return res.status(200).json(usuarioActualizado)
  }
}
