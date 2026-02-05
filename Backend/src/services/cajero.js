import { VentaErrorComun, CajaErrorComun } from '../errors/index.js'
import { sequelize } from '../model/index.js'

export class CajeroServicio {
  constructor ({ ventasAdminServicio, modeloVenta, modeloPago, modeloCajaSesion, modeloUsuario }) {
    this.ventasAdminServicio = ventasAdminServicio
    this.modeloVenta = modeloVenta
    this.modeloPago = modeloPago
    this.modeloCajaSesion = modeloCajaSesion
    this.modeloUsuario = modeloUsuario
  }

  // abrir caja
  async abrirCaja ({ body, usuarioId }) {
    const { montoInicial } = body

    const transaction = await sequelize.transaction()
    try {
      // 1. Verificar que el usuario exista y sea cajero/admin
      const usuario = await this.modeloUsuario.findByPk(usuarioId, { transaction })
      if (!usuario) {
        throw new CajaErrorComun('Usuario no encontrado')
      }

      if (!['CAJERO', 'ADMINISTRADOR'].includes(usuario.rol)) {
        throw new CajaErrorComun('Solo cajeros o administradores pueden abrir caja')
      }

      // 2. Verificar si ya tiene una caja abierta
      const cajaAbierta = await this.modeloCajaSesion.findOne({
        where: {
          usuarioId,
          estado: 'ABIERTA'
        },
        transaction
      })

      if (cajaAbierta) {
        throw new CajaErrorComun('Ya tienes una caja abierta. Debes cerrarla primero.')
      }

      // 3. Crear la nueva sesión de caja
      const nuevaCaja = await this.modeloCajaSesion.create({
        usuarioId,
        montoInicial: parseFloat(montoInicial) || 0.00,
        estado: 'ABIERTA'
      }, { transaction })

      await transaction.commit()

      return {
        mensaje: 'Caja abierta exitosamente',
        caja: {
          id: nuevaCaja.id,
          fechaApertura: nuevaCaja.fechaApertura,
          montoInicial: nuevaCaja.montoInicial,
          estado: nuevaCaja.estado
        }
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // realizar cierre de caja
  async cerrarCaja ({ body, usuarioId }) {
    const { montoFinalEfectivo, montoFinalQR, observaciones } = body

    const transaction = await sequelize.transaction()
    try {
      // no se permite cerrar caja con pedidos pendientes
      const ventasPendientes = await this.modeloVenta.count({ where: { estado: 'PENDIENTE' } }, { transaction })
      if (ventasPendientes > 0) {
        throw new CajaErrorComun('No se puede cerrar la caja con ventas pendientes')
      }
      // 1. Buscar la caja abierta del usuario
      const caja = await this.modeloCajaSesion.findOne({
        where: {
          usuarioId,
          estado: 'ABIERTA'
        },
        transaction
      })

      if (!caja) {
        throw new CajaErrorComun('No tienes una caja abierta para cerrar')
      }

      // 2. Calcular totales teóricos de los pagos
      const pagos = await this.modeloPago.findAll({
        where: { cajaSesionId: caja.id },
        attributes: [
          'metodoPago',
          [sequelize.fn('SUM', sequelize.col('monto')), 'total']
        ],
        group: ['metodoPago'],
        raw: true,
        transaction
      })

      let montoTeoricoEfectivo = 0
      let montoTeoricoQR = 0

      pagos.forEach(pago => {
        const total = parseFloat(pago.total) || 0
        if (pago.metodoPago === 'EFECTIVO') {
          montoTeoricoEfectivo = total
        } else if (pago.metodoPago === 'QR') {
          montoTeoricoQR = total
        }
      })

      // 3. Calcular diferencias
      const diferenciaEfectivo = parseFloat(montoFinalEfectivo || 0) - (montoTeoricoEfectivo + parseFloat(caja.montoInicial))
      const diferenciaQR = parseFloat(montoFinalQR || 0) - montoTeoricoQR

      // 4. Actualizar la caja
      await caja.update({
        fechaCierre: new Date(),
        montoFinalEfectivo: parseFloat(montoFinalEfectivo || 0),
        montoFinalQR: parseFloat(montoFinalQR || 0),
        montoTeoricoEfectivo,
        montoTeoricoQR,
        estado: 'CERRADA',
        observaciones: observaciones || `Cierre de caja. Diferencias: Efectivo: ${diferenciaEfectivo.toFixed(2)}, QR: ${diferenciaQR.toFixed(2)}`
      }, { transaction })

      // 5. Obtener datos completos para la respuesta
      const cajaActualizada = await this.modeloCajaSesion.findByPk(caja.id, {
        include: [
          {
            model: this.modeloUsuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'rol']
          }
        ],
        transaction
      })

      await transaction.commit()

      return {
        mensaje: 'Caja cerrada exitosamente',
        caja: cajaActualizada,
        resumen: {
          montoInicial: caja.montoInicial,
          totalEfectivoTeorico: montoTeoricoEfectivo,
          totalQRTeorico: montoTeoricoQR,
          diferenciaEfectivo,
          diferenciaQR
        }
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // registrar pago parcial o completo de una venta
  async registrarPago ({ body, usuarioId, io }) {
    const { ventaId, metodoPago } = body
    const transaction = await sequelize.transaction()
    try {
      // Verificar que el usuario tenga una caja abierta
      const cajaActiva = await this.modeloCajaSesion.findOne({
        where: {
          usuarioId,
          estado: 'ABIERTA'
        },
        transaction
      })

      if (!cajaActiva) {
        throw new CajaErrorComun('No tienes una caja abierta. Debes abrir caja primero.')
      }
      // Verificar que la venta exista
      const venta = await this.modeloVenta.findByPk(ventaId, { transaction })
      if (!venta) {
        throw new VentaErrorComun('Venta no encontrada')
      }

      // verificar que la venta no esté cancelada o anulada
      if (['PAGADO', 'CANCELADO'].includes(venta.estado)) {
        throw new VentaErrorComun(`No se puede registrar pago en una venta con estado ${venta.estado}`)
      }
      if (!['EFECTIVO', 'QR'].includes(metodoPago)) {
        throw new VentaErrorComun('Método de pago no válido')
      }
      // Registrar el pago
      const totalVentaBd = parseFloat(venta.total)
      await this.modeloPago.create({
        ventaId,
        metodoPago,
        monto: totalVentaBd,
        cajaSesionId: cajaActiva.id
      }, { transaction })
      // actualizar el estado de la venta a PAGADO
      await transaction.commit()
      await this.ventasAdminServicio.cambiarEstadoVenta({ ventaId, body: { nuevoEstado: 'PAGADO' }, io })
      return { mensaje: 'Pago registrado exitosamente' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async obtenerCajaAbierta ({ usuarioId }) {
    try {
      const caja = await this.modeloCajaSesion.findOne({
        where: {
          usuarioId,
          estado: 'ABIERTA'
        },
        include: [
          {
            model: this.modeloUsuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'rol']
          }
        ]
      })

      if (!caja) {
        return { tieneCajaAbierta: false }
      }

      // Obtener resumen de pagos
      const pagos = await this.modeloPago.findAll({
        where: { cajaSesionId: caja.id },
        attributes: [
          'metodoPago',
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
          [sequelize.fn('SUM', sequelize.col('monto')), 'total']
        ],
        group: ['metodoPago'],
        raw: true
      })

      // Calcular montos teóricos (igual que en cerrarCaja)
      let montoTeoricoEfectivo = 0
      let montoTeoricoQR = 0

      pagos.forEach(pago => {
        const total = parseFloat(pago.total) || 0
        if (pago.metodoPago === 'EFECTIVO') {
          montoTeoricoEfectivo = total
        } else if (pago.metodoPago === 'QR') {
          montoTeoricoQR = total
        }
      })

      // Actualizar la caja con los montos teóricos
      await caja.update({
        montoTeoricoEfectivo,
        montoTeoricoQR
      })

      // Refrescar la caja para obtener los valores actualizados
      const cajaActualizada = await this.modeloCajaSesion.findByPk(caja.id, {
        include: [
          {
            model: this.modeloUsuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'rol']
          }
        ]
      })

      return {
        tieneCajaAbierta: true,
        caja: cajaActualizada, // ← Ahora sí tiene los teóricos
        resumenPagos: pagos,
        resumen: { // ← Agregar este objeto adicional
          montoTeoricoEfectivo: parseFloat(montoTeoricoEfectivo),
          montoTeoricoQR: parseFloat(montoTeoricoQR),
          totalTeorico: parseFloat(montoTeoricoEfectivo) + parseFloat(montoTeoricoQR)
        }
      }
    } catch (error) {
      throw new CajaErrorComun('Error al obtener la caja abierta')
    }
  }
}
