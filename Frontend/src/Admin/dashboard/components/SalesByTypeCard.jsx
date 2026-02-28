import { motion } from 'motion/react'
import { Store, ShoppingBag, Calendar } from 'lucide-react'

const TIPO_STYLES = {
  NORMAL: {
    icon: Store,
    label: 'Normal',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'from-blue-50 to-blue-100',
    color: 'text-blue-600',
    shadow: 'shadow-blue-200'
  },
  LLEVAR: {
    icon: ShoppingBag,
    label: 'Para Llevar',
    gradient: 'from-green-500 to-green-600',
    bgLight: 'from-green-50 to-green-100',
    color: 'text-green-600',
    shadow: 'shadow-green-200'
  },
  RESERVA: {
    icon: Calendar,
    label: 'Reserva',
    gradient: 'from-purple-500 to-purple-600',
    bgLight: 'from-purple-50 to-purple-100',
    color: 'text-purple-600',
    shadow: 'shadow-purple-200'
  }
}

export const SalesByTypeCard = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    )
  }

  const tipos = ['NORMAL', 'LLEVAR', 'RESERVA']
  const totalVentas = tipos.reduce((sum, tipo) => sum + (data?.[tipo]?.cantidad || 0), 0)
  const totalMonto = tipos.reduce((sum, tipo) => sum + (data?.[tipo]?.total || 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ventas por Tipo</h3>
        <p className="text-sm text-gray-500 mt-1">Distribución según tipo de pedido</p>
      </div>

      <div className="space-y-3">
        {tipos.map((tipo, index) => {
          const config = TIPO_STYLES[tipo]
          const Icon = config.icon
          const cantidad = data?.[tipo]?.cantidad || 0
          const total = data?.[tipo]?.total || 0
          const porcentaje = totalVentas > 0 ? ((cantidad / totalVentas) * 100).toFixed(1) : 0

          return (
            <motion.div
              key={tipo}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${config.bgLight} rounded-lg p-4 border border-gray-100 cursor-pointer transition-shadow hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-br ${config.gradient} p-3 rounded-lg shadow-sm ${config.shadow}`}>
                    <Icon className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{config.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{porcentaje}% del total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
                  <p className="text-sm text-gray-600">Bs {total.toFixed(2)}</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentaje}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${config.gradient}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Totales */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 font-medium uppercase">Total Pedidos</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{totalVentas}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 font-medium uppercase">Total Monto</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Bs {totalMonto.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
