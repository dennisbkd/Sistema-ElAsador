import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const CajaSesion = sequelize.define('CajaSesion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id'
    }
  },
  fechaApertura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaCierre: {
    type: DataTypes.DATE,
    allowNull: true
  },
  montoInicial: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  montoFinalEfectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  montoFinalQR: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  montoTeoricoEfectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  montoTeoricoQR: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('ABIERTA', 'CERRADA'),
    defaultValue: 'ABIERTA'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'CajaSesion',
  timestamps: false
})
