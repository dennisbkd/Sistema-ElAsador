// components/CajaStats.jsx
import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

// Componente para números animados
const AnimatedNumber = ({ value }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      key={value}
    >
      {value}
    </motion.span>
  );
};

// Componente para montos animados
const AnimatedAmount = ({ value }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      key={value}
    >
      {value}
    </motion.span>
  );
};

export const CajaStats = ({
  totalPedidos = 0,
  montoDiario = 0,
  totalPendientes = 0,
  totalPagados = 0,
  totalLlevar = 0,
  montoPendiente = 0,
  montoPagado = 0,
  isLoading = false,
  isError = false
}) => {
  const stats = [
    {
      key: 'PENDIENTE',
      label: 'Pendiente',
      cantidad: totalPendientes,
      monto: montoPendiente,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      key: 'PAGADO',
      label: 'Pagado',
      cantidad: totalPagados,
      monto: montoPagado,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      key: 'LLEVAR',
      label: 'Llevar',
      cantidad: totalLlevar,
      icon: XCircle,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100'
    },
    {
      key: 'hoy',
      label: 'Hoy',
      cantidad: totalPedidos,
      monto: montoDiario,
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    }
  ];

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="px-6 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg p-3 border border-gray-200 animate-pulse"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-6 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-20 bg-gray-300 rounded ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje mínimo
  if (isError) {
    return (
      <div className="px-6 pb-3">
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-center">
          <p className="text-sm text-rose-600">Error al cargar estadísticas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.key}
              className={`${stat.bg} border ${stat.border} rounded-lg p-3`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: stats.indexOf(stat) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-600">
                    {stat.label}
                  </span>
                </div>
                <span className={`text-sm font-bold ${stat.color}`}>
                  <AnimatedNumber value={stat.cantidad} />
                </span>
              </div>

              {stat.monto > 0 && (
                <motion.div
                  className="text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm font-semibold text-gray-800">
                    Bs <AnimatedAmount value={stat.monto.toFixed(2)} />
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};