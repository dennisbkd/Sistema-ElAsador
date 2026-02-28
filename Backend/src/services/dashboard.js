import { Op } from 'sequelize'
import { sequelize } from '../model/index.js'
import { horaFinal, horaInicial } from '../utils/tiempo.js'

export class DashboardServicio {
  constructor ({ modeloVenta, modeloDetalle, modeloProducto, modeloPago, modeloCategoria }) {
    this.modeloVenta = modeloVenta
    this.modeloDetalle = modeloDetalle
    this.modeloProducto = modeloProducto
    this.modeloPago = modeloPago
    this.modeloCategoria = modeloCategoria
    this.cache = {}
  }

  // Limpiar caché después de cierto tiempo
  #limpiarCache (clave) {
    delete this.cache[clave]
  }

  // Obtener del caché con expiración
  #obtenerDelCache (clave, tiempoExpiracion = 30000) { // 30 segundos por defecto
    const item = this.cache[clave]
    if (item && Date.now() - item.timestamp < tiempoExpiracion) {
      return item.data
    }
    delete this.cache[clave]
    return null
  }

  // Guardar en caché
  #guardarEnCache (clave, datos, tiempoExpiracion = 30000) {
    this.cache[clave] = {
      data: datos,
      timestamp: Date.now()
    }
    setTimeout(() => this.#limpiarCache(clave), tiempoExpiracion)
  }

  // 1. Resumen general del día
  async obtenerResumenGeneral () {
    try {
      const cacheKey = 'resumen_general'
      const cacheado = this.#obtenerDelCache(cacheKey)
      if (cacheado) return cacheado
      // Consultas paralelas para mejor rendimiento
      const [ventasDeldia, resumenVentas, pedidosActivos, pedidosPendientes, pedidosListos] = await Promise.all([
        this.modeloVenta.findAll({
          attributes: ['total'],
          where: {
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          },
          raw: true
        }),
        this.modeloVenta.findAll({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('total')), 'totalVentas'],
            [sequelize.fn('AVG', sequelize.col('total')), 'ticketPromedio'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'totalPedidos']
          ],
          where: {
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          },
          raw: true
        }),
        this.modeloVenta.count({
          where: {
            estado: {
              [Op.in]: ['PENDIENTE', 'LISTO']
            },
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          }
        }),
        this.modeloVenta.count({
          where: {
            estado: 'PENDIENTE',
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          }
        }),
        this.modeloVenta.count({
          where: {
            estado: 'LISTO',
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          }
        })
      ])

      const resumen = {
        ventasDelDia: ventasDeldia.reduce((sum, v) => sum + parseFloat(v.total), 0),
        totalPedidos: resumenVentas[0]?.totalPedidos || 0,
        pedidosActivos,
        pedidosPendientes,
        pedidosListos,
        ticketPromedio: parseFloat(resumenVentas[0]?.ticketPromedio || 0)
      }

      this.#guardarEnCache(cacheKey, resumen)
      return resumen
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 2. Ventas agrupadas por hora del día
  async obtenerVentasPorHora () {
    try {
      const cacheKey = 'ventas_por_hora'
      const cacheado = this.#obtenerDelCache(cacheKey)
      if (cacheado) return cacheado

      const ventasPorHora = await this.modeloVenta.findAll({
        attributes: [
          [sequelize.fn('HOUR', sequelize.col('createdAt')), 'hora'],
          [sequelize.fn('SUM', sequelize.col('total')), 'total'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidadPedidos']
        ],
        where: {
          createdAt: {
            [Op.gte]: horaInicial,
            [Op.lt]: horaFinal
          }
        },
        group: [sequelize.fn('HOUR', sequelize.col('createdAt'))],
        order: [[sequelize.fn('HOUR', sequelize.col('createdAt')), 'ASC']],
        raw: true
      })

      // Rellenar horas sin ventas con 0
      const horasCompletas = []
      for (let i = 0; i < 24; i++) {
        const horaStr = String(i).padStart(2, '0') + ':00'
        const venta = ventasPorHora.find(v => v.hora === i)
        horasCompletas.push({
          hour: horaStr,
          total: parseFloat(venta?.total || 0),
          cantidadPedidos: venta?.cantidadPedidos || 0
        })
      }

      this.#guardarEnCache(cacheKey, horasCompletas)
      return horasCompletas
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 3. Productos más vendidos
  async obtenerProductosMasVendidos (limite = 10) {
    try {
      const cacheKey = `productos_top_${limite}`
      const cacheado = this.#obtenerDelCache(cacheKey)
      if (cacheado) return cacheado

      const productosMasVendidos = await this.modeloDetalle.findAll({
        attributes: [
          [sequelize.col('Producto.id'), 'productoId'],
          [sequelize.col('Producto.nombre'), 'nombre'],
          [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidadVendida'],
          [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalGenerado']
        ],
        include: [
          {
            model: this.modeloProducto,
            attributes: [],
            required: true
          }
        ],
        where: {
          createdAt: {
            [Op.gte]: horaInicial,
            [Op.lt]: horaFinal
          }
        },
        group: [sequelize.col('Producto.id'), sequelize.col('Producto.nombre')],
        order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
        limit: limite,
        raw: true
      })

      const resultado = productosMasVendidos.map(p => ({
        productoId: p.productoId,
        nombre: p.nombre,
        cantidadVendida: p.cantidadVendida || 0,
        totalGenerado: parseFloat(p.totalGenerado || 0)
      }))

      this.#guardarEnCache(cacheKey, resultado)
      return resultado
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 4. Pedidos en tiempo real agrupados por estado
  async obtenerPedidosEnTiempoReal () {
    try {
      const cacheKey = 'pedidos_tiempo_real'
      const cacheado = this.#obtenerDelCache(cacheKey, 15000) // 15 segundos
      if (cacheado) return cacheado

      const pedidosPorEstado = await this.modeloVenta.findAll({
        attributes: [
          'id',
          'codigo',
          'nroMesa',
          'clienteNombre',
          'estado',
          'total',
          'createdAt'
        ],
        where: {
          createdAt: {
            [Op.gte]: horaInicial,
            [Op.lt]: horaFinal
          }
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })

      // Agrupar por estado
      const agrupado = {
        PENDIENTE: [],
        LISTO: [],
        PAGADO: [],
        CANCELADO: []
      }

      pedidosPorEstado.forEach(pedido => {
        if (agrupado[pedido.estado]) {
          agrupado[pedido.estado].push({
            id: pedido.id,
            codigo: pedido.codigo,
            mesa: pedido.nroMesa,
            cliente: pedido.clienteNombre,
            total: parseFloat(pedido.total),
            timestamp: pedido.createdAt
          })
        }
      })

      const resultado = {
        PENDIENTE: agrupado.PENDIENTE,
        LISTO: agrupado.LISTO,
        PAGADO: agrupado.PAGADO,
        CANCELADO: agrupado.CANCELADO,
        total: {
          PENDIENTE: agrupado.PENDIENTE.length,
          LISTO: agrupado.LISTO.length,
          PAGADO: agrupado.PAGADO.length,
          CANCELADO: agrupado.CANCELADO.length
        }
      }

      this.#guardarEnCache(cacheKey, resultado)
      return resultado
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 5. Actividad reciente (últimos cambios)
  async obtenerActividadReciente (limite = 20) {
    try {
      const cacheKey = `actividad_reciente_${limite}`
      const cacheado = this.#obtenerDelCache(cacheKey, 20000) // 20 segundos
      if (cacheado) return cacheado

      const [ventasRecientes, pagosRecientes] = await Promise.all([
        this.modeloVenta.findAll({
          attributes: ['id', 'codigo', 'estado', 'total', 'createdAt'],
          where: {
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          },
          order: [['createdAt', 'DESC']],
          limit: limite,
          raw: true
        }),
        this.modeloPago.findAll({
          attributes: ['id', 'ventaId', 'monto', 'metodoPago', 'createdAt'],
          where: {
            createdAt: {
              [Op.gte]: horaInicial,
              [Op.lt]: horaFinal
            }
          },
          order: [['createdAt', 'DESC']],
          limit: limite,
          raw: true
        })
      ])

      // Combinar y ordenar por fecha descendente
      const actividad = [
        ...ventasRecientes.map(v => ({
          tipo: 'VENTA',
          id: v.id,
          referencia: v.codigo,
          estado: v.estado,
          monto: parseFloat(v.total),
          timestamp: v.createdAt
        })),
        ...pagosRecientes.map(p => ({
          tipo: 'PAGO',
          id: p.id,
          referencia: `Pago #${p.id}`,
          ventaId: p.ventaId,
          metodoPago: p.metodoPago,
          monto: parseFloat(p.monto),
          timestamp: p.createdAt
        }))
      ]

      const resultado = actividad
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limite)

      this.#guardarEnCache(cacheKey, resultado)
      return resultado
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 6. Ventas agrupadas por tipo (NORMAL, LLEVAR, RESERVA)
  async obtenerVentasPorTipo () {
    try {
      const cacheKey = 'ventas_por_tipo'
      const cacheado = this.#obtenerDelCache(cacheKey)
      if (cacheado) return cacheado

      const ventasPorTipo = await this.modeloVenta.findAll({
        attributes: [
          'tipo',
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        where: {
          createdAt: {
            [Op.gte]: horaInicial,
            [Op.lt]: horaFinal
          }
        },
        group: ['tipo'],
        raw: true
      })

      // Estructura con todos los tipos
      const resultado = {
        NORMAL: { cantidad: 0, total: 0 },
        LLEVAR: { cantidad: 0, total: 0 },
        RESERVA: { cantidad: 0, total: 0 }
      }

      ventasPorTipo.forEach(v => {
        resultado[v.tipo] = {
          cantidad: parseInt(v.cantidad) || 0,
          total: parseFloat(v.total) || 0
        }
      })

      this.#guardarEnCache(cacheKey, resultado)
      return resultado
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // 7. Ventas agrupadas por estado (PENDIENTE, LISTO, CANCELADO, PAGADO)
  async obtenerVentasPorEstado () {
    try {
      const cacheKey = 'ventas_por_estado'
      const cacheado = this.#obtenerDelCache(cacheKey, 15000) // 15 segundos
      if (cacheado) return cacheado

      const ventasPorEstado = await this.modeloVenta.findAll({
        attributes: [
          'estado',
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        where: {
          createdAt: {
            [Op.gte]: horaInicial,
            [Op.lt]: horaFinal
          }
        },
        group: ['estado'],
        raw: true
      })

      // Estructura con todos los estados
      const resultado = {
        PENDIENTE: { cantidad: 0, total: 0 },
        LISTO: { cantidad: 0, total: 0 },
        CANCELADO: { cantidad: 0, total: 0 },
        PAGADO: { cantidad: 0, total: 0 }
      }

      ventasPorEstado.forEach(v => {
        resultado[v.estado] = {
          cantidad: parseInt(v.cantidad) || 0,
          total: parseFloat(v.total) || 0
        }
      })

      this.#guardarEnCache(cacheKey, resultado)
      return resultado
    } catch (error) {
      return { error: error.message, statusError: 500 }
    }
  }

  // Método auxiliar para invalidar caché
  invalidarCache () {
    this.cache = {}
  }
}
