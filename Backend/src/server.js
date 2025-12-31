import { App } from './main.js'
import { Categoria, DetalleVenta, MovimientoStock, Producto, StockPlato, Usuario, Venta } from './model/index.js'
import { CategoriaServicio } from './services/categoria.js'
import { StockServicio } from './services/stock.js'

import { UsuarioServicio } from './services/usuario.js'
import { VentaServicio } from './services/ventas.js'

const usuarioServicio = new UsuarioServicio({ modelUsuario: Usuario, modelVenta: Venta })
const ventaServicio = new VentaServicio(
  {
    modeloVenta: Venta,
    modeloDetalle: DetalleVenta,
    modeloProducto: Producto,
    modeloCategoria: Categoria
  }
)
const stockServicio = new StockServicio({
  modelStock: StockPlato,
  modelProducto: Producto,
  modelCategoria: Categoria,
  modelUsuario: Usuario,
  modelMovimientoS: MovimientoStock
})

const categoriaServicio = new CategoriaServicio({ modeloCategoria: Categoria, modeloProducto: Producto })

App({ usuarioServicio, ventaServicio, stockServicio, categoriaServicio })
