import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Pago = sequelize.define('Pago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Venta',
        key: 'id'
      }
    },
    metodoPago: {
      type: DataTypes.ENUM('EFECTIVO', 'QR'),
      defaultValue: 'EFECTIVO',
      allowNull: false,
      references: {
        model: 'MetodoPago',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    tableName: 'Pago'
  })
