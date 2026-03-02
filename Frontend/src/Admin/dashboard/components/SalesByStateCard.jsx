import { motion } from 'motion/react'
import { Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react'

const ESTADO_STYLES = {
  PENDIENTE: {
    icon: Clock,
    label: 'Pendiente',
    gradient: 'from-yellow-500 to-amber-600',
    bgLight: 'bg-yellow-50',
    color: 'text-yellow-600',
    border: 'border-yellow-200',
    shadow: 'shadow-yellow-200'
  },
  LISTO: {
    icon: CheckCircle,
    label: 'Listo',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    color: 'text-green-600',
    border: 'border-green-200',
    shadow: 'shadow-green-200'
  },
  CANCELADO: {
    icon: XCircle,
    label: 'Cancelado',
    gradient: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    color: 'text-red-600',
    border: 'border-red-200',
    shadow: 'shadow-red-200'
  },
  PAGADO: {
    icon: CreditCard,
    label: 'Pagado',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    color: 'text-blue-600',
    border: 'border-blue-200',
    shadow: 'shadow-blue-200'
  }
}

export const SalesByStateCard = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    )
  }

  const estados = ['PENDIENTE', 'LISTO', 'PAGADO', 'CANCELADO']
  const totalPedidos = estados.reduce((sum, estado) => sum + (data?.[estado]?.cantidad || 0), 0)
  const totalActivos = (data?.PENDIENTE?.cantidad || 0) + (data?.LISTO?.cantidad || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Estados de Pedidos</h3>
        <p className="text-sm text-gray-500 mt-1">Distribución actual por estado</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {estados.map((estado, index) => {
          const config = ESTADO_STYLES[estado]
          const Icon = config.icon
          const cantidad = data?.[estado]?.cantidad || 0
          const total = data?.[estado]?.total || 0
          const porcentaje = totalPedidos > 0 ? ((cantidad / totalPedidos) * 100).toFixed(0) : 0

          return (
            <motion.div
              key={estado}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`${config.bgLight} ${config.border} border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${config.shadow}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`bg-gradient-to-br ${config.gradient} p-2.5 rounded-lg shadow-md`}>
                  <Icon className="text-white w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${config.color} bg-white px-2 py-1 rounded-full`}>
                  {porcentaje}%
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{config.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{cantidad}</p>
                <p className="text-xs text-gray-500 mt-1">Bs {total.toFixed(2)}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg p-3 border border-amber-200">
          <p className="text-xs text-amber-700 font-semibold uppercase">Activos</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{totalActivos}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
          <p className="text-xs text-slate-700 font-semibold uppercase">Total Día</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalPedidos}</p>
        </div>
      </div>
    </motion.div>
  )
}
