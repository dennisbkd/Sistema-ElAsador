import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const TicketCocina = sequelize.define('TicketCocina',
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
    detalleVentaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DetalleVenta',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'PREPARACION', 'LISTO'),
      defaultValue: 'PENDIENTE'
    },
    prioridad: {
      type: DataTypes.ENUM('Normal', 'URGENTE'),
      defaultValue: 'Normal'
    },
    horaSolicitud: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    horaCompletado: {
      type: DataTypes.DATE,
      allowNull: true
    },
    observacionesCocina: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    tableName: 'TicketCocina'
  })
