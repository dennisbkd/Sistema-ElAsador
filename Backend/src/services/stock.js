import { Op } from 'sequelize'
import { sequelize } from '../model/index.js'
import { horaFinal, horaInicial } from '../utils/tiempo.js'

export class StockServicio {
  constructor ({ modelStock, modelProducto, modelCategoria, modelUsuario, modelMovimientoS }) {
    this.modelStock = modelStock
    this.modelProducto = modelProducto
    this.modelCategoria = modelCategoria
    this.modelUsuario = modelUsuario
    this.modelMovimientoS = modelMovimientoS
  }

  obtenerEstadoStock = async () => {
    try {
      const resultados = await this.modelStock.findAll({
        attributes: [
          'cantidad',
          'cantidadMinima',
          [sequelize.literal(`CASE 
          WHEN StockPlato.cantidad = 0 THEN 'AGOTADO'
          WHEN StockPlato.cantidad <= StockPlato.cantidadMinima THEN 'CRÍTICO'
          WHEN StockPlato.cantidad <= StockPlato.cantidadMinima * 2 THEN 'BAJO'
          ELSE 'NORMAL'
        END`), 'estado']
        ],
        include: [
          {
            model: this.modelProducto,
            attributes: ['nombre'],
            include: [
              {
                model: this.modelCategoria,
                attributes: ['nombre']
              }
            ]
          }
        ],
        order: [
          [sequelize.literal(`CASE 
          WHEN StockPlato.cantidad = 0 THEN 1
          WHEN StockPlato.cantidad <= StockPlato.cantidadMinima THEN 2
          WHEN StockPlato.cantidad <= StockPlato.cantidadMinima * 2 THEN 3
          ELSE 4
        END`), 'ASC'],
          ['cantidad', 'ASC']
        ],
        raw: true,
        nest: true
      })
      const datosTransformado = resultados.map((item) => (
        {
          producto: item.Producto.nombre,
          categoria: item.Producto.Categorium.nombre,
          stockActual: item.cantidad ?? 0,
          stockMinimo: item.cantidadMinima ?? 0,
          estado: item.estado
        }
      ))

      return datosTransformado
    } catch (error) {
      return { error: 'error al obtener la consulta del stock' + error.message }
    }
  }

  movimientoStock = async () => {
    try {
      const movimientos = await this.modelMovimientoS.findAll({
        attributes: [
          'tipo',
          'cantidad',
          'cantidadAnterior',
          'cantidadNueva',
          'motivo',
          'createdAt'
        ],
        include: [
          {
            model: this.modelProducto,
            attributes: ['nombre'],
            required: true
          },
          {
            model: this.modelUsuario,
            attributes: ['nombre'],
            required: true
          }
        ],
        where: {
          createdAt: {
            [Op.between]: [horaInicial, horaFinal]
          }
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      const datosTransformado = this.agruparPorHoraYUsuario(movimientos)
      return datosTransformado
    } catch (error) {
      return { error: 'error al consultar con el movimiento del Stock' + error.message }
    }
  }

  agruparPorHoraYUsuario = (data) => {
    const agrupado = data.reduce((acc, item) => {
      const hora = new Date(item.createdAt).toISOString().substring(11, 16)
      const clave = `${hora}-${item.Usuario.nombre}` // clave única por hora y usuario

      if (!acc[clave]) {
        acc[clave] = {
          usuario: item.Usuario.nombre,
          tipo: item.tipo,
          motivo: item.motivo,
          createdAt: item.createdAt,
          Detalle: [{
            producto: item.Producto.nombre,
            cantidad: item.cantidad,
            cantidadAnterior: item.cantidadAnterior,
            cantidadNueva: item.cantidadNueva
          }]
        }
      } else {
        const existente = acc[clave].Detalle.find(d => d.producto === item.Producto.nombre)
        if (existente) {
          existente.cantidad += item.cantidad
          existente.cantidadNueva = item.cantidadNueva
        }
        acc[clave].Detalle.push({
          producto: item.Producto.nombre,
          cantidad: item.cantidad,
          cantidadAnterior: item.cantidadAnterior,
          cantidadNueva: item.cantidadNueva
        })
      }

      return acc
    }, {})

    return Object.values(agrupado)
  }
}
