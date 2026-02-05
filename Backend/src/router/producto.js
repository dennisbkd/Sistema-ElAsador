import { Router } from 'express'
import { ProductoControlador } from '../controller/producto.js'
import { uploadProducto } from '../../middleware/multer.js'
import { verificarRol } from '../../middleware/verificarRol.js'

export const rutaProducto = ({ productoServicio }) => {
  const ruta = Router()
  const controladorProducto = new ProductoControlador({ productoServicio })

  ruta.get('/obtener-productos', verificarRol(['ADMINISTRADOR', 'MESERO', 'CAJERO']), controladorProducto.obtenerProductos)
  ruta.get('/obtener-producto/:id', verificarRol(['ADMINISTRADOR']), controladorProducto.obtenerProductoId)
  ruta.post('/crear-producto', verificarRol(['ADMINISTRADOR']), uploadProducto.single('imagen'), controladorProducto.crearProducto)
  ruta.put('/actualizar/:id', verificarRol(['ADMINISTRADOR']), uploadProducto.single('imagen'), controladorProducto.editarProducto)
  ruta.delete('/eliminar/:id', verificarRol(['ADMINISTRADOR']), controladorProducto.eliminarProducto)
  ruta.get('/busqueda-producto-nombre', verificarRol(['ADMINISTRADOR', 'MESERO', 'CAJERO']), controladorProducto.busquedaProductoNombre)
  ruta.put('/cambiar-estado/:id', verificarRol(['ADMINISTRADOR']), controladorProducto.cambiarEstadoProducto)

  return ruta
}
