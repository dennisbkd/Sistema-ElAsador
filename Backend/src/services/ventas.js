import { Op } from 'sequelize'
export class VentaServicio {
  constructor ({ modeloVenta, modeloDetalle, modeloProducto, modeloCategoria }) {
    this.modeloVenta = modeloVenta
    this.modeloDetalle = modeloDetalle
    this.modeloProducto = modeloProducto
    this.modeloCategoria = modeloCategoria
  }

  ventasDelDiaDetallados = async () => {
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
                attributes: ['nombre', 'id']
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

  ventasDelDiaDetallado = async () => {
    try {
      // 1. Primero obtener las ventas del día
      const ventasHoy = await this.modeloVenta.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(new Date().setHours(0, 0, 0, 0)), // Inicio del día
              new Date(new Date().setHours(23, 59, 59, 999)) // Fin del día
            ]
          }
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
      const ventasFormateadas = ventasHoy.map(venta => ({
        codigo: venta.codigo,
        nroMesa: venta.nroMesa,
        clienteNombre: venta.clienteNombre ?? '',
        total: venta.total,
        estado: venta.estado,
        total_items: venta.DetallePedidos.length ?? 0,
        productos: venta.DetallePedidos.map(dv =>
    `${dv.cantidad}x ${dv.Producto.nombre}`
        ).join(', ') ?? '',
        createdAt: venta.createdAt
      }))

      return ventasFormateadas
    } catch (error) {
      return { error: error.message + 'ss' }
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
}
