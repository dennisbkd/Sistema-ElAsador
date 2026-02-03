import { Op } from 'sequelize'
import { VentaCantidadError, VentaErrorComun, VentaSearchError } from '../errors/index.js'
import { sequelize } from '../model/index.js'
import { horaFinal, horaInicial } from '../utils/tiempo.js'
export class VentasAdminServicio {
  constructor ({
    ventaServicio,
    modeloVenta,
    modeloDetalleVenta,
    modeloProducto,
    modeloStockPlato,
    modeloUsuario
  }) {
    this.ventaServicio = ventaServicio
    this.modeloVenta = modeloVenta
    this.modeloDetalleVenta = modeloDetalleVenta
    this.modeloProducto = modeloProducto
    this.modeloStockPlato = modeloStockPlato
    this.modeloUsuario = modeloUsuario
  }

  async obtenerVentasAdmin ({ filtros, page }) {
    const where = filtros?.filtroEstado && filtros?.filtroEstado !== 'undefined' ? { estado: filtros.filtroEstado } : {}
    where.tipo = filtros?.tipoVenta && filtros?.tipoVenta !== 'undefined' ? filtros.tipoVenta : { [Op.in]: ['NORMAL', 'RESERVA'] }
    try {
      // 1. Primero obtener las ventas del día
      const ventasHoy = await this.modeloVenta.findAll({
        offset: page.offset,
        limit: page.limit,
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
            model: this.modeloDetalleVenta,
            include: [
              {
                model: this.modeloProducto,
                attributes: ['nombre']
              }
            ]
          },
          {
            model: this.modeloUsuario,
            attributes: ['nombre']
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!ventasHoy) return []

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
          mesero: venta.Usuario?.nombre,
          clienteNombre: venta.clienteNombre ?? '',
          total: venta.total,
          tipo: venta.tipo,
          estado: venta.estado,
          total_items: venta.DetallePedidos.length ?? 0,
          observaciones: venta.observaciones ?? '',
          fecha,
          hora
        }
      })
      return ventasFormateadas
    } catch (error) {
      return { error: error.message }
    }
  }

  async obtenerVentaPorId ({ ventaId }) {
    return await this.ventaServicio.obtenerVentaId({ ventaId })
  }

  async agregarProductoAPedidoMesero ({ ventaId, body, io }) {
    return await this.ventaServicio.agregarProductoAVenta({ ventaId, body, io })
  }

  async asignarReservaAMesero ({ ventaId, usuarioId, io }) {
    // Lógica para asignar una reserva a un mesero
    const transaction = await sequelize.transaction()
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, {
        where: { tipo: 'RESERVA' }
      }, { transaction })
      if (!venta) {
        throw new VentaSearchError('Venta no encontrada')
      }
      if (venta.estado === 'CANCELADO') {
        throw new VentaErrorComun('No se puede asignar una reserva que ya fue anulada')
      }
      if (['PAGADO', 'LISTO'].includes(venta.estado)) {
        throw new VentaErrorComun('No se puede asignar una reserva que ya fue pagada o esta lista')
      }
      if (venta.usuarioId === usuarioId) {
        throw new VentaErrorComun('La reserva ya se encuentra asignada a este mesero')
      }
      venta.usuarioId = usuarioId
      await venta.save({ transaction })
      await transaction.commit()
      // notificar al mesero asignado
      if (io) {
        io.to(`usuario_${usuarioId}`).emit('nueva_reserva_asignada', { codigo: venta.codigo, cliente: venta.clienteNombre })
      }
      return { mensaje: 'Reserva asignada al mesero correctamente' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // La funcion se encargara de anular un producto de una venta para casos donde el cliente se arrepiente
  // o el mesero se equivoco al tomar el pedido
  // o cuando se termina un producto que no se puede controlar por stock ej : refrescos o sopas
  // tambien se podra restar la cantidad de un producto en caso de que el cliente haya pedido menos
  // se sirvan cantidades parciales ej: 3 sopas y solo se comen 2
  async anularProductoDeVenta ({ ventaId, body, io }) {
    const { productoId, cantidad, devolverStock } = body
    const transaction = await sequelize.transaction()

    try {
      const venta = await this.modeloVenta.findByPk(ventaId, { transaction })
      if (!venta) throw new VentaSearchError('Venta no encontrada')

      if (['CANCELADO', 'PAGADO', 'LISTO'].includes(venta.estado)) {
        throw new VentaErrorComun('No se puede modificar esta venta')
      }

      // 1️ traer TODOS los detalles del producto
      const detalles = await this.modeloDetalleVenta.findAll({
        where: { ventaId, productoId },
        order: [['createdAt', 'ASC']], // FIFO
        transaction
      })

      if (!detalles.length) {
        throw new VentaSearchError('Producto no encontrado en la venta')
      }

      // 2️ calcular cantidad total
      const cantidadTotal = detalles.reduce(
        (sum, d) => sum + d.cantidad, 0
      )

      if (cantidad > cantidadTotal) {
        throw new VentaCantidadError(
        `Cantidad a anular (${cantidad}) supera lo pedido (${cantidadTotal})`
        )
      }

      let restante = cantidad
      let totalAnulado = 0

      // 3️ eliminar/reducir filas
      for (const detalle of detalles) {
        if (restante <= 0) break

        if (detalle.cantidad <= restante) {
          restante -= Number(detalle.cantidad)
          totalAnulado += Number(detalle.subtotal)
          await detalle.destroy({ transaction })
        } else {
          const precioUnitario = Number(detalle.precioUnitario)
          const cantidad = Number(detalle.cantidad)
          totalAnulado += precioUnitario * restante
          detalle.cantidad -= restante
          detalle.subtotal = cantidad * precioUnitario
          await detalle.save({ transaction })
          restante = 0
        }
      }

      // 4️ ajustar total de la venta
      await venta.decrement('total', {
        by: Number(totalAnulado),
        transaction
      })

      // 5️ devolver stock
      if (devolverStock) {
        const stockPlato = await this.modeloStockPlato.findOne({
          where: { productoId },
          transaction
        })

        if (stockPlato) {
          await stockPlato.increment('cantidad', {
            by: Number(cantidad),
            transaction
          })
        }
      }

      await transaction.commit()
      // fixed: arreglar mas adelante para que notifique al mesero correspondiente
      if (io) {
        io.emit('productoActualizado', { id: productoId, mensaje: devolverStock ? 'Se actualizo el stock' : 'Producto anulado sin devolución de stock' })
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // la funcion se encargara de cambiar el estado a anulado y devolver el stock
  async anularVenta ({ ventaId, io }) {
    // Lógica para anular una venta completa
    const transaction = await sequelize.transaction()
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, { transaction })
      if (!venta) {
        throw new VentaSearchError('Venta no encontrada')
      }
      if (venta.estado === 'CANCELADO') {
        throw new VentaErrorComun('La venta ya se encuentra anulada')
      }
      if (venta.estado === 'PAGADO') {
        throw new VentaErrorComun('No se puede anular una venta que ya fue pagada')
      }
      await venta.update({ estado: 'CANCELADO' }, { transaction })
      // devolver el stock de todos los productos en la venta
      const detallesVenta = await this.modeloDetalleVenta.findAll({
        where: { ventaId },
        transaction
      })

      for (const detalle of detallesVenta) {
        const productoStock = await this.modeloStockPlato.findOne({ where: { productoId: detalle.productoId } }, transaction)

        if (!productoStock) {
          continue
        }

        await productoStock.increment('cantidad', { by: detalle.cantidad, transaction })
        await productoStock.save({ transaction })
      }
      await transaction.commit()
      // FIXED: AGREGAR EL MODELO DE MOTIVO DE LA ANULACION Y NOTIFICAR AL MESERO CORRESPONDIENTE
      if (io) {
        io.emit('productoActualizado', { id: new Date().toISOString(), mensaje: 'Se anulo una venta y se actualizó el stock' })
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // cambiar estado de la venta ya sea de PENDIENTE a LISTO o de LISTO a PAGADO
  async cambiarEstadoVenta ({ ventaId, body, io }) {
    const transaction = await sequelize.transaction()
    try {
      const venta = await this.modeloVenta.findByPk(ventaId, { transaction })
      if (!venta) {
        throw new VentaSearchError('Venta no encontrada')
      }
      if (venta.estado === 'CANCELADO') {
        throw new VentaErrorComun('No se puede cambiar el estado de una venta anulada')
      }
      if (venta.estado === 'PAGADO') {
        throw new VentaErrorComun('No se puede cambiar el estado de una venta pagada')
      }
      venta.estado = body.nuevoEstado
      await venta.save({ transaction })
      await transaction.commit()
      if (io) {
        io.to(`usuario_${venta.usuarioId}`).emit('estado_venta_cambiado', { ventaId: venta.id, nuevoEstado: venta.estado, mesero: venta.usuarioId })
      }
      return venta
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async imprimirComandaCocina ({ ventaId }) {
    return await this.ventaServicio.imprimirTicketCocina({ ventaId })
  }

  async imprimirFacturaVenta ({ ventaId }) {
    return await this.ventaServicio.imprimirVenta({ ventaId })
  }
}
