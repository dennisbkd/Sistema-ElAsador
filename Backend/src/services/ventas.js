import { Op } from 'sequelize'
import { sequelize } from '../model/index.js'
import { ProductoSinStockError, StockInsuficienteError, VentaErrorComun, VentaSearchError } from '../errors/index.js'
import { horaFinal, horaInicial } from '../utils/tiempo.js'

export class VentaServicio {
  constructor ({ modeloVenta, modeloDetalle, modeloProducto, modeloCategoria, modeloStockPlato, modeloUsuario, impresora }) {
    this.modeloVenta = modeloVenta
    this.modeloDetalle = modeloDetalle
    this.modeloProducto = modeloProducto
    this.modeloCategoria = modeloCategoria
    this.modeloStock = modeloStockPlato
    this.modeloUsuario = modeloUsuario
    this.impresora = impresora
  }

  async ventasDelDiaDetallados () {
    try {
      const ventasPorTipoProducto = await this.modeloDetalle.findAll({
        attributes: [
          'id', 'cantidad', 'subtotal'
        ],
        where: {
          createdAt: {
            [Op.between]: [
              new Date(new Date().setHours(0, 0, 0, 0)),
              new Date(new Date().setHours(23, 59, 59, 999))
            ]
          }
        },
        include: [
          {
            model: this.modeloProducto,
            attributes: [],
            include: [
              {
                model: this.modeloCategoria,
                attributes: ['nombre', 'id'],
                as: 'categoria'
              }
            ]
          }
        ],

        raw: true
      })

      if (!ventasPorTipoProducto) return { error: 'Aun no hay ventas' }

      const dataAgrupada = this.agruparPorCategoria(ventasPorTipoProducto)
      const resultado = this.calcularMetricas(dataAgrupada)

      return resultado
    } catch (error) {
      return { error: error.message }
    }
  }

