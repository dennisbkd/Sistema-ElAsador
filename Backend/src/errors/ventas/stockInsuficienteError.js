export class StockInsuficienteError extends Error {
  constructor (producto, disponible, solicitado) {
    super(`Stock insuficiente para ${producto}. Disponible: ${disponible}, Solicitado: ${solicitado}`)
    this.name = 'StockInsuficienteError'
    this.producto = producto
    this.disponible = disponible
    this.solicitado = solicitado
    this.statusCode = 400
  }
}
