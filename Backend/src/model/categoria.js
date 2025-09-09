import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Categoria = sequelize.define('Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('COMIDA', 'BEBIDA'),
      allowNull: false
    }
  }
  , {
    tableName: 'Categoria',
    timestamps: true,
    updatedAt: false
  })
