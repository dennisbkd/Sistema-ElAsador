import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Categoria = sequelize.define('Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Folder'
    }
  }
  , {
    tableName: 'Categoria',
    timestamps: true,
    updatedAt: false
  })
