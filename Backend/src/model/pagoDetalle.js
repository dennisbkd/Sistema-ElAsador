import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const PagoDetalle = sequelize.define('PagoDetalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pagoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pago',
        key: 'id'
      }
    },
    detalleVentaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DetalleVenta',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: 'PagoDetalle',
    timestamps: true,
    updatedAt: false
  })
