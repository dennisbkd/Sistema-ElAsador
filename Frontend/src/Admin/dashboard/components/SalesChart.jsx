import { motion } from 'motion/react'
import { TrendingUp } from 'lucide-react'

/**
 * Gráfico de ventas por hora usando CSS bars
 * No requiere recharts
 */
export const SalesByHourChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-96"
      >
        <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
      </motion.div>
    )
  }

  const maxTotal = Math.max(...(data?.map((h) => h.total) || [0]))
  const totalVentas = data?.reduce((sum, h) => sum + h.total, 0) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ventas por Hora</h3>
          <p className="text-sm text-gray-500 mt-1">Distribución de ventas durante el día</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <TrendingUp className="text-blue-600 w-6 h-6" />
        </div>
      </div>

      {/* Gráfico de barras CSS */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 h-64">
          {data?.map((hour, i) => {
            const height = maxTotal > 0 ? (hour.total / maxTotal) * 100 : 0
            return (
              <motion.div
                key={hour.hour}
                custom={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.5 }}
                className="flex flex-col justify-end group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group-hover:shadow-lg transition-shadow"
                  style={{ minHeight: height > 5 ? 'auto' : '2px' }}
                >
                  {height > 15 && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 whitespace-nowrap">
                      ${hour.total.toFixed(0)}
                    </span>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Eje X */}
        <div className="grid grid-cols-12 gap-2 text-xs text-gray-600">
          {data?.map((hour) => (
            <div key={hour.hour} className="text-center font-medium">
              {hour.hour}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Vendido</p>
            <p className="text-2xl font-bold text-gray-900">${totalVentas.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Promedio por Hora</p>
            <p className="text-2xl font-bold text-gray-900">
              ${data && data.length > 0 ? (totalVentas / data.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Gráfico alternativo: Mini gráfico de línea
 */
export const SalesByHourChartMini = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Sin datos</div>
  }

  const maxTotal = Math.max(...data.map((h) => h.total))

  return (
    <svg
      viewBox="0 0 100 50"
      className="w-full h-32 text-blue-500"
      preserveAspectRatio="none"
    >
      <polyline
        points={data.map((h, i) => `${(i / (data.length - 1)) * 100},${maxTotal > 0 ? 100 - (h.total / maxTotal) * 100 : 100}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * Gráfico estilo minimalista con área sombreada
 */
export const SalesByHourSparkline = ({ data = [], color = 'blue' }) => {
  if (!data || data.length === 0) return null

  const maxTotal = Math.max(...data.map((h) => h.total), 1)
  const width = 100
  const height = 40

  const points = data.map((h, i) => {
    return {
      x: (i / (data.length - 1)) * width,
      y: height - (h.total / maxTotal) * height
    }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = pathD + ` L ${width} ${height} L 0 ${height} Z`

  const colorMap = {
    blue: { line: '#3b82f6', area: '#93c5fd' },
    green: { line: '#10b981', area: '#a7f3d0' },
    orange: { line: '#f97316', area: '#fed7aa' }
  }

  const colors = colorMap[color] || colorMap.blue

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <path d={areaD} fill={colors.area} opacity="0.2" />
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={colors.line}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
