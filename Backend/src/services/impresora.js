import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import print from 'pdf-to-printer'

export class ImpresoraServicio {
  constructor () {
    this.pageWidth = 226 // Ancho de página en puntos (80mm)
    this.ticketPath = path.join(process.cwd(), 'ticket.pdf')
    this.isPrinting = false // 🔒 Flag para controlar impresión
    this.printQueue = [] // Cola de impresión
  }

  async imprimirVenta (venta) {
    try {
      await this.generarPDFVenta(venta)
      await this.imprimirPDF()
      console.log('✅ Ticket de venta impreso correctamente')
    } catch (error) {
      console.error('❌ Error al imprimir ticket de venta:', error)
    }
  }

  async imprimirPDF () {
    await print.print(this.ticketPath, {
      silent: true
    })
  }

  async imprimirTicketCocina (venta) {
    try {
      // Si ya se está imprimiendo, agregar a la cola
      if (this.isPrinting) {
        return new Promise((resolve) => {
          this.printQueue.push({ venta, resolve })
        })
      }

      // Bloquear impresora
      this.isPrinting = true

      await this.generarPDFCocina(venta)
      await this.imprimirPDF()
      // Desbloquear y procesar siguiente en cola
      this.isPrinting = false
      this.processNextInQueue()
    } catch (error) {
      console.error('❌ Error al imprimir ticket de cocina:', error)
      this.isPrinting = false
      this.processNextInQueue()
    }
  }

  processNextInQueue () {
    if (this.printQueue.length > 0) {
      const next = this.printQueue.shift()
      setTimeout(() => {
        this.imprimirTicketCocina(next.venta)
          .then(() => next.resolve())
          .catch(() => next.resolve())
      }, 1000) // Esperar 1 segundo entre impresiones
    }
  }

  generarPDFVenta (venta) {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: [226, 1000],
        margins: { top: 5, bottom: 5, left: 5, right: 5 }
      })

      const stream = fs.createWriteStream(this.ticketPath)
      doc.pipe(stream)

      // ===== ENCABEZADO =====
      doc.fontSize(14).text('RESTAURANTE EL ASADOR', { align: 'center' })
      doc.fontSize(9)
        .text('Calle Falsa 123', { align: 'center' })
        .text('Tel: 12345678', { align: 'center' })

      doc.moveDown()
      doc.text('--------------------------------')
      // ===== DETALLES =====
      doc.fontSize(9)
      doc.text(`Venta: ${venta.codigo}`)
      doc.text(`Fecha: ${venta.fecha} ${venta.hora}`)
      doc.text(`Mesero: ${venta.mesero}`)
      doc.text(`Mesa: ${venta.mesa}`)
      doc.moveDown()
      // ===== encabezado cantidad x producto PU,subtotal =====
      // guarda la posicion actual en y
      const y = doc.y
      // Izquierda
      doc.fontSize(12).text('PRODUCTOS', 5, y, {
        width: 140,
        align: 'left'
      })

      // Derecha
      doc.fontSize(12).text('SUBTOTAL', 150, y, {
        width: 75,
        align: 'right'
      })
      doc.moveDown()
      // ===== PRODUCTOS =====
      venta.items.forEach(p => {
        const y = doc.y

        // ===== NOMBRE PRODUCTO (columna izquierda)
        doc
          .fontSize(9)
          .text(p.nombre, 5, y, {
            width: 140,
            align: 'left'
          })

        // ===== SUBTOTAL (columna derecha fija)
        doc
          .fontSize(9)
          .text(`Bs ${p.subtotal.toFixed(2)}`, 150, y, {
            width: 60,
            align: 'right'
          })

        // ===== LINEA CANTIDAD X PRECIO
        doc
          .fontSize(8)
          .text(`${p.cantidad} x Bs ${p.precioUnitario.toFixed(2)}`, 10, doc.y, { align: 'left' })

        doc.moveDown()
      })

      doc.text('--------------------------------', { align: 'center' })

      // ===== TOTAL =====
      doc.fontSize(12)
        .text(`TOTAL Bs ${venta.total.toFixed(2)}`, { align: 'right' })

      doc.moveDown()

      // ===== PIE =====
      doc.fontSize(10)
        .text('Gracias por su compra', { align: 'center' })

      doc.moveDown()
      doc.moveDown()

      doc.end()

      stream.on('finish', resolve)
    })
  }

  // realizar impresion para la parte de la cocina
  generarPDFCocina (venta) {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: [226, 1000],
        margins: { top: 5, bottom: 5, left: 5, right: 5 }
      })
      const stream = fs.createWriteStream(this.ticketPath)
      doc.pipe(stream)
      // ===== CONTENIDO =====
      if (venta.tipo === 'RESERVA') {
        doc.fontSize(14).text('RESERVA COCINA', { align: 'center' })
        doc.text(`Venta: ${venta.codigo}`)
        doc.text(`Cliente: ${venta?.cliente || 'Sin nombre'}`)
        doc.text(`Hora: ${venta.hora}`)
        if (venta.observaciones) {
          doc.text(`Observacion: ${venta.observaciones || 'Sin observaciones'}`)
        }
      }
      if (venta.tipo === 'LLEVAR') {
        doc.fontSize(14).text('PEDIDO PARA LLEVAR', { align: 'center' })
        doc.moveDown()
        doc.fontSize(12)
          .text(`Venta: ${venta.codigo}`)
          .text(`Cliente: ${venta?.cliente || 'Sin nombre'}`)
        doc.text(`Hora: ${venta.hora}`)
        if (venta.observaciones) {
          doc.text(`Observacion: ${venta.observaciones || 'Sin observaciones'}`)
        }
        doc.moveDown()
      }
      if (venta.tipo === 'NORMAL') {
        doc
          .fontSize(14)
          .text('PEDIDO COCINA', { align: 'center' })
        doc.moveDown()
        doc.fontSize(12)
          .text(`Venta: ${venta.codigo}`)
          .text(`Mesa: ${venta.mesa}`)
          .text(`Mesero: ${venta.mesero}`)
        doc.text(`Hora: ${venta.hora}`)
      }
      doc.moveDown()
      doc.text('--------------------------------')
      doc.moveDown()
      const y = doc.y

      // Izquierda
      doc.fontSize(12).text('PRODUCTOS', 5, y, {
        width: 140,
        align: 'left'
      })

      // Derecha
      doc.fontSize(12).text('CANTIDAD', 150, y, {
        width: 70,
        align: 'right'
      })

      doc.moveDown()
      // ===== PRODUCTOS =====
      venta.items.forEach(p => {
        const y = doc.y

        // ===== NOMBRE PRODUCTO (columna izquierda)
        doc
          .fontSize(12)
          .text(p.nombre, 5, y, {
            width: 140,
            align: 'left'
          })

        // ===== CANTIDAD DE PRODUCTOS (columna derecha fija)
        doc
          .fontSize(14)
          .text(` ${p.cantidad}`, 150, y, {
            width: 60,
            align: 'right',
            stroke: true
          })

        // ===== LINEA PARA OBSERVACIONES
        if (p.observaciones) {
          doc.fontSize(10)
            .text(`Obs: ${p.observaciones}`, 10, doc.y, { align: 'left' })
        }

        doc.moveDown()
      })
      doc.moveDown()
      doc.text('------------', { align: 'center' })

      doc.end()

      stream.on('finish', resolve)
    })
  }
}
