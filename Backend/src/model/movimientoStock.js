import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const MovimientoStock = sequelize.define('MovimientoStock',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Producto',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM('ENTRADA', 'SALIDA', 'AJUSTE'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidadAnterior: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidadNueva: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    tableName: 'MovimientoStock'
  })
