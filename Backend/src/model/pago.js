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
    metodoPagoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MetodoPago',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    referencia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'COMPLETADO', 'ANULADO'),
      defaultValue: 'PENDIENTE'
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    tableName: 'Pago'
  })
