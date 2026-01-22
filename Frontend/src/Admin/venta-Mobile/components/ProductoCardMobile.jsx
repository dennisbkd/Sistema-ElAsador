import { motion } from 'motion/react'
import { ChefHat, Package, Plus, Minus, ShoppingCart, MessageSquare, X } from 'lucide-react'

export const ProductoCardMobile = ({ producto, onAgregar, cantidad = 0, observacion = '', actualizarObservacion }) => {
  const precioNum = parseFloat(producto.precio)
  const stockDisponible = producto.stock?.cantidad || 0
  const stockMinimo = producto.stock?.cantidadMinima || 0
  const stockBajo = stockDisponible > 0 && stockDisponible <= stockMinimo
  const disponible = stockDisponible > 0

  // Manejo de imagen
  const pathImagen = producto.imagen
    ? (producto.imagen.startsWith('http') ? producto.imagen : `${import.meta.env.VITE_API_URL}${producto.imagen}`)
    : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop'

  const getEstadoStock = () => {
    if (stockDisponible === 0) return { color: 'bg-red-500', texto: 'Agotado' }
    if (stockBajo) return { color: 'bg-yellow-500', texto: 'Stock bajo' }
    return { color: 'bg-green-500', texto: 'Disponible' }
  }


  const estadoStock = getEstadoStock()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="flex p-3 gap-3">
        {/* Imagen - Más grande que en el compacto */}
        <div className="flex-shrink-0 relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {pathImagen ? (
              <img
                src={pathImagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={28} className="text-gray-400" />
              </div>
            )}

            {/* Badge esPreparado */}
            {producto.esPreparado && (
              <div className="absolute -bottom-1 -left-1">
                <div className="px-2 py-1 bg-orange-500 rounded-md">
                  <ChefHat size={12} className="text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Indicador de stock bajo */}
          {stockBajo && (
            <div className="absolute -top-1 -left-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Información - Optimizada para espacio */}
        <div className="flex-1 min-w-0">
          {/* Header con nombre y stock */}
          <div className="mb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
                {producto.nombre}
              </h3>

              {/* Estado stock mini */}
              <div className="flex-shrink-0">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${stockDisponible === 0 ? 'bg-red-100' : stockBajo ? 'bg-yellow-100' : 'bg-green-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${estadoStock.color}`} />
                  <span className="text-xs font-medium text-gray-700">
                    {stockDisponible}
                  </span>
                </div>
              </div>
            </div>

            {/* Precio y stock info */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-gray-900">
                Bs. {precioNum.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className={`text-xs font-medium ${stockDisponible === 0 ? 'text-red-600' : stockBajo ? 'text-yellow-600' : 'text-green-600'}`}>
                {estadoStock.texto}
              </span>
            </div>
            {observacion && (
              <div className="mt-2 bg-blue-50 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <MessageSquare size={12} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800 flex-1">{observacion}</p>
                  <button
                    onClick={() => actualizarObservacion(producto.id, '')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Barra de progreso mini */}
          {stockMinimo > 0 && (
            <div className="mb-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${stockBajo ? 'bg-yellow-500' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stockDisponible / (stockMinimo * 2)) * 100, 100)}%`
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                <span>Alerta: {stockMinimo}</span>
              </div>
            </div>
          )}

          {/* Controles de cantidad - Optimizados */}
          <div className="flex items-center justify-between">
            {cantidad > 0 ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAgregar(producto, Math.max(0, cantidad - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200"
                >
                  <Minus size={14} className="text-gray-700" />
                </motion.button>

                <div className="min-w-[32px] text-center">
                  <span className="font-bold text-gray-900 text-lg">{cantidad}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAgregar(producto, cantidad + 1)}
                  disabled={!disponible}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200 disabled:opacity-50"
                >
                  <Plus size={14} className="text-gray-700" />
                </motion.button>
              </div>
            ) : (
              <div className="text-xs text-gray-500 px-1">
                {disponible ? 'No agregado' : 'Producto no disponible'}
              </div>
            )}

            {/* Botón principal */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (disponible) {
                  const nuevaCantidad = cantidad > 0 ? cantidad + 1 : 1
                  onAgregar(producto, nuevaCantidad)
                }
              }}
              disabled={!disponible}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm
                ${!disponible
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : cantidad > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }
                transition-colors duration-150
              `}
            >
              <ShoppingCart size={16} />
              <span className="whitespace-nowrap">
                {cantidad > 0 ? `+ ${cantidad}` : 'Agregar'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Indicador visual de cantidad seleccionada */}
      {cantidad > 0 && (
        <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500" />
      )}
    </motion.div>
  )
}
