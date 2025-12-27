import { fn, col } from 'sequelize'
export class UsuarioServicio {
  constructor ({ modelUsuario, modelVenta }) {
    this.modelUsuario = modelUsuario
    this.modelVenta = modelVenta
  }

  async obtenerUsuarios (offset, limit, filtroRol) {
    const where = {}
    if (filtroRol) {
      where.rol = filtroRol
    }

    try {
      const dataUsuario = await this.modelUsuario.findAll({
        offset: Number(offset) || 0,
        limit: Number(limit) || 5,
        order: [['id', 'DESC']],
        where
      })

      if (!dataUsuario) {
        return { error: 'Lista vacia' }
      }
      if (dataUsuario.length === 0) {
        return []
      }

      const DtoUsuario = dataUsuario.map((data) => {
        const fecha = data.createdAt.toLocaleDateString('es-BO')
        const hora = data.createdAt.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit'
        })
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
      const existeUsuario = await this.modelUsuario.findOne({
        where: { usuario }
      })
      if (existeUsuario) {
        return { error: 'El nombre de usuario ya está en uso' }
      }
      const agregar = await this.modelUsuario.create({
        nombre, password, usuario, rol
      })
      const nuevoUsuario = await this.modelUsuario.findByPk(agregar.id)

      const fecha = nuevoUsuario.createdAt.toLocaleDateString('es-BO')
      const hora = nuevoUsuario.createdAt.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
      })
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

  async cambiarEstadoUsuario ({ id }) {
    try {
      const usuario = await this.modelUsuario.findByPk(id)
      if (!usuario) {
        return { error: 'Usuario no encontrado' }
      }

      // Verificar si el usuario es un mesero y si tiene ventas activas
      if (usuario.rol.toLowerCase() === 'mesero') {
        const ventasActivas = await this.modelVenta.count({
          where: {
            usuarioId: id,
            estado: 'PENDIENTE' // no se desactivara si tiene ventas pendientes
          }
        })
        if (ventasActivas > 0) {
          return { error: 'No se puede desactivar un mesero con ventas activas' }
        }
      }

      // Cambiar el estado del usuario
      usuario.activo = !usuario.activo
      await usuario.save()

      return { mensaje: 'Estado de usuario actualizado', usuario }
    } catch (error) {
      console.error('Error al cambiar estado de usuario:', error)
      return { error: error.message }
    }
  }

  async obtenerTotalUsuarios () {
    try {
      const total = await this.modelUsuario.findAll(
        {
          attributes: [
            'rol',
            [fn('COUNT', col('id')), 'cantidad']
          ],
          group: ['rol'],
          order: [['rol', 'ASC']]
        }
      )
      return total
    } catch (error) {
      console.error('Error al obtener total de usuarios:', error)
      return { error: error.message }
    }
  }

  async eliminarUsuario ({ id }) {
    try {
      const tieneVentas = await this.modelVenta.count({
        where: { usuarioId: id }
      })
      if (tieneVentas > 0) {
        return { error: 'No se puede eliminar el usuario porque tiene ventas realizadas.' }
      }

      await this.modelUsuario.destroy({
        where: { id }
      })
      return { message: 'Usuario eliminado correctamente.' }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return { error: error.message }
    }
  }
}
