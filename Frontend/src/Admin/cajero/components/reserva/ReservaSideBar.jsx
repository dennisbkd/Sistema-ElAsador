// components/ReservaSidebar.jsx
import {
  MessageSquare,
  ShoppingBag,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Edit
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCallback, useState } from 'react'

export const ReservaSidebar = ({
  reservaData,
  setReservaData,
  carrito,
  onLimpiarCarrito,
  onCrearReserva,
  isPending,
  totalItems,
  total,
  actualizarObservacion
}) => {
  const [showClienteInfo, setShowClienteInfo] = useState(false)
  const [showObservaciones, setShowObservaciones] = useState(false)
  const [editingObservacion, setEditingObservacion] = useState(null)
  // Usa useCallback para handlers
  const handleObservacionChange = useCallback((e) => {
    setReservaData(prev => ({
      ...prev,
      observaciones: e.target.value
    }));
  }, [setReservaData]);

  // Preparar fecha para mañana si hoy es el día actual

  return (
    <div className="sticky top-6 h-[calc(100vh-1rem)] flex flex-col bg-white rounded-xl border border-gray-200 shadow-lg">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reserva</h2>
            <div className="flex items-center gap-2 mt-1">
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">Bs {total.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Sección de Información del Cliente - Acordeón */}
        <div className="mb-4">
          <button
            onClick={() => setShowClienteInfo(!showClienteInfo)}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información del Cliente *
            </h3>
            {showClienteInfo ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {showClienteInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={reservaData.clienteNombre}
                    onChange={(e) => setReservaData({ ...reservaData, clienteNombre: e.target.value })}
                    placeholder="Ingresa el nombre del cliente"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesa
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={reservaData.nroMesa || ''}
                      onChange={(e) => setReservaData({ ...reservaData, nroMesa: e.target.value || null })}
                      placeholder="Número"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Sección de Observaciones - Acordeón */}
        <div className="mb-4">
          <button
            onClick={() => setShowObservaciones(!showObservaciones)}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Observaciones
            </h3>
            {showObservaciones ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {showObservaciones && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <textarea
                  value={reservaData.observaciones || ''}
                  onChange={(e) => handleObservacionChange(e)}
                  placeholder="Aniversario, mesa cerca de la ventana, alergias alimentarias..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Productos seleccionados */}
        {totalItems > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Productos ({totalItems})
              </h3>
              <button
                onClick={onLimpiarCarrito}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar todo
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2">
              {Object.values(carrito).map((item) => {
                const esPreparado = item.producto.esPreparado
                const tieneObservacion = item.observaciones
                const estaEditando = editingObservacion === item.producto.id

                return (
                  <motion.div
                    key={item.producto.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {/* Header del producto */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.producto.nombre}
                        </h4>
                        {esPreparado && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ChefHat size={10} />
                            Preparado
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">
                          Bs {(item.producto.precio * item.cantidad).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.cantidad} × Bs {parseFloat(item.producto.precio).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Observación del producto (solo para productos preparados) */}
                    {esPreparado && (
                      <div className="mt-2">
                        {!estaEditando ? (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-1">
                                <MessageSquare size={12} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-700">
                                    {tieneObservacion || 'Sin observaciones'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setEditingObservacion(item.producto.id)}
                              className="ml-2 text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                            >
                              <Edit size={10} />
                              {tieneObservacion ? 'Editar' : 'Agregar'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={item.observaciones || ''}
                              onChange={(e) => actualizarObservacion(item.producto.id, e.target.value)}
                              placeholder="Instrucciones especiales para la preparación..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none"
                              rows="2"
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setEditingObservacion(null)}
                                className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => setEditingObservacion(null)}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer del sidebar - Total y botón */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="space-y-4">
          {/* Total */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Total a pagar</div>
              <div className="text-2xl font-bold text-gray-900">Bs {total.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{totalItems} productos</div>
            </div>
          </div>

          {/* Botón de confirmación */}
          <button
            onClick={onCrearReserva}
            disabled={isPending || !reservaData.clienteNombre || totalItems === 0}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando reserva...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirmar Reserva
              </>
            )}
          </button>

          {/* Mensajes de validación */}
          {(!reservaData.clienteNombre || totalItems === 0) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Requisitos pendientes:</p>
                  <ul className="mt-1 space-y-0.5">
                    {!reservaData.clienteNombre && <li>• Nombre del cliente</li>}
                    {totalItems === 0 && <li>• Agrega al menos un producto</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Notas importantes */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <ChefHat size={10} />
              <span>Los productos marcados como "Preparado" pueden tener observaciones especiales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}