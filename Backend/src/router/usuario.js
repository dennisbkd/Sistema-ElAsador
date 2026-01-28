import { Router } from 'express'
import { ControladorUsuario } from '../controller/usuario.js'
import { verificarRol } from '../../middleware/verificarRol.js'

export const rutaUsuario = ({ usuarioServicio }) => {
  const rutas = Router()
  const controladorUsuario = new ControladorUsuario({ usuarioServicio })

  rutas.get('/obtener', verificarRol(['ADMINISTRADOR']), controladorUsuario.obtenerUsuarios)
  rutas.put('/actualizar/:id', verificarRol(['ADMINISTRADOR']), controladorUsuario.editarUsuario)
  rutas.post('/agregar', verificarRol(['ADMINISTRADOR']), controladorUsuario.agregarUsuario)
  rutas.put('/cambiar-estado/:id', verificarRol(['ADMINISTRADOR']), controladorUsuario.cambiarEstadoUsuario)
  rutas.get('/total-usuarios', verificarRol(['ADMINISTRADOR']), controladorUsuario.obtenerTotalUsuarios)
  rutas.delete('/eliminar/:id', verificarRol(['ADMINISTRADOR']), controladorUsuario.eliminarUsuario)

  return rutas
}
