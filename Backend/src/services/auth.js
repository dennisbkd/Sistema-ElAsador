import { AuthSesionError } from '../errors/index.js'

export class AuthServicio {
  constructor ({ modeloUsuario, token }) {
    this.modeloUsuario = modeloUsuario
    this.token = token
  }

  // iniciar sesion
  async iniciarSesion ({ body }) {
    const { usuario, password } = body
    try {
      const buscarUsuario = await this.modeloUsuario.findOne({ where: { usuario } })
      if (!buscarUsuario) {
        throw new AuthSesionError('Ususario o contraseña incorrectos')
      }
      const passwordBd = buscarUsuario.password
      if (password !== passwordBd) {
        throw new AuthSesionError('Ususario o contraseña incorrectos')
      }
      const token = this.token.crearToken({
        id: buscarUsuario.id,
        usuario: buscarUsuario.usuario,
        rol: buscarUsuario.rol
      })
      return {
        usuario: {
          userName: buscarUsuario.usuario,
          rol: buscarUsuario.rol
        },
        token
      }
    } catch (error) {
      if (error instanceof AuthSesionError) {
        throw error
      }
    }
  }
}
