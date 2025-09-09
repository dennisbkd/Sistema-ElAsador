import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Producto = sequelize.define('Producto', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categoria',
      key: 'id'
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  esPreparado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Producto',
  timestamps: true
})
