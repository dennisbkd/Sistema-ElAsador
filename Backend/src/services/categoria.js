export class CategoriaServicio {
  constructor ({ modeloCategoria, modeloProducto }) {
    this.modeloCategoria = modeloCategoria
    this.modeloProducto = modeloProducto
  }
  // obtener categorias

  async obtenerCategorias ({ offset, limit, filtroTipo }) {
    // verificar si recibimos un filtro
    const where = {}
    if (filtroTipo) {
      where.tipo = filtroTipo
    }
    try {
      const dataCategoria = await this.modeloCategoria.findAll({
        offset: Number(offset) || 0,
        limit: Number(limit) || 5,
        order: [['nombre', 'ASC']],
        where
      })

      if (dataCategoria.length === 0) {
        return []
      }

      const DtoCategoria = dataCategoria.map((categoria) => {
        const fecha = categoria.createdAt.toLocaleDateString('es-BO')
        const hora = categoria.createdAt.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit'
        })

        return {
          id: categoria.id,
          nombre: categoria.nombre,
          tipo: categoria.tipo,
          icono: categoria.icono,
          hora,
          fecha
        }
      })
      return DtoCategoria
    } catch (error) {
      throw new Error('Error al obtener los productos')
    }
  }

  // crear categoria
  async crearCategoria ({ body }) {
    const { nombre, tipo, icono } = body

    try {
      const existe = await this.modeloCategoria.findOne({ where: { nombre, tipo } })

      if (existe) {
        return { error: 'La categoria ya existe en el sistema', statusError: 409 }
      }

      const crearCategoria = await this.modeloCategoria.create({
        nombre,
        tipo,
        icono
      })
      return {
        id: crearCategoria.id,
        nombre: crearCategoria.nombre,
        tipo: crearCategoria.tipo
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error al crear la categoria')
    }
  }
  // actualizar categoria

  async actualizarCategoria ({ id, body }) {
    const { nombre, tipo, icono } = body
    const datosActualizar = {}

    try {
      const existeCategoria = await this.modeloCategoria.findByPk(id)
      if (!existeCategoria) {
        return { error: 'No existe la categoria solicitada', statusError: 409 }
      }

      if (nombre !== undefined) datosActualizar.nombre = nombre
      if (tipo !== undefined) datosActualizar.tipo = tipo
      if (icono !== undefined) datosActualizar.icono = icono

      if (Object.keys(datosActualizar).length > 0) {
        await existeCategoria.update(datosActualizar)
      }
      return { message: 'Categoria actualizada' }
    } catch (error) {
      throw new Error('Error al actualizar la categoria')
    }
  }

  // eliminar categoria
  async eliminarCategoria ({ id }) {
    try {
      const existeCategoria = await this.modeloCategoria.findByPk(id)
      if (!existeCategoria) {
        return { error: 'No existe la categoria solicitada', statusError: 409 }
      }
      const estaRelacionada = await this.modeloProducto.findOne({ where: { categoriaId: id } })
      if (estaRelacionada) {
        return { error: 'No se puede Eliminar esta categoria debido a que esta relacionada con otros productos', statusError: 409 }
      }
      await this.modeloCategoria.destroy({ where: { id } })
      return { message: 'Categoria Eliminada correctamente' }
    } catch (error) {
      console.error(error)
      throw new Error('Error al eliminar la categoria')
    }
  }
}
