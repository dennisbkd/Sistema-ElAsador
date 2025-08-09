import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Producto = sequelize.define('Producto', {
  idProducto: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Producto',
  timestamps: false
})
