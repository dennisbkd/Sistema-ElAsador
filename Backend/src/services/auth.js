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

  // Renovar un token todavía válido, extendiendo la sesión sin pedir credenciales de nuevo
  async renovarToken ({ headers }) {
    const authHeader = headers?.authorization
    const existeToken = authHeader?.split(' ')[1]

    if (!existeToken) {
      throw new AuthSesionError('Token no encontrado')
    }

    let decodificado
    try {
      decodificado = this.token.verificarToken(existeToken)
    } catch (error) {
      throw new AuthSesionError('Token inválido o vencido')
    }

    const nuevoToken = this.token.crearToken({
      id: decodificado.id,
      usuario: decodificado.usuario,
      rol: decodificado.rol
    })

    return {
      usuario: {
        userName: decodificado.usuario,
        rol: decodificado.rol
      },
      token: nuevoToken
    }
  }
}
