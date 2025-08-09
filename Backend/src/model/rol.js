import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Rol = sequelize.define('Rol', {
  idRol: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Rol',
  timestamps: false
})
