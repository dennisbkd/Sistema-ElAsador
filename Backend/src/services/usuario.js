export class UsuarioServicio {
  constructor ({ modelUsuario, modelRol }) {
    this.modelUsuario = modelUsuario
    this.modelRol = modelRol
  }

  async obtenerUsuarios () {
    try {
      const dataUsuario = await this.modelUsuario.findAll({ include: this.modelRol })

      if (!dataUsuario) {
        return { error: 'Usuarios no encontrados' }
      }
      return dataUsuario
    } catch (error) {
      return { error: 'Error al consultar usuarios' }
    }
  }

  async editarUsuario ({ datos, id }) {
    console.log(id)
    const { nombre, contrasena, idRol, estado } = datos
    try {
      await this.modelUsuario.update(
        { nombre, contrasena, idRol, estado },
        { where: { idUsuario: id } }
      )
      return { succes: true }
    } catch (error) {
      return { error: error.message }
    }
  }
}
