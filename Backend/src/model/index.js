import { Usuario } from './Usuario.js'
import { Pedido, EstadoPedido, DetallePedido } from './pedido.js'
import { Producto } from './producto.js'
import { Rol } from './rol.js'
import { Stock } from './stock.js'
import { ModificacionPedido } from './modificacion.js'

// relacion entre Rol y Usuario
Rol.hasMany(Usuario, { foreignKey: 'idRol' })
Usuario.belongsTo(Rol, { foreignKey: 'idRol' })

// relacion entre Producto y Stock
Producto.hasMany(Stock, { foreignKey: 'idProducto' })
Stock.belongsTo(Producto, { foreignKey: 'idProducto' })

// relacion entre EstadoPedido y pedidos
EstadoPedido.hasMany(Pedido, { foreignKey: 'idEstado' })
Pedido.belongsTo(EstadoPedido, { foreignKey: 'idEstado' })

// relacion entre Usuario y pedido
Usuario.hasMany(Pedido, { foreignKey: 'idUsuario' })
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario' })

// relacion entre N:M (detallePedido) pedido/producto
Producto.belongsToMany(Pedido, { through: DetallePedido, foreignKey: 'idProducto', otherKey: 'idPedido' })
Pedido.belongsToMany(Producto, { through: DetallePedido, foreignKey: 'idPedido', otherKey: 'idProducto' })

DetallePedido.hasMany(ModificacionPedido, { foreignKey: 'idDetalle' })
ModificacionPedido.belongsTo(DetallePedido, { foreignKey: 'idDetalle' })

export {
  Rol,
  Usuario,
  Producto,
  Stock,
  EstadoPedido,
  Pedido,
  DetallePedido,
  ModificacionPedido
}
