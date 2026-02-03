import { Router } from 'express'
import { ControladorVentaAdmin } from '../controller/ventasAdmin.js'
import { verificarRol } from '../../middleware/verificarRol.js'

export const rutaVentasAdmin = ({ ventasAdminServicio }) => {
  const rutas = Router()
  const controladorVentasAdmin = new ControladorVentaAdmin({ ventasAdminServicio })

  rutas.get('/ventas-admin', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.obtenerVentasAdmin)
  rutas.get('/venta-admin/:id', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.obtenerVentaPorId)
  rutas.post('/venta-admin/:id/agregar-producto-mesero', controladorVentasAdmin.agregarProductoAPedidoMesero)
  rutas.post('/venta-admin/:id/asignar-reserva-mesero', controladorVentasAdmin.asignarReservaAMesero)
  rutas.post('/venta-admin/:id/anular-producto', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.anularProductoDeVenta)
  rutas.post('/venta-admin/:id/anular-venta', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.anularVenta)
  rutas.post('/venta-admin/:id/cambiar-estado', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.cambiarEstadoVenta)
  rutas.post('/venta-admin/:id/imprimir-comanda-cocina', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.imprimirComandaCocina)
  rutas.post('/venta-admin/:id/imprimir-venta', verificarRol(['ADMINISTRADOR']), controladorVentasAdmin.imprimirVenta)

  return rutas
}
