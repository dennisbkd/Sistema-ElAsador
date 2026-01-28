import jwt from 'jsonwebtoken'

export class Token {
  constructor () {
    this.PALABRA_SECRETA = process.env.PALABRA_SECRETA || 'EstaEsUnaPalabraSecretaParaElToken'
    this.expiracion = process.env.expiracion || '24h'
  }

  crearToken (usuario) {
    const payload = jwt.sign(usuario,
      this.PALABRA_SECRETA,
      { expiresIn: this.expiracion })
    return payload
  }

  verificarToken (token) {
    return jwt.verify(token, this.PALABRA_SECRETA)
  }

  decodificar (token) {
    return jwt.decode(token)
  }
}
