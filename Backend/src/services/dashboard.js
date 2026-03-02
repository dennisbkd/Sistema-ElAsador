import { Op } from 'sequelize'
import PDFDocument from 'pdfkit'
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
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

  #obtenerRangoFechas ({ fechaInicio, fechaFin }) {
    const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : horaInicial
    const fin = fechaFin ? new Date(`${fechaFin}T23:59:59.999`) : horaFinal

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      throw new Error('Las fechas enviadas no son válidas. Usa el formato YYYY-MM-DD')
    }

    if (inicio > fin) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha fin')
    }

    return { inicio, fin }
  }

  #construirFilasReporte (categorias) {
    return categorias.flatMap(categoria =>
      categoria.productos.map(producto => ({
        categoria: categoria.categoria,
        producto: producto.nombre,
        cantidadVendida: producto.cantidadVendida,
        precioUnitario: producto.precioUnitario,
        totalProducto: producto.totalProducto
      }))
    )
  }

  async obtenerReporteVentas ({ fechaInicio, fechaFin } = {}) {
    try {
      const { inicio, fin } = this.#obtenerRangoFechas({ fechaInicio, fechaFin })

      const whereVentas = {
        createdAt: {
          [Op.gte]: inicio,
          [Op.lte]: fin
        },
        estado: {
          [Op.ne]: 'CANCELADO'
        }
      }

      const [resumenVentas, detallePorProducto] = await Promise.all([
        this.modeloVenta.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('total')), 'totalVentas']
          ],
          where: whereVentas,
          raw: true
        }),
        this.modeloDetalle.findAll({
          attributes: [
            [sequelize.col('Producto.categoria.id'), 'categoriaId'],
            [sequelize.col('Producto.categoria.nombre'), 'categoriaNombre'],
            [sequelize.col('Producto.id'), 'productoId'],
            [sequelize.col('Producto.nombre'), 'productoNombre'],
            [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidadVendida'],
            [sequelize.fn('AVG', sequelize.col('precioUnitario')), 'precioUnitario'],
            [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalProducto']
          ],
          include: [
            {
              model: this.modeloProducto,
              attributes: [],
              required: true,
              include: [
                {
                  model: this.modeloCategoria,
                  as: 'categoria',
                  attributes: [],
                  required: true
                }
              ]
            },
            {
              model: this.modeloVenta,
              attributes: [],
              required: true,
              where: whereVentas
            }
          ],
          group: [
            sequelize.col('Producto.categoria.id'),
            sequelize.col('Producto.categoria.nombre'),
            sequelize.col('Producto.id'),
            sequelize.col('Producto.nombre')
          ],
          order: [
            [sequelize.col('Producto.categoria.nombre'), 'ASC'],
            [sequelize.col('Producto.nombre'), 'ASC']
          ],
          raw: true
        })
      ])

      const categoriasMap = detallePorProducto.reduce((acc, item) => {
        const categoriaId = item.categoriaId
        const categoriaNombre = item.categoriaNombre || 'Sin categoría'
        if (!acc[categoriaId]) {
          acc[categoriaId] = {
            categoriaId,
            categoria: categoriaNombre,
            totalCategoria: 0,
            productos: []
          }
        }

        const producto = {
          productoId: Number(item.productoId),
          nombre: item.productoNombre,
          cantidadVendida: Number(item.cantidadVendida || 0),
          precioUnitario: Number(parseFloat(item.precioUnitario || 0).toFixed(2)),
          totalProducto: Number(parseFloat(item.totalProducto || 0).toFixed(2))
        }

        acc[categoriaId].productos.push(producto)
        acc[categoriaId].totalCategoria += producto.totalProducto
        return acc
      }, {})

      const categorias = Object.values(categoriasMap).map(categoria => ({
        ...categoria,
        totalCategoria: Number(categoria.totalCategoria.toFixed(2))
      }))

      return {
        periodo: {
          fechaInicio: inicio.toISOString(),
          fechaFin: fin.toISOString()
        },
        resumen: {
          totalVentas: Number(parseFloat(resumenVentas?.totalVentas || 0).toFixed(2)),
          totalCategorias: categorias.length,
          totalProductos: categorias.reduce((acc, c) => acc + c.productos.length, 0)
        },
        categorias
      }
    } catch (error) {
      return { error: error.message, statusError: 400 }
    }
  }

  async exportarReporteVentasPDF ({ fechaInicio, fechaFin } = {}) {
    const reporte = await this.obtenerReporteVentas({ fechaInicio, fechaFin })
    if (reporte?.error) {
      return reporte
    }

    const reportesDir = path.join(process.cwd(), 'uploads', 'reportes')
    await fs.promises.mkdir(reportesDir, { recursive: true })
    const fileName = `reporte-ventas-${Date.now()}.pdf`
    const filePath = path.join(reportesDir, fileName)

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' })
      const stream = fs.createWriteStream(filePath)

      doc.pipe(stream)

      const pageWidth = doc.page.width - 80 // Ancho disponible con márgenes
      const colWidths = {
        producto: pageWidth * 0.40,
        cantidad: pageWidth * 0.15,
        precioUnit: pageWidth * 0.20,
        total: pageWidth * 0.25
      }

      // ===== ENCABEZADO =====
      doc.fillColor('#1e40af')
        .fontSize(20)
        .text('REPORTE DE VENTAS', { align: 'center', underline: false })
      doc.fillColor('#000000')

      doc.moveDown(0.5)
      doc.fontSize(10)
        .fillColor('#4b5563')
        .text(`Periodo: ${new Date(reporte.periodo.fechaInicio).toLocaleDateString('es-BO')} - ${new Date(reporte.periodo.fechaFin).toLocaleDateString('es-BO')}`, { align: 'center' })
      doc.fillColor('#000000')

      doc.moveDown(1)

      // ===== RESUMEN GENERAL =====
      const resumenY = doc.y
      doc.roundedRect(40, resumenY, pageWidth, 60, 5)
        .fillAndStroke('#dbeafe', '#93c5fd')

      doc.fillColor('#1e40af')
        .fontSize(12)
        .text('RESUMEN GENERAL', 50, resumenY + 10, { width: pageWidth - 20 })

      doc.fillColor('#000000')
        .fontSize(10)
        .text(`Total Ventas: Bs ${reporte.resumen.totalVentas.toFixed(2)}`, 50, resumenY + 30)
        .text(`Categorías: ${reporte.resumen.totalCategorias}`, 250, resumenY + 30)
        .text(`Productos: ${reporte.resumen.totalProductos}`, 400, resumenY + 30)

      doc.moveDown(3)

      // ===== DETALLE POR CATEGORÍAS =====
      reporte.categorias.forEach((categoria, catIndex) => {
        // Verificar si necesitamos nueva página
        if (doc.y > 700) {
          doc.addPage()
        }

        // FILA DE CATEGORÍA (ancho completo)
        const catY = doc.y
        doc.rect(40, catY, pageWidth, 25)
          .fillAndStroke('#4f46e5', '#4338ca')

        doc.fillColor('#ffffff')
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(categoria.categoria.toUpperCase(), 50, catY + 8, { width: pageWidth * 0.7 })
          .text(`Total: Bs ${categoria.totalCategoria.toFixed(2)}`, 50, catY + 8, { width: pageWidth - 20, align: 'right' })

        doc.font('Helvetica')
        doc.fillColor('#000000')
        doc.moveDown(0.5)

        // ENCABEZADO DE TABLA DE PRODUCTOS
        const headerY = doc.y
        doc.rect(40, headerY, pageWidth, 20)
          .fillAndStroke('#e0e7ff', '#c7d2fe')

        doc.fillColor('#1e40af')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('PRODUCTO', 45, headerY + 6, { width: colWidths.producto })
          .text('CANTIDAD', 45 + colWidths.producto, headerY + 6, { width: colWidths.cantidad, align: 'center' })
          .text('PRECIO UNIT.', 45 + colWidths.producto + colWidths.cantidad, headerY + 6, { width: colWidths.precioUnit, align: 'right' })
          .text('TOTAL', 45 + colWidths.producto + colWidths.cantidad + colWidths.precioUnit, headerY + 6, { width: colWidths.total, align: 'right' })

        doc.font('Helvetica')
        doc.fillColor('#000000')
        doc.moveDown(0.3)

        // FILAS DE PRODUCTOS
        categoria.productos.forEach((producto, prodIndex) => {
          const rowY = doc.y
          const isEven = prodIndex % 2 === 0

          // Alternar color de fondo
          if (isEven) {
            doc.rect(40, rowY, pageWidth, 18)
              .fill('#f9fafb')
          }

          // Bordes de celda
          doc.strokeColor('#e5e7eb')
            .rect(40, rowY, pageWidth, 18)
            .stroke()

          // Contenido de la fila
          doc.fillColor('#374151')
            .fontSize(9)
            .text(producto.nombre, 45, rowY + 5, { width: colWidths.producto - 10 })
            .text(producto.cantidadVendida.toString(), 45 + colWidths.producto, rowY + 5, { width: colWidths.cantidad, align: 'center' })
            .text(`Bs ${producto.precioUnitario.toFixed(2)}`, 45 + colWidths.producto + colWidths.cantidad, rowY + 5, { width: colWidths.precioUnit, align: 'right' })

          doc.fillColor('#000000')
            .font('Helvetica-Bold')
            .text(`Bs ${producto.totalProducto.toFixed(2)}`, 45 + colWidths.producto + colWidths.cantidad + colWidths.precioUnit, rowY + 5, { width: colWidths.total - 10, align: 'right' })

          doc.font('Helvetica')
          doc.fillColor('#000000')
          doc.strokeColor('#000000')
          doc.moveDown(0.3)
        })

        doc.moveDown(1)
      })

      // ===== PIE DE PÁGINA =====
      doc.moveDown(2)
      doc.fontSize(8)
        .fillColor('#6b7280')
        .text(`Generado el ${new Date().toLocaleDateString('es-BO')} a las ${new Date().toLocaleTimeString('es-BO')}`, { align: 'center' })
        .text('Sistema El Asador', { align: 'center' })

      doc.end()

      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    return { filePath, fileName, mimeType: 'application/pdf' }
  }

  async exportarReporteVentasExcel ({ fechaInicio, fechaFin } = {}) {
    const reporte = await this.obtenerReporteVentas({ fechaInicio, fechaFin })
    if (reporte?.error) {
      return reporte
    }

    const reportesDir = path.join(process.cwd(), 'uploads', 'reportes')
    await fs.promises.mkdir(reportesDir, { recursive: true })
    const fileName = `reporte-ventas-${Date.now()}.xlsx`
    const filePath = path.join(reportesDir, fileName)

    const filas = this.#construirFilasReporte(reporte.categorias)

    const hojaResumen = XLSX.utils.json_to_sheet([
      {
        fechaInicio: new Date(reporte.periodo.fechaInicio).toLocaleDateString('es-BO'),
        fechaFin: new Date(reporte.periodo.fechaFin).toLocaleDateString('es-BO'),
        totalVentas: reporte.resumen.totalVentas,
        totalCategorias: reporte.resumen.totalCategorias,
        totalProductos: reporte.resumen.totalProductos
      }
    ])

    const hojaDetalle = XLSX.utils.json_to_sheet(
      filas.length > 0
        ? filas
        : [{
            categoria: 'Sin datos',
            producto: 'Sin ventas',
            cantidadVendida: 0,
            precioUnitario: 0,
            totalProducto: 0
          }]
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, hojaResumen, 'Resumen')
    XLSX.utils.book_append_sheet(workbook, hojaDetalle, 'Detalle')
    XLSX.writeFile(workbook, filePath)

    return {
      filePath,
      fileName,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }

  // Método auxiliar para invalidar caché
  invalidarCache () {
    this.cache = {}
  }
}
