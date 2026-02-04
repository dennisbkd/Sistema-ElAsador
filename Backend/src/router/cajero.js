import { verificarRol } from '../../middleware/verificarRol.js'
import { CajeroControlador } from '../controller/cajero.js'
import { Router } from 'express'

export const rutasCajero = ({ cajeroServicio }) => {
  const cajeroControlador = new CajeroControlador({ cajeroServicio })
  const rutas = Router()

  rutas.post('/registrar-pago', verificarRol(['CAJERO', 'ADMINISTRADOR']), cajeroControlador.registrarPago)
  rutas.post('/abrir-caja', verificarRol(['CAJERO', 'ADMINISTRADOR']), cajeroControlador.abrirCaja)
  rutas.post('/cerrar-caja', verificarRol(['CAJERO', 'ADMINISTRADOR']), cajeroControlador.cerrarCaja)
  rutas.get('/caja-abierta', verificarRol(['CAJERO', 'ADMINISTRADOR']), cajeroControlador.obtenerCajaAbierta)

  return rutas
}
