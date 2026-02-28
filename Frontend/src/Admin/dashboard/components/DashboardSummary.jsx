import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingCart, Clock } from 'lucide-react'

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
}

export const DashboardSummary = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      icon: DollarSign,
      title: 'Ventas del Día',
      value: `Bs${data?.ventasDelDia?.toFixed(2) || '0.00'}`,
      color: 'from-green-100 to-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Total Pedidos',
      value: data?.totalPedidos || 0,
      color: 'from-blue-100 to-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Pedidos Activos',
      value: data?.pedidosActivos || 0,
      color: 'from-orange-100 to-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Ticket Promedio',
      value: `Bs${data?.ticketPromedio?.toFixed(2) || '0.00'}`,
      color: 'from-purple-100 to-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            custom={i}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <Icon className={`${card.iconColor} w-6 h-6`} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Componente auxiliar para mostrar resumen en cards
export const SummaryMetric = ({ label, value, icon: Icon, variant = 'primary' }) => {
  const variantClasses = {
    primary: 'from-blue-100 to-blue-50 text-blue-600',
    success: 'from-green-100 to-green-50 text-green-600',
    warning: 'from-orange-100 to-orange-50 text-orange-600',
    danger: 'from-red-100 to-red-50 text-red-600'
  }

  return (
    <motion.div
      variants={CARD_VARIANTS}
      className={`bg-gradient-to-br ${variantClasses[variant]} rounded-lg p-4 flex items-center gap-3`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  )
}
