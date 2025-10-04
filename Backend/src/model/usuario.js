import sequelize from '../database/conexion.js'
import { DataTypes } from 'sequelize'

export const Usuario = sequelize.define('Usuario', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  usuario: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('ADMINISTRADOR', 'CAJERO', 'MESERO'),
    allowNull: false
  }
},
{
  tableName: 'Usuario',
  timestamps: true,
  updatedAt: false
})
