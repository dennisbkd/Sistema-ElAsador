import { Router } from 'express'
import { ControladorCategoria } from '../controller/categoria.js'
import { verificarRol } from '../../middleware/verificarRol.js'

export const rutaCategoria = ({ categoriaServicio }) => {
  const rutas = Router()
  const controladorCategoria = new ControladorCategoria({ categoriaServicio })

  rutas.get('/obtener', verificarRol(['ADMINISTRADOR', 'MESERO', 'CAJERO']), controladorCategoria.obtenerCategorias)
  rutas.post('/crear', verificarRol(['ADMINISTRADOR']), controladorCategoria.crearCategoria)
  rutas.put('/actualizar/:id', verificarRol(['ADMINISTRADOR']), controladorCategoria.actualizarCategoria)
  rutas.delete('/eliminar/:id', verificarRol(['ADMINISTRADOR']), controladorCategoria.eliminarCategoria)

  return rutas
}
