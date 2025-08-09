import sequelize from '../database/conexion.js'
import { DataTypes } from 'sequelize'

export const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  idRol: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Rol',
      key: 'idRol'
    }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Suspendido', 'Despedido'),
    defaultValue: 'Activo'
  }
},
{
  tableName: 'Usuario',
  timestamps: false
})
