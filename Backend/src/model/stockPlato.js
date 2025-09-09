import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const StockPlato = sequelize.define('StockPlato', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  ProductoId: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: 'Producto',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cantidadMinima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  }
}, {
  tableName: 'StockPlato',
  timestamps: true,
  createdAt: false
})
