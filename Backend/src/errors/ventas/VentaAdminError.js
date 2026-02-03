export class VentaCantidadError extends Error {
  constructor (solicitado) {
    super('La cantidad a anular no puede ser mayor o igual a la cantidad vendida ' + solicitado)
    this.name = 'VentaCantidadError'
    this.statusCode = 400
  }
}

export class VentaErrorComun extends Error {
  constructor (mensaje) {
    super(mensaje)
    this.name = 'VentaErrorComun'
    this.statusCode = 400
  }
}
