import { Router } from 'express'
import { ControladorVenta } from '../controller/ventas.js'
import { verificarRol } from '../../middleware/verificarRol.js'

export const rutaVentas = ({ ventaServicio }) => {
  const rutas = Router()
  const controladorVenta = new ControladorVenta({ ventaServicio })

  rutas.get('/mobile/delDia', verificarRol(['MESERO', 'CAJERO']), controladorVenta.ventasDelDiaDetallados)
  rutas.post('/registrar-venta', verificarRol(['MESERO', 'CAJERO']), controladorVenta.crearVenta)
  rutas.post('/:id/agregar-producto', verificarRol(['MESERO', 'CAJERO']), controladorVenta.agregarProductoAVenta)
  rutas.get('/:id', verificarRol(['MESERO', 'CAJERO']), controladorVenta.obtenerVentaId)
  rutas.get('/:id/imprimir', verificarRol(['MESERO', 'CAJERO']), controladorVenta.imprimirVenta)
  return rutas
}
