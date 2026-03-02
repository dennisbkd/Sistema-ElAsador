import { motion } from 'motion/react'
import { ShoppingCart, CreditCard, Activity } from 'lucide-react'

const TIPO_STYLES = {
  VENTA: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    icon: ShoppingCart,
    color: 'text-blue-600'
  },
  PAGO: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    icon: CreditCard,
    color: 'text-green-600'
  }
}

const ESTADO_BADGE = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  PREPARACION: 'bg-blue-100 text-blue-800',
  LISTO: 'bg-green-100 text-green-800',
  PAGADO: 'bg-purple-100 text-purple-800',
  CANCELADO: 'bg-red-100 text-red-800'
}

const METODO_PAGO_STYLES = {
  EFECTIVO: 'bg-emerald-100 text-emerald-800',
  QR: 'bg-indigo-100 text-indigo-800'
}

export const RecentActivityFeed = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-500 mt-1">Últimas transacciones del día</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Activity className="text-indigo-600 w-6 h-6" />
        </div>
      </div>

      <div className="space-y-3">
        {!data || data.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay actividad registrada</p>
          </div>
        ) : (
          data.map((activity, i) => {
            const styles = TIPO_STYLES[activity.tipo]
            const Icon = styles.icon

            return (
              <motion.div
                key={`${activity.tipo}-${activity.id}`}
                custom={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${styles.bg} border ${styles.border} rounded-lg p-4`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`${styles.color} bg-white border-2 ${styles.border} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{activity.referencia}</p>
                          {activity.tipo === 'VENTA' && activity.estado && (
                            <span
                              className={`inline-block text-xs font-bold px-2 py-1 rounded ${ESTADO_BADGE[activity.estado] || 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {activity.estado}
                            </span>
                          )}
                          {activity.tipo === 'PAGO' && activity.metodoPago && (
                            <span
                              className={`inline-block text-xs font-bold px-2 py-1 rounded ${METODO_PAGO_STYLES[activity.metodoPago] || 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {activity.metodoPago}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(activity.timestamp).toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">${activity.monto.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Transacciones</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export const ActivityTimeline = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((activity, i) => {
          const styles = TIPO_STYLES[activity.tipo]
          return (
            <motion.div
              key={`${activity.tipo}-${activity.id}`}
              custom={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1.5" />
              {i < data.length - 1 && (
                <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
              )}
              <div className={`${styles.bg} border ${styles.border} rounded-lg p-3`}>
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-900 text-sm">{activity.referencia}</p>
                  <p className="font-bold text-gray-900">${activity.monto.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          )
        })
      ) : (
        <div className="text-center py-8 text-gray-500">Sin actividad</div>
      )}
    </div>
  )
}
