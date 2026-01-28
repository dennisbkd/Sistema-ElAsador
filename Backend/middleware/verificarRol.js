// middleware para verificar el rol del usuario

export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuarioRol = req.usuario.rol
    console.log('Rol del usuario:', usuarioRol)
    if (usuarioRol.toUpperCase() === 'ADMINISTRADOR') {
      next()
    } else if (rolesPermitidos.includes(usuarioRol)) {
      next()
    } else {
      return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' })
    }
  }
}
