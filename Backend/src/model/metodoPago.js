import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const MetodoPago = sequelize.define('MetodoPago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'MetodoPago',
    timestamps: true,
    updatedAt: false
  })
