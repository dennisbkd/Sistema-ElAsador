import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Stock = sequelize.define('Stock', {
  idStock: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  idProducto: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Producto',
      key: 'idProducto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: sequelize.fn('CURDATE')
  }
}, {
  tableName: 'Stock',
  timestamps: false
})
