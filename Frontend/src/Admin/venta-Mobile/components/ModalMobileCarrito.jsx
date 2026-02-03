import { LucideShoppingBag, MessageSquare, Minus, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

export const ModalMobileCarrito = ({
  mostrarCarrito,
  actualizarObservacion,
  setMostrarCarrito,
  carrito,
  totalItems,
  removerProducto,
  handleAgregarProducto,
  limpiarCarrito,
  estaVacio,
  isPending,
  handleConfirmarPedido }) => {
  const [observacionEditando, setObservacionEditando] = useState(null)
  const [observacionTexto, setObservacionTexto] = useState('')

  const handleEditarObservacion = (productoId, observacionActual) => {
    setObservacionEditando(productoId)
    setObservacionTexto(observacionActual || '')
  }

  const handleGuardarObservacion = (productoId) => {
    actualizarObservacion(productoId, observacionTexto)
    setObservacionEditando(null)
    setObservacionTexto('')
  }

  return (
    <AnimatePresence>
      {mostrarCarrito && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMostrarCarrito(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-40 h-[100vh] flex flex-col"
          >
            {/* Header del modal - FIJADO ARRIBA */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tu Carrito</h2>
                  <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} seleccionados
                  </p>
                </div>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* CONTENEDOR SCROLLABLE - PRINCIPAL */}
            <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
              <div className="px-6 py-4">
                {Object.values(carrito).length > 0 ? (
                  <div className="space-y-4 pb-4">
                    {Object.values(carrito).map((item) => (
                      <motion.div
                        key={item.producto.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        {/* Imagen */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          {item.producto.imagen ? (
                            <img
                              src={item.producto.imagen.startsWith('http')
                                ? item.producto.imagen
                                : `${import.meta.env.VITE_API_URL}${item.producto.imagen}`
                              }
                              alt={item.producto.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LucideShoppingBag size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Información */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {item.producto.nombre}
                            </h3>
                            <button
                              onClick={() => removerProducto(item.producto.id)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          {/* Observación */}
                          {item.producto.esPreparado && (
                            <div className="mt-3">
                              {observacionEditando === item.producto.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={observacionTexto}
                                    onChange={(e) => setObservacionTexto(e.target.value)}
                                    placeholder="Indicaciones especiales..."
                                    className="w-full p-2 border rounded-lg text-sm"
                                    rows="2"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setObservacionEditando(null)}
                                      className="px-3 py-1 text-sm border rounded-lg flex-1"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleGuardarObservacion(item.producto.id)}
                                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg flex-1"
                                    >
                                      Guardar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0 mr-2">
                                    {item.observaciones ? (
                                      <div className="bg-blue-100 text-blue-800 rounded-lg p-2">
                                        <p className="text-sm truncate">{item.observaciones}</p>
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-sm">Sin observaciones</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleEditarObservacion(item.producto.id, item.observaciones)}
                                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                  >
                                    <MessageSquare size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAgregarProducto(item.producto, item.cantidad - 1)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold min-w-[24px] text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => handleAgregarProducto(item.producto, item.cantidad + 1)}
                                className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <span className="font-bold text-gray-900">
                              Bs. {(item.cantidad * parseFloat(item.producto.precio)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LucideShoppingBag size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">Tu carrito está vacío</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción - FIJADO ABAJO */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <button
                  onClick={limpiarCarrito}
                  disabled={estaVacio}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Vaciar Carrito
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarCarrito(false)
                    handleConfirmarPedido()
                  }}
                  disabled={estaVacio || isPending}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? "Procesando..." : "Continuar"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}