export class CajaErrorComun extends Error {
  constructor (mensaje) {
    super(mensaje)
    this.name = 'CajaErrorComun'
    this.statusCode = 400
  }
}
