import { DataTypes, Sequelize } from 'sequelize'
import sequelize from '../database/conexion.js'

// PEDIDO TABLA PRINCIPAL

export const Pedido = sequelize.define('Pedido', {
  idPedido: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuario',
      key: 'idUsario'
    }
  },
  mesa: {
    type: DataTypes.STRING(100)
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

  },
  idEstado: {
    type: DataTypes.INTEGER,
    references: {
      model: 'EstadoPedido',
      key: 'idEstado'
    }
  },
  observaciones: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Pedido',
  timestamps: false
})

// ESTADO

export const EstadoPedido = sequelize.define('EstadoPedido', {
  idEstado: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'EstadoPedido',
  timestamps: false
})

// DETALLE

export const DetallePedido = sequelize.define('DetallePedido', {
  idDetalle: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  idPedido: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Pedido',
      key: 'idPedido'
    }
  },
  idProducto: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Producto',
      key: 'idProducto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'DetallePedido',
  timestamps: false
})
