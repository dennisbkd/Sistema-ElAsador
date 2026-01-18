export class VentaSearchError extends Error {
  constructor (message) {
    super(message)
    this.name = 'VentaSearchError'
    this.statusCode = 404
  }
}
