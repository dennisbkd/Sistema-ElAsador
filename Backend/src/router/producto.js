import { Router } from 'express'
import { ProductoControlador } from '../controller/producto.js'
import { uploadProducto } from '../../middleware/multer.js'

export const rutaProducto = ({ productoServicio }) => {
  const ruta = Router()
  const controladorProducto = new ProductoControlador({ productoServicio })

  ruta.get('/obtener-productos', controladorProducto.obtenerProductos)
  ruta.get('/obtener-producto/:id', controladorProducto.obtenerProductoId)
  ruta.post('/crear-producto', uploadProducto.single('imagen'), controladorProducto.crearProducto)
  ruta.put('/actualizar/:id', uploadProducto.single('imagen'), controladorProducto.editarProducto)
  ruta.delete('/eliminar/:id', controladorProducto.eliminarProducto)
  ruta.get('/busqueda-producto-nombre', controladorProducto.busquedaProductoNombre)
  ruta.put('/cambiar-estado/:id', controladorProducto.cambiarEstadoProducto)

  return ruta
}
