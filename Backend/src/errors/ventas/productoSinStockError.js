export class ProductoSinStockError extends Error {
  constructor (productoId) {
    super(`Producto con ID ${productoId} no tiene registro de stock`)
    this.name = 'ProductoSinStockError'
    this.productoId = productoId
    this.statusCode = 400
  }
}
