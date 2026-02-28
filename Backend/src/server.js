import { Token } from './config/token.js'
import { App } from './main.js'
import { CajaSesion, Categoria, DetalleVenta, MovimientoStock, Pago, Producto, StockPlato, Usuario, Venta } from './model/index.js'
import { AuthServicio } from './services/auth.js'
import { CajeroServicio } from './services/cajero.js'
import { CategoriaServicio } from './services/categoria.js'
import { DashboardServicio } from './services/dashboard.js'
import { ImpresoraServicio } from './services/impresora.js'
import { ProductoServicio } from './services/producto.js'
import { StockServicio } from './services/stock.js'

import { UsuarioServicio } from './services/usuario.js'
import { VentaServicio } from './services/ventas.js'
import { VentasAdminServicio } from './services/ventasAdmin.js'

const usuarioServicio = new UsuarioServicio({ modelUsuario: Usuario, modelVenta: Venta })
const impresoraServicio = new ImpresoraServicio()
const ventaServicio = new VentaServicio(
  {
    modeloVenta: Venta,
    modeloDetalle: DetalleVenta,
    modeloProducto: Producto,
    modeloCategoria: Categoria,
    modeloStockPlato: StockPlato,
    modeloUsuario: Usuario,
    impresora: impresoraServicio,
    cajeroServicio: null
  }
)
const stockServicio = new StockServicio({
  modelStock: StockPlato,
  modelProducto: Producto,
  modelCategoria: Categoria,
  modelUsuario: Usuario,
  modelMovimientoS: MovimientoStock
})

const categoriaServicio = new CategoriaServicio({
  modeloCategoria: Categoria,
  modeloProducto: Producto
})

const productoServicio = new ProductoServicio({
  modeloProducto: Producto,
  modeloStock: StockPlato,
  modeloCategoria: Categoria,
  modeloDetalleVenta: DetalleVenta
})

const authServicio = new AuthServicio({
  modeloUsuario: Usuario,
  token: new Token()
})

const ventasAdminServicio = new VentasAdminServicio({
  ventaServicio,
  modeloVenta: Venta,
  modeloDetalleVenta: DetalleVenta,
  modeloProducto: Producto,
  modeloStockPlato: StockPlato,
  modeloUsuario: Usuario,
  impresora: impresoraServicio
})

const cajeroServicio = new CajeroServicio({
  ventasAdminServicio,
  modeloVenta: Venta,
  modeloPago: Pago,
  modeloCajaSesion: CajaSesion,
  modeloUsuario: Usuario
})

ventaServicio.cajeroServicio = cajeroServicio

const dashboardServicio = new DashboardServicio({
  modeloVenta: Venta,
  modeloDetalleVenta: DetalleVenta,
  modeloProducto: Producto,
  modeloCategoria: Categoria,
  modeloUsuario: Usuario,
  modeloDetalle: DetalleVenta,
  modeloPago: Pago
})

App({ usuarioServicio, ventaServicio, stockServicio, categoriaServicio, productoServicio, authServicio, ventasAdminServicio, cajeroServicio, dashboardServicio })
