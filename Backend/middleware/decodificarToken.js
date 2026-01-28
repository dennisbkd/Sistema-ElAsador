import { Token } from '../src/config/token.js'

export const decodificarToken = (req, res, next) => {
  const token = new Token()
  const authHeader = req.headers?.authorization
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'No autorizado' })
  }
  const existeToken = authHeader.split(' ')[1]
  if (!existeToken) {
    return res.status(401).json({ mensaje: 'token no encontrado' })
  }
  try {
    const tokenDecodificado = token.verificarToken(existeToken)
    req.usuario = {
      id: tokenDecodificado.id,
      rol: tokenDecodificado.rol
    }
    next()
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' })
  }
}
