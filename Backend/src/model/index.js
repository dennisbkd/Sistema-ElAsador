import { Usuario } from './usuario.js'
import { Producto } from './producto.js'
import { StockPlato } from './stockPlato.js'
import { DetalleVenta } from './DetalleVenta.js'
import { Venta } from './venta.js'
import { Categoria } from './categoria.js'
import { TicketCocina } from './ticketCocina.js'
import { MovimientoStock } from './movimientoStock.js'
import { Pago } from './pago.js'
import sequelize from '../database/conexion.js'
import { CajaSesion } from './cajaSession.js'

Usuario.hasMany(Venta, { foreignKey: 'usuarioId' })
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId' })

Usuario.hasMany(CajaSesion, {
  foreignKey: 'usuarioId',
  as: 'cajaSesiones'
})

CajaSesion.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
})

Usuario.hasMany(MovimientoStock, { foreignKey: 'usuarioId' })
MovimientoStock.belongsTo(Usuario, { foreignKey: 'usuarioId' })

// relacion entre producto y categoria
Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' })
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' })

// 3. RELACIONES PRODUCTO
Producto.hasOne(StockPlato, { foreignKey: 'productoId', onDelete: 'CASCADE', hooks: true })
StockPlato.belongsTo(Producto, { foreignKey: 'productoId' })

Producto.hasMany(DetalleVenta, { foreignKey: 'productoId' })
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId' })

Producto.hasMany(MovimientoStock, { foreignKey: 'productoId' })
MovimientoStock.belongsTo(Producto, { foreignKey: 'productoId' })

// 4 RELACION VENTAS
Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', onDelete: 'CASCADE', hooks: true })
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId' })

Venta.hasMany(TicketCocina, { foreignKey: 'ventaId' })
TicketCocina.belongsTo(Venta, { foreignKey: 'ventaId' })

Venta.hasMany(Pago, { foreignKey: 'ventaId' })
Pago.belongsTo(Venta, { foreignKey: 'ventaId' })

// CajaSesion tiene muchos Pagos
CajaSesion.hasMany(Pago, {
  foreignKey: 'cajaSesionId',
  as: 'pagos'
})

Pago.belongsTo(CajaSesion, {
  foreignKey: 'cajaSesionId',
  as: 'cajaSesion'
})

// 5 Relacion DetalleVenta
DetalleVenta.hasOne(TicketCocina, { foreignKey: 'detalleVentaId' })
TicketCocina.belongsTo(DetalleVenta, { foreignKey: 'detalleVentaId' })

// 6 RELACIÓN N:M ENTRE VENTA Y PRODUCTO (A TRAVÉS DE DETALLEVENTA)
Venta.belongsToMany(Producto, {
  through: DetalleVenta,
  foreignKey: 'ventaId',
  otherKey: 'productoId'
})

Producto.belongsToMany(Venta, {
  through: DetalleVenta,
  foreignKey: 'productoId',
  otherKey: 'ventaId'
})

export {
  Usuario,
  Producto,
  StockPlato,
  Venta,
  DetalleVenta,
  Categoria,
  Pago,
  MovimientoStock,
  TicketCocina,
  CajaSesion,
  sequelize
}
