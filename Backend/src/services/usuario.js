export class UsuarioServicio {
  constructor ({ modelUsuario, modelVenta }) {
    this.modelUsuario = modelUsuario
    this.modelVenta = modelVenta
  }

  async obtenerUsuarios () {
    try {
      const dataUsuario = await this.modelUsuario.findAll()

      if (!dataUsuario || dataUsuario.length === 0) {
        return { error: 'Lista vacia' }
      }
      const DtoUsuario = dataUsuario.map((data) => {
        const hora = new Date(data.createdAt).toISOString().substring(11, 16)
        const fecha = data.createdAt.toISOString().split('T')[0]
        return {
          id: data.id,
          nombre: data.nombre,
          usuario: data.usuario,
          rol: data.rol.toLowerCase(),
          fechaRegistro: fecha,
          hora,
          activo: data.activo
        }
      })

      return DtoUsuario
    } catch (error) {
      console.error('Error al consultar usuarios:', error)
      return { error: error.message }
    }
  }

  async editarUsuario ({ data, id }) {
    try {
      const { nombre, usuario, rol, password, activo } = data

      // 1. Primero hacer el update
      const [affectedCount] = await this.modelUsuario.update(
        { nombre, usuario, rol, password, activo },
        { where: { id } }
      )

      if (affectedCount === 0) {
        return { error: 'Usuario no encontrado' }
      }

      // 2. Luego obtener el usuario actualizado
      const usuarioActualizado = await this.modelUsuario.findByPk(id)

      if (!usuarioActualizado) {
        return { error: 'Usuario no encontrado después de actualizar' }
      }

      // 3. Formatear la respuesta
      const hora = new Date(usuarioActualizado.createdAt).toISOString().substring(11, 16)
      const fecha = usuarioActualizado.createdAt.toISOString().split('T')[0]

      return {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        usuario: usuarioActualizado.usuario,
        rol: usuarioActualizado.rol.toLowerCase(),
        fecha,
        hora,
        activo: usuarioActualizado.activo
      }
    } catch (error) {
      console.error('Error al Editar el usuario:', error)
      return { error: error.message }
    }
  }

  async agregarUsuario ({ datos }) {
    const { nombre, password, usuario, rol } = datos
    try {
      const agregar = await this.modelUsuario.create({
        nombre, password, usuario, rol
      })
      const nuevoUsuario = await this.modelUsuario.findByPk(agregar.id)

      const hora = new Date(nuevoUsuario.createdAt).toISOString().substring(11, 16)
      const fecha = nuevoUsuario.createdAt.toISOString().split('T')[0]
      return {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        usuario: nuevoUsuario.usuario,
        rol: nuevoUsuario.rol.toLowerCase(),
        fecha,
        hora,
        activo: nuevoUsuario.activo
      }
    } catch (error) {
      return { error: 'Error al crear nuevo Usuario' + error.message }
    }
  }
}
