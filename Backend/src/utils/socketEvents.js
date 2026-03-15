export const SOCKET_EVENTOS = Object.freeze({
  STOCK_ACTUALIZADO: 'stock_actualizado'
})

const normalizarNumero = (valor, fallback = 0) => {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : fallback
}

export const normalizarProductosStock = (productos = []) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    return []
  }

  const productosPorId = new Map()

  for (const producto of productos) {
    const productoId = normalizarNumero(producto?.productoId, NaN)

    if (!Number.isFinite(productoId)) {
      continue
    }

    productosPorId.set(productoId, {
      productoId,
      cantidad: Math.max(0, normalizarNumero(producto?.cantidad)),
      cantidadMinima: Math.max(0, normalizarNumero(producto?.cantidadMinima))
    })
  }

  return Array.from(productosPorId.values())
}

export const emitirStockActualizado = ({ io, productos = [], origen = 'SISTEMA' }) => {
  const productosNormalizados = normalizarProductosStock(productos)

  if (!io || productosNormalizados.length === 0) {
    return
  }

  io.emit(SOCKET_EVENTOS.STOCK_ACTUALIZADO, {
    origen,
    timestamp: new Date().toISOString(),
    productos: productosNormalizados
  })
}
