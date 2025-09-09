import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const DetalleVenta = sequelize.define('DetallePedido', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  ventaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Venta',
      key: 'id'
    }
  },
  productoId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Producto',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'PREPARACION', 'LISTO', 'ENTREGADO'),
    defaultValue: 'PENDIENTE',
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'DetalleVenta',
  timestamps: true,
  updatedAt: false
})
