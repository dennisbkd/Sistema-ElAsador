import { Usuario } from './Usuario.js'
import { Producto } from './producto.js'
import { StockPlato } from './stockPlato.js'
import { ModificacionPedido } from './modificacion.js'
import { DetalleVenta } from './DetalleVenta.js'
import { Venta } from './venta.js'

// relacion entre Producto y Stock
Producto.hasMany(StockPlato, { foreignKey: 'productoId' })
StockPlato.belongsTo(Producto, { foreignKey: 'productoId' })

// relacion entre Usuario y pedido
Usuario.hasMany(Venta, { foreignKey: 'usuarioId' })
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId' })

// relacion entre N:M (DetalleVenta) venta/producto
Producto.belongsToMany(Venta, { through: DetalleVenta, foreignKey: 'productoId', otherKey: 'ventaId' })
Venta.belongsToMany(Producto, { through: DetalleVenta, foreignKey: 'ventaId', otherKey: 'productoId' })

// DetalleVenta.hasMany(ModificacionPedido, { foreignKey: 'idDetalle' })
// ModificacionPedido.belongsTo(DetalleVenta, { foreignKey: 'idDetalle' })

export {
  Usuario,
  Producto,
  StockPlato,
  Venta,
  DetalleVenta,
  ModificacionPedido
}
