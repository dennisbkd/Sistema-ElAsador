import { Op } from 'sequelize'
import { sequelize } from '../model/index.js'

export class ProductoServicio {
  constructor ({ modeloProducto, modeloStock, modeloCategoria, modeloDetalleVenta }) {
    this.modeloProducto = modeloProducto
    this.modeloStock = modeloStock
    this.modeloCategoria = modeloCategoria
    this.modeloDetalleVenta = modeloDetalleVenta
  }

  // obtener productos
  async obtenerProductos ({ offset, limit, filtros }) {
    const where = {}
    if (filtros.categoriaId) {
      where.categoriaId = filtros.categoriaId
    }

    if (filtros.activo !== 'undefined' && filtros.activo !== undefined && filtros.activo !== 'null') {
      where.activo = filtros.activo === 'true'
    }
    try {
      const dataProducto = await this.modeloProducto.findAll({
        offset: Number(offset) || 0,
        limit: Number(limit) || 5,
        attributes: { exclude: ['categoriaId'] },
        where,
        include: [{
          model: this.modeloCategoria,
          attributes: ['id', 'nombre', 'icono'],
          as: 'categoria'
        }, {
          model: this.modeloStock,
          attributes: ['id', 'cantidad', 'cantidadMinima']
        }]
      })
      const dtoProducto = dataProducto.map((producto) => {
        const fecha = producto.createdAt.toLocaleDateString('es-BO')
        const hora = producto.createdAt.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit'
        })

        return {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.imagen,
          esPreparado: producto.esPreparado,
          activo: producto.activo,
          categoria: producto.categoria,
          stock: producto.StockPlato,
          fecha,
          hora
        }
      })
      return dtoProducto
    } catch (error) {
      console.log(error)
    }
  }

  // crear producto
  async crearProducto ({ body, file }) {
    const transaction = await sequelize.transaction()
    const {
      nombre,
      descripcion,
      categoriaId,
      precio,
      esPreparado,
      stock
    } = body

    try {
      // verificar si el producto ya existe
      const existeProducto = await this.modeloProducto.findOne({ where: { nombre, categoriaId } })
      if (existeProducto) {
        await transaction.rollback()
        return { error: 'El producto ya existe en el sistema', statusError: 409 }
      }
      let imagenPath = null

      if (file) {
        imagenPath = `/uploads/productos/${file.filename}`
      }
      const nuevoProducto = await this.modeloProducto.create({
        nombre,
        descripcion,
        categoriaId,
        precio,
        imagen: imagenPath,
        esPreparado
      }, { transaction })

      await nuevoProducto.createStockPlato({
        cantidad: stock.cantidad,
        cantidadMinima: stock.cantidadMinima
      }, { transaction })
      await transaction.commit()

      return nuevoProducto
    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al crear un producto')
    }
  }

  // editar producto
  async editarProducto ({ id, body, file, io }) {
    const transaction = await sequelize.transaction()
    const {
      nombre,
      descripcion,
      categoriaId,
      precio,
      esPreparado,
      stock
    } = body
    const actualizarDatos = {}
    try {
      const existeProducto = await this.modeloProducto.findByPk(id, { transaction })
      if (!existeProducto) {
        await transaction.rollback()
        return { error: 'No existe el producto solicitado', statusError: 409 }
      }
      if (nombre !== undefined) actualizarDatos.nombre = nombre
      if (descripcion !== undefined) actualizarDatos.descripcion = descripcion
      if (categoriaId !== undefined) actualizarDatos.categoriaId = categoriaId
      if (precio !== undefined) actualizarDatos.precio = precio
      if (esPreparado !== undefined) actualizarDatos.esPreparado = esPreparado
      if (stock) {
        const stockPlato = await existeProducto.getStockPlato({ transaction })
        if (!stockPlato) {
          await transaction.rollback()
          return { error: 'El producto no tiene stock asociado', statusError: 409 }
        }
        if (stock.cantidad !== undefined) stockPlato.cantidad = stock.cantidad
        if (stock.cantidadMinima !== undefined) stockPlato.cantidadMinima = stock.cantidadMinima
        await stockPlato.save({ transaction })
      }
      if (file) {
        const imagenPath = `/uploads/productos/${file.filename}`
        actualizarDatos.imagen = imagenPath
      }
      if (Object.keys(actualizarDatos).length > 0) {
        await existeProducto.update(actualizarDatos, { transaction })
      }
      await transaction.commit()
      if (io) {
        io.emit('productoActualizado', {
          nombre: actualizarDatos.nombre || existeProducto.nombre,
          id: existeProducto.id,
          mensaje: 'El producto ha sido actualizado.'
        })
      }
    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al actualizar el producto')
    }
  }

  // eliminar producto
  async eliminarProducto ({ id }) {
    const transaction = await sequelize.transaction()
    try {
      const producto = await this.modeloProducto.findByPk(id, { transaction })
      if (!producto) {
        await transaction.rollback()
        return { error: 'No existe el producto solicitado', statusError: 404 }
      }
      // Verificar si el producto está asociado a alguna venta
      const ventaAsociada = await this.modeloDetalleVenta.findOne(
        { where: { productoId: id } },
        { transaction })
      if (ventaAsociada) {
        await transaction.rollback()
        return { error: 'No se puede eliminar el producto porque está asociado a una venta', statusError: 409 }
      }
      await producto.destroy({ transaction })
      await transaction.commit()
      return { message: 'Producto eliminado correctamente' }
    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al eliminar el producto')
    }
  }

  // obtener producto por id
  async obtenerProductoId ({ id }) {
    try {
      const producto = await this.modeloProducto.findByPk(id, {
        attributes: { exclude: ['categoriaId'] },
        include: [{
          model: this.modeloCategoria,
          attributes: ['id', 'nombre', 'icono'],
          as: 'categoria'
        }, {
          model: this.modeloStock,
          attributes: ['id', 'cantidad', 'cantidadMinima']
        }]
      })
      if (!producto) {
        return { error: 'No existe el producto solicitado', statusError: 404 }
      }
      return {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: producto.imagen,
        esPreparado: producto.esPreparado,
        activo: producto.activo,
        categoria: producto.categoria,
        stock: producto.StockPlato
      }
    } catch (error) {
      throw new Error('Error al obtener el producto por id')
    }
  }

  async busquedaProductoNombre ({ nombre }) {
    try {
      const where = {}
      if (nombre.trim()) {
        where.nombre = { [Op.like]: `%${nombre}%` }
      }
      where.activo = true

      const productosEncontrados = await this.modeloProducto.findAll({
        attributes: { exclude: ['categoriaId'] },
        where,
        include: [{
          model: this.modeloCategoria,
          attributes: ['id', 'nombre', 'icono'],
          as: 'categoria'
        }, {
          model: this.modeloStock,
          attributes: ['id', 'cantidad', 'cantidadMinima']
        }]
      })

      if (productosEncontrados.length === 0) {
        return []
      }
      const dtoProducto = productosEncontrados.map((producto) => {
        const fecha = producto.createdAt.toLocaleDateString('es-BO')
        const hora = producto.createdAt.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit'
        })

        return {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.imagen,
          esPreparado: producto.esPreparado,
          activo: producto.activo,
          categoria: producto.categoria,
          stock: producto.StockPlato,
          fecha,
          hora
        }
      })
      return dtoProducto
    } catch (error) {
      throw new Error('Error en la busqueda de productos por nombre')
    }
  }

  async cambiarEstadoProducto ({ id, activo }) {
    const transaction = await sequelize.transaction()
    try {
      const producto = await this.modeloProducto.findByPk(id, { transaction })
      if (!producto) {
        await transaction.rollback()
        return { error: 'No existe el producto solicitado', statusError: 404 }
      }
      producto.activo = activo
      await producto.save({ transaction })
      await transaction.commit()
      return { message: 'Estado del producto actualizado correctamente' }
    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al cambiar el estado del producto')
    }
  }
}
