import { motion } from 'motion/react'
import { TrendingUp } from 'lucide-react'

export const SalesByHourChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-[500px]"
      >
        <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
      </motion.div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <p className="text-center text-gray-500 py-12">No hay datos de ventas</p>
      </motion.div>
    )
  }

  const maxTotal = Math.max(...data.map((h) => h.total), 1)
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
      </div>

      {/* Gráfico de barras mejorado */}
      <div className="space-y-3">
        <div className="flex items-end gap-[2px] h-72 px-4 border-l-2 border-b-2 border-gray-300 pb-2">
          {data?.map((hour, i) => {
            const height = maxTotal > 0 ? (hour.total / maxTotal) * 100 : 0
            const displayHeight = height < 3 && hour.total > 0 ? 3 : height

            return (
              <motion.div
                key={hour.hour}
                custom={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${displayHeight}%`, opacity: 1 }}
                transition={{
                  delay: i * 0.02,
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="flex-1 group cursor-pointer relative flex flex-col justify-end"
                title={`${hour.hour}: $${hour.total.toFixed(2)} (${hour.cantidadPedidos} pedidos)`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className={`w-full h-full rounded-t-md transition-all duration-200 ${hour.total > 0
                    ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 shadow-lg shadow-blue-200'
                    : 'bg-gray-200'
                    }`}
                  style={{ minHeight: displayHeight > 0 ? 'auto' : '2px' }}
                >
                  {/* Tooltip mejorado */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                      <div className="font-bold">Bs {hour.total.toFixed(2)}</div>
                      <div className="text-gray-300">{hour.cantidadPedidos} pedidos</div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Eje X mejorado */}
        <div className="flex gap-[2px] text-[10px] text-gray-600 px-4 font-medium">
          {data?.map((hour, i) => (
            <div key={hour.hour} className="flex-1 text-center">
              {i % 2 === 0 ? hour.hour.split(':')[0] : ''}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export const SalesByHourChartLine = ({ data, isLoading }) => {
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

  if (!data || data.length === 0) {
    return null
  }

  const maxTotal = Math.max(...data.map((h) => h.total), 1)
  const padding = 40
  const width = 800
  const height = 300
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = data.map((h, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + (1 - h.total / maxTotal) * chartHeight,
    value: h.total
  }))

  // const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
          <p className="text-sm text-gray-500 mt-1">Línea temporal de ventas por hora</p>
        </div>
      </div>

      <svg
        width="100%"
        height={300}
        viewBox={`0 0 ${width} ${height}`}
        className="text-blue-500"
      >
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={padding + (i / 4) * chartHeight}
            x2={width - padding}
            y2={padding + (i / 4) * chartHeight}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Polyline */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
          />
        ))}

        {/* X Axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="2"
        />

        {/* Y Axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  )
}
