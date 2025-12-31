import { Router } from 'express'
import { ControladorCategoria } from '../controller/categoria.js'

export const rutaCategoria = ({ categoriaServicio }) => {
  const rutas = Router()
  const controladorCategoria = new ControladorCategoria({ categoriaServicio })

  rutas.get('/obtener', controladorCategoria.obtenerCategorias)
  rutas.post('/crear', controladorCategoria.crearCategoria)
  rutas.put('/actualizar/:id', controladorCategoria.actualizarCategoria)
  rutas.delete('/eliminar/:id', controladorCategoria.eliminarCategoria)

  return rutas
}
