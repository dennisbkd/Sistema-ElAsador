import { motion } from 'motion/react'
import { ShoppingBag, Award } from 'lucide-react'

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
}

export const TopProductsTable = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    )
  }

  const totalVentas = data?.reduce((sum, product) => sum + (product.totalGenerado || 0), 0) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
          <p className="text-sm text-gray-500 mt-1">Top productos del día</p>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg">
          <ShoppingBag className="text-purple-600 w-6 h-6" />
        </div>
      </div>

      <div className="space-y-3">
        {!data || data.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay productos vendidos hoy</p>
          </div>
        ) : (
          data.map((product, i) => (
            <motion.div
              key={product.productoId}
              custom={i}
              variants={ITEM_VARIANTS}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                  {i === 0 && (
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-300 rounded-full p-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {i === 1 && (
                    <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-full p-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {i === 2 && (
                    <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-full p-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {i >= 3 && (
                    <div className="bg-blue-100 p-2 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{i + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {product.cantidadVendida} unidade{product.cantidadVendida !== 1 ? 's' : ''} vendidas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">Bs {product.totalGenerado.toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {((product.totalGenerado / totalVentas) * 100).toFixed(1)}% del total
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Productos Vendidos</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Generado</p>
              <p className="text-2xl font-bold text-gray-900">Bs {totalVentas.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Promedio por Producto</p>
              <p className="text-2xl font-bold text-gray-900">
                Bs {(totalVentas / data.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
