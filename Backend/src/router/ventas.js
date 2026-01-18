import { Router } from 'express'
import { ControladorVenta } from '../controller/ventas.js'

export const rutaVentas = ({ ventaServicio }) => {
  const rutas = Router()
  const controladorVenta = new ControladorVenta({ ventaServicio })

  rutas.get('/mobile/delDia', controladorVenta.ventasDelDiaDetallados)
  rutas.post('/registrar-venta', controladorVenta.crearVenta)
  rutas.post('/:id/agregar-producto', controladorVenta.agregarProductoAVenta)
  rutas.get('/:id', controladorVenta.obtenerVentaId)
  return rutas
}
