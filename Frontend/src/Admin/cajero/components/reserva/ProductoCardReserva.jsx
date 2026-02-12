// pages/reservas/components/ProductoCardReserva.jsx
import { motion } from 'motion/react'
import { ChefHat, Package, Plus, Minus, ShoppingCart, MessageSquare, Clock } from 'lucide-react'
import { useState } from 'react'
import { getProductImageUrl } from '../../../../utils/imageURL'

export const ProductoCardReserva = ({
  producto,
  onAgregar,
  cantidad = 0,
  observacion = '',
  actualizarObservacion
}) => {
  const precioNum = parseFloat(producto.precio)
  const stockDisponible = producto.stock?.cantidad || 0
  const stockMinimo = producto.stock?.cantidadMinima || 0
  const stockBajo = stockDisponible > 0 && stockDisponible <= stockMinimo
  const disponible = stockDisponible > 0
  const [showObservacion, setShowObservacion] = useState(false)
  const [nuevaObservacion, setNuevaObservacion] = useState(observacion)

  // Manejo de imagen
  const imagen = getProductImageUrl(producto.imagen)
  const pathImagen = imagen.startsWith('http') ? imagen : `${import.meta.env.VITE_API_URL}${imagen}`

  const handleAgregarObservacion = () => {
    if (nuevaObservacion.trim()) {
      actualizarObservacion(producto.id, nuevaObservacion.trim())
    }
    setShowObservacion(false)
  }

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Imagen y header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {pathImagen ? (
          <img
            src={pathImagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {producto.esPreparado && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
              <ChefHat size={12} />
              <span>Preparado</span>
            </div>
          )}

          {stockBajo && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
              <Clock size={12} />
              <span>Stock bajo</span>
            </div>
          )}
        </div>

        {/* Contador de cantidad */}
        {cantidad > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 
                     text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
          >
            {cantidad}
          </motion.div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre y precio */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1">
            {producto.nombre}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              Bs {precioNum.toFixed(2)}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stockDisponible === 0
              ? 'bg-red-100 text-red-700'
              : stockBajo
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
              }`}>
              {stockDisponible} disponibles
            </span>
          </div>
        </div>

        {/* Descripción */}
        {producto.descripcion && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Observaciones */}
        {observacion && !showObservacion && (
          <div className="mb-3 bg-blue-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageSquare size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 flex-1">{observacion}</p>
              <button
                onClick={() => {
                  setNuevaObservacion(observacion)
                  setShowObservacion(true)
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Editar
              </button>
            </div>
          </div>
        )}

        {showObservacion && (
          <div className="mb-3 space-y-2">
            <textarea
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              placeholder="Ej: Sin sal, bien cocido, etc."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAgregarObservacion}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowObservacion(false)
                  setNuevaObservacion(observacion)
                }}
                className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex items-center justify-between">
          {/* Botones de cantidad */}
          {cantidad > 0 ? (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onAgregar(producto, Math.max(0, cantidad - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full 
                         hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                <Minus size={16} className="text-gray-700" />
              </motion.button>

              <div className="min-w-[40px] text-center">
                <span className="font-bold text-gray-900">{cantidad}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onAgregar(producto, cantidad + 1)}
                disabled={!disponible}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full 
                         hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <Plus size={16} className="text-gray-700" />
              </motion.button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {disponible ? 'No agregado' : 'No disponible'}
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
              px-4 py-2 rounded-lg font-medium flex items-center gap-2
              transition-all duration-200
              ${!disponible
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : cantidad > 0
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
              }
            `}
          >
            <ShoppingCart size={18} />
            <span className='font-bold'>
              +
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}