import { DataTypes } from 'sequelize'
import sequelize from '../database/conexion.js'

export const ModificacionPedido = sequelize.define('ModificacionPedido', {
  idModificacion: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  idDetalle: {
    type: DataTypes.INTEGER,
    references: {
      model: 'DetallePedido',
      key: 'idDetalle'
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  afectaStockPrincipal: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ModificacionPedido',
  timestamps: false
})
