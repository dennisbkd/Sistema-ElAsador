export class AuthSesionError extends Error {
  constructor (messsage) {
    super(messsage)
    this.name = 'AuthSesionError'
    this.statusCode = 401
  }
}