  async ventasDelDiaDetallado ({ filtroEstado, usuarioId }) {
    const where = filtroEstado && filtroEstado !== 'TODOS' ? { estado: filtroEstado } : {}
    if (usuarioId) {
      where.usuarioId = usuarioId
    }
    try {
      // 1. Primero obtener las ventas del día
      const ventasHoy = await this.modeloVenta.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              horaInicial, // Inicio del día
              horaFinal // Fin del día
            ]
          },
          ...where
        },
        include: [
          {
            model: this.modeloDetalle,
            include: [
              {
                model: this.modeloProducto,
                attributes: ['nombre']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!ventasHoy) return { error: 'No se realizaron ventas' }

      // 2. Formatear los datos manualmente (más control)
      const ventasFormateadas = ventasHoy.map(venta => {
        const fecha = venta.createdAt.toLocaleDateString('es-BO')
        const hora = venta.createdAt.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit'
        })
        return {
          id: venta.id,
          codigo: venta.codigo,
          nroMesa: venta.nroMesa,
          clienteNombre: venta.clienteNombre ?? '',
          total: venta.total,
          estado: venta.estado,
          total_items: venta.DetallePedidos.length ?? 0,
          observaciones: venta.observaciones ?? '',
          fecha,
          hora
        }
      }).filter(venta => ['LISTO', 'PENDIENTE'].includes(venta.estado))
      return ventasFormateadas
    } catch (error) {
      return { error: error.message }
    }
  }

  agruparPorCategoria (ventasPorCategoria) {
    return Object.values(
      ventasPorCategoria.reduce((acc, item) => {
        const categoria = item['Producto.Categorium.nombre'] || 'Sin categoría'
        if (!acc[categoria]) {
          acc[categoria] = {
            categoria,
            itemsVendidos: 0,
            cantidadTotal: 0,
            ingresos: 0
          }
        }
        acc[categoria].itemsVendidos += 1
        acc[categoria].cantidadTotal += item.cantidad
        acc[categoria].ingresos += parseFloat(item.subtotal)
        return acc
      }, {})
    )
  }

  calcularMetricas (dataAgrupada) {
    const ingresoTotal = dataAgrupada.reduce((acc, item) => acc + item.ingresos, 0) || 1
    return dataAgrupada.map(item => (
      {
        categoria: item.categoria,
        itemsVendidos: item.itemsVendidos,
        cantidadTotal: item.cantidadTotal,
        ingresos: item.ingresos,
        porcentajeTotal: ingresoTotal > 0
          ? ((item.ingresos / ingresoTotal) * 100).toFixed(2)
          : '0.00'
      }
    ))
  }

  async crearVenta ({ body, usuarioId, io }) {
    const { clienteNombre, nroMesa, estado, detalle, tipo, observaciones, fechaReserva } = body
    const transaction = await sequelize.transaction()
    try {
      const venta = await this.modeloVenta.create({
        clienteNombre,
        nroMesa,
        estado,
        tipo,
        observaciones,
        fechaReserva,
        usuarioId
      }, { transaction })

      await this.validarYActualizarStock(detalle, transaction)
      // generamos el detalle de la venta
      const { detalleVentaMap, total } = await this.generarDetalleVenta(detalle, venta.id, transaction)
      // guardamos el detalle de la venta
      await this.modeloDetalle.bulkCreate(await Promise.all(detalleVentaMap), { transaction })
      const codigo = this.generarCodigoVenta(venta.id)
      await venta.update({ total, codigo }, { transaction })
      await transaction.commit()
      if (io) {
        io.emit('ventaCreada', {
          ventaId: venta.id,
          codigo,
          mesa: nroMesa,
          cliente: clienteNombre,
          total
        })
      }
      await this.imprimirTicketCocina({ ventaId: venta.id })
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async generarDetalleVenta (detalle, ventaId, transaction) {
    const productosBd = await this.modeloProducto.findAll({
      where: { id: detalle.map(producto => producto.productoId) },
      transaction
    })

    let total = 0

    const detalleVentaMap = detalle.map(item => {
      const producto = productosBd.find(p => p.id === item.productoId)
      if (!producto) {
        throw new Error(`Producto con ID ${item.productoId} no encontrado`)
      }
      const subtotal = producto.precio * item.cantidad
      total += subtotal

      return {
        ventaId,
        productoId: item.productoId,
        cantidad: item.cantidad,
        subtotal,
        precioUnitario: producto.precio,
        observaciones: item.observaciones || ''
      }
    })
    return { detalleVentaMap, total }
  }

  generarCodigoVenta (id) {
    const fecha = new Date()
    // Venta-dia-mes-anio-numeroDeVentasHoy
    const day = fecha.getDate().toString()
    const year = fecha.getFullYear().toString().slice(-2)
    const month = (fecha.getMonth() + 1).toString()
    return `VE-${day}${month}${year}-${id.toString().padStart(4, '0') || '0001'}`
  }

  async validarYActualizarStock (detalle, transaction) {
    detalle.sort((a, b) => a.productoId - b.productoId)
    for (const item of detalle) {
      const stock = await this.modeloStock.findOne({
        where: { productoId: item.productoId },
        lock: transaction.LOCK.UPDATE,
        include: [{
          model: this.modeloProducto,
          attributes: ['nombre']
        }],
        transaction
      })
      if (!stock) {
        throw new ProductoSinStockError(item.productoId)
      }
      if (stock.cantidad < item.cantidad) {
        throw new StockInsuficienteError(stock.Producto?.nombre || `Producto ID ${item.productoId}`, stock.cantidad, item.cantidad
        )
      }
      await stock.decrement('cantidad', { by: item.cantidad, transaction })
    }
  }

  async agregarProductoAVenta ({ body, ventaId, io }) {
    const transaction = await sequelize.transaction()
    const { detalle } = body
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, { transaction })

      if (['CANCELADO', 'PAGADO', 'LISTO'].includes(venta.estado)) {
        throw new VentaErrorComun('No se puede agregar productos a esta venta')
      }

      if (!venta) {
        await transaction.rollback()
        throw new VentaSearchError(`Venta con ID ${ventaId} no encontrada`)
      }
      await this.validarYActualizarStock(detalle, transaction)

      const { detalleVentaMap, total } = await this.generarDetalleVenta(detalle, venta.id, transaction)

      await this.modeloDetalle.bulkCreate(await Promise.all(detalleVentaMap), { transaction })
      await venta.increment('total', { by: total, transaction })
      await transaction.commit()
      if (io) {
        io.emit('productoAgregadoAVenta', {
          ventaId: venta.id,
          codigo: venta.codigo,
          mesa: venta.nroMesa,
          cliente: venta.clienteNombre,
          total: venta.total
        })
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async obtenerVentaId ({ ventaId }) {
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        include: [{
          model: this.modeloDetalle,
          include: [{
            model: this.modeloProducto,
            attributes: ['nombre']
          }]
        }]
      })
      if (!venta) {
        throw new VentaSearchError(`Venta con ID ${ventaId} no encontrada`)
      }
      const fecha = venta.createdAt.toLocaleDateString('es-BO')
      const hora = venta.createdAt.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
      })
      const ventasFormateadas = {
        codigo: venta.codigo,
        nroMesa: venta.nroMesa,
        clienteNombre: venta.clienteNombre ?? '',
        total: venta.total,
        estado: venta.estado,
        total_items: venta.DetallePedidos.length ?? 0,
        productos: Object.values(dataAgrupada(venta.DetallePedidos)),
        observaciones: venta.observaciones ?? '',
        fecha,
        hora
      }
      function dataAgrupada (detalle) {
        return detalle.reduce((acc, item) => {
          const id = item.productoId
          if (!acc[id]) {
            acc[id] = {
              productoId: id,
              nombre: item.Producto?.nombre,
              cantidad: 0,
              subtotal: 0,
              precioUnitario: Number(item.precioUnitario)
            }
          }
          acc[id].cantidad += item.cantidad
          acc[id].subtotal += Number(item.subtotal)
          return acc
        }, {})
      }

      return ventasFormateadas
    } catch (error) {
      throw new VentaSearchError(error.message)
    }
  }

  async imprimirVenta ({ ventaId, metodoPago }) {
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        attributes: ['id', 'codigo', 'nroMesa', 'clienteNombre', 'total', 'createdAt'],
        include: [{
          model: this.modeloDetalle,
          attributes: ['cantidad', 'subtotal', 'precioUnitario'],
          include: [{
            model: this.modeloProducto,
            attributes: ['nombre']
          }]
        }, {
          model: this.modeloUsuario,
          attributes: ['nombre']
        }]
      })
      const fecha = venta.createdAt.toLocaleDateString('es-BO')
      const hora = venta.createdAt.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
      })
      const DtoVenta = {
        codigo: venta.codigo,
        mesa: venta.nroMesa,
        cliente: venta.clienteNombre || 'Consumidor Final',
        mesero: venta.Usuario?.nombre || 'Desconocido',
        fecha,
        hora,
        total: Number(venta.total),
        metodoPago: metodoPago || 'No especificado',
        items: venta.DetallePedidos.map(item => ({
          nombre: item.Producto?.nombre || 'Producto Desconocido',
          cantidad: Number(item.cantidad),
          subtotal: Number(item.subtotal),
          precioUnitario: Number(item.precioUnitario)
        }))
      }
      return await this.impresora.imprimirVenta(DtoVenta)
    } catch (error) {
      throw new Error('Error al imprimir la venta: ' + error.message)
    }
  }

  async imprimirTicketCocina ({ ventaId }) {
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        attributes: ['codigo', 'nroMesa', 'clienteNombre', 'createdAt'],
        include: [{
          model: this.modeloDetalle,
          attributes: ['cantidad', 'observaciones'],
          include: [{
            model: this.modeloProducto,
            attributes: ['nombre']
          }]
        }, {
          model: this.modeloUsuario,
          attributes: ['nombre']
        }]
      })
      const fecha = venta.createdAt.toLocaleDateString('es-BO')
      const hora = venta.createdAt.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit'
      })
      const DtoTicketCocina = {
        codigo: venta.codigo,
        mesa: venta.nroMesa,
        cliente: venta.clienteNombre || 'Sin nombre',
        mesero: venta.Usuario?.nombre || 'Desconocido',
        fecha,
        hora,
        items: venta.DetallePedidos.map(item => ({
          nombre: item.Producto?.nombre || 'Producto Desconocido',
          cantidad: Number(item.cantidad),
          observaciones: item.observaciones || null
        }))
      }
      return await this.impresora.imprimirTicketCocina(DtoTicketCocina)
    } catch (error) {
      throw new VentaErrorComun('Error al imprimir el ticket de cocina: ' + error.message)
    }
  }
}
