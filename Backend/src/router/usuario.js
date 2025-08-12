import { Router } from 'express'
import { ControladorUsuario } from '../controller/usuario.js'

export const rutaUsuario = ({ usuarioServicio }) => {
  const rutas = Router()
  const controladorUsuario = new ControladorUsuario({ usuarioServicio })

  rutas.get('/obtener', controladorUsuario.obtenerUsuarios)
  rutas.put('/actualizar/:id', controladorUsuario.editarUsuario)
  rutas.post('/agregar', controladorUsuario.agregarUsuario)

  return rutas
}
