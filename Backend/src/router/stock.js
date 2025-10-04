import { Router } from 'express'
import { ControladorStock } from '../controller/stock.js'

export const rutaStock = ({ stockServicio }) => {
  const ruta = Router()
  const controladorStock = new ControladorStock({ stockServicio })

  ruta.get('/estado', controladorStock.obtenerEstadoStock)
  ruta.get('/movimiento', controladorStock.movimientoStock)

  return ruta
}
