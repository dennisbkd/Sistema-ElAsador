import { motion } from 'motion/react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export const DashboardError = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-6"
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">Error al cargar datos</h3>
          <p className="text-sm text-red-700 mb-4">
            {error?.message || 'Ocurrió un error al cargar el dashboard. Por favor, intenta de nuevo.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export const DashboardLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"
      />
    </motion.div>
  )
}

export const RefreshButton = ({ onClick, isLoading = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <motion.div
        animate={isLoading ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
      >
        <RefreshCw className="w-4 h-4" />
      </motion.div>
      {isLoading ? 'Actualizando...' : 'Actualizar'}
    </motion.button>
  )
}

export const DashboardHeader = ({ title, subtitle, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export const StatCard = ({ label, value, icon: Icon, color = 'blue', trend, isLoading = false }) => {
  const colorClasses = {
    blue: 'from-blue-100 to-blue-50 text-blue-600 bg-blue-100',
    green: 'from-green-100 to-green-50 text-green-600 bg-green-100',
    orange: 'from-orange-100 to-orange-50 text-orange-600 bg-orange-100',
    purple: 'from-purple-100 to-purple-50 text-purple-600 bg-purple-100',
    red: 'from-red-100 to-red-50 text-red-600 bg-red-100'
  }

  const [bgGradient, iconColor, iconBg] = colorClasses[color].split(' ')

  if (isLoading) {
    return <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -4 }}
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-4 flex items-center justify-between`}
    >
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && <p className="text-xs text-gray-600 mt-1">{trend}</p>}
      </div>
      {Icon && (
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className={`${iconColor} w-6 h-6`} />
        </div>
      )}
    </motion.div>
  )
}

export const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </motion.div>
  )
}
