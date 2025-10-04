import { Router } from 'express'
import { ControladorVenta } from '../controller/ventas.js'

export const rutaVentas = ({ ventaServicio }) => {
  const rutas = Router()
  const controladorVenta = new ControladorVenta({ ventaServicio })

  rutas.get('/delDia', controladorVenta.ventasDelDiaDetallado)

  return rutas
}
