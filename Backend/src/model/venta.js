import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const Venta = sequelize.define('Venta',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    nroMesa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clienteNombre: {
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
    },
    tipo: {
      type: DataTypes.ENUM('NORMAL', 'RESERVA'),
      defaultValue: 'NORMAL'
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fechaReserva: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }
  , {
    timestamps: true,
    tableName: 'Venta'
  })
