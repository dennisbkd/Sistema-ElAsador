import { motion } from 'motion/react'
import { Clock, CheckCircle2, CreditCard, X, AlertCircle } from 'lucide-react'

const ESTADO_STYLES = {
  PENDIENTE: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
    color: 'text-yellow-600'
  },
  PREPARACION: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    icon: Clock,
    color: 'text-blue-600'
  },
  LISTO: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
    color: 'text-green-600'
  },
  PAGADO: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    icon: CreditCard,
    color: 'text-purple-600'
  },
  CANCELADO: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    icon: X,
    color: 'text-red-600'
  }
}

const ESTADO_ORDER = ['PENDIENTE', 'LISTO', 'PAGADO', 'CANCELADO']

export const LiveOrdersSection = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </motion.div>
    )
  }

  const totalPedidos = Object.values(data?.total || {}).reduce((sum, val) => sum + val, 0)
  const estadosActivos = ESTADO_ORDER.filter((estado) => data?.[estado]?.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pedidos en Tiempo Real</h3>
        <p className="text-sm text-gray-500 mt-1">Estado actual de los pedidos del día</p>
      </div>

      {/* Resumen por estado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {ESTADO_ORDER.map((estado) => {
          const cantidad = data?.total?.[estado] || 0
          const styles = ESTADO_STYLES[estado]
          const Icon = styles.icon

          return (
            <motion.div
              key={estado}
              custom={ESTADO_ORDER.indexOf(estado)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ESTADO_ORDER.indexOf(estado) * 0.05 }}
              className={`${styles.bg} border ${styles.border} rounded-lg p-4 text-center`}
            >
              <Icon className={`${styles.color} w-6 h-6 mx-auto mb-2`} />
              <p className="text-xs font-medium text-gray-600 uppercase">{estado}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{cantidad}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Pedidos por estado */}
      <div className="space-y-6">
        {estadosActivos.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay pedidos activos</p>
          </div>
        ) : (
          estadosActivos.map((estado) => {
            const styles = ESTADO_STYLES[estado]
            const pedidos = data?.[estado] || []

            return (
              <div key={estado}>
                <h4 className={`text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide`}>
                  <span className={`inline-block ${styles.badge} px-3 py-1 rounded-full text-xs font-bold`}>
                    {estado} ({pedidos.length})
                  </span>
                </h4>

                <div className={`space-y-2 pl-4 border-l-4 ${styles.border}`}>
                  {pedidos.map((pedido) => (
                    <motion.div
                      key={pedido.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${styles.bg} border ${styles.border} rounded-lg p-4`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{pedido.codigo}</p>
                            {pedido.mesa && (
                              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                Mesa {pedido.mesa}
                              </span>
                            )}
                          </div>
                          {pedido.cliente && (
                            <p className="text-sm text-gray-600 mt-1">{pedido.cliente}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(pedido.timestamp).toLocaleTimeString('es-AR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">Bs {pedido.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Resumen */}
      {totalPedidos > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">Total de Pedidos</p>
          <p className="text-3xl font-bold text-gray-900">{totalPedidos}</p>
        </div>
      )}
    </motion.div>
  )
}
