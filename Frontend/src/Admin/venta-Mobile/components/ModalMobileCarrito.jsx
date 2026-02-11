// ModalMobileCarrito.jsx
import { LucideShoppingBag, MessageSquare, Minus, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { getProductImageUrl } from "../../../utils/imageURL"

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

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (mostrarCarrito) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }, [mostrarCarrito])

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
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal - CORREGIDO */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
            style={{ maxHeight: '100dvh' }}
          >
            {/* Header - ABSOLUTAMENTE FIJO */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tu Carrito</h2>
                  <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} seleccionados
                  </p>
                </div>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="p-2 hover:bg-gray-100 rounded-full active:bg-gray-200"
                  aria-label="Cerrar carrito"
                >
                  <X size={24} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* CONTENIDO SCROLLABLE - OPTIMIZADO PARA MÓVIL */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                paddingBottom: 'env(safe-area-inset-bottom, 16px)'
              }}
            >
              <div className="px-6 py-4">
                {Object.values(carrito).length > 0 ? (
                  <div className="space-y-4 pb-8">
                    {Object.values(carrito).map((item) => (
                      <motion.div
                        key={item.producto.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                      >
                        {/* Imagen */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          {item.producto.imagen ? (
                            <img
                              src={item.producto.imagen.startsWith('http')
                                ? getProductImageUrl(item.producto.imagen)
                                : `${import.meta.env.VITE_API_URL}${getProductImageUrl(item.producto.imagen)}`
                              }
                              alt={item.producto.nombre}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LucideShoppingBag size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Información */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 text-base line-clamp-2 pr-2">
                              {item.producto.nombre}
                            </h3>
                            <button
                              onClick={() => removerProducto(item.producto.id)}
                              className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                              aria-label="Eliminar producto"
                            >
                              <X size={20} />
                            </button>
                          </div>

                          {/* Observación */}
                          {item.producto.esPreparado && (
                            <div className="mt-2">
                              {observacionEditando === item.producto.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={observacionTexto}
                                    onChange={(e) => setObservacionTexto(e.target.value)}
                                    placeholder="Ej: Sin cebolla, bien cocido, etc..."
                                    className="w-full p-3 border rounded-lg text-sm bg-white"
                                    rows="3"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setObservacionEditando(null)}
                                      className="flex-1 px-3 py-2 text-sm border rounded-lg bg-white"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleGuardarObservacion(item.producto.id)}
                                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg"
                                    >
                                      Guardar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEditarObservacion(item.producto.id, item.observaciones)}
                                  className="w-full text-left group"
                                >
                                  <div className={`p-2 rounded-lg ${item.observaciones
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    <div className="flex items-center gap-1">
                                      <MessageSquare size={14} />
                                      <span className="text-xs font-medium flex-1">
                                        {item.observaciones || 'Agregar observación'}
                                      </span>
                                    </div>
                                    {item.observaciones && (
                                      <p className="text-xs mt-1 line-clamp-2">
                                        {item.observaciones}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Controles de cantidad y precio */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
                              <button
                                onClick={() => handleAgregarProducto(item.producto, item.cantidad - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-300"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-bold min-w-[28px] text-center text-base">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => handleAgregarProducto(item.producto, item.cantidad + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-300"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <span className="font-bold text-gray-900 text-base">
                              Bs. {(item.cantidad * parseFloat(item.producto.precio)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <LucideShoppingBag size={40} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Tu carrito está vacío</p>
                    <p className="text-gray-500 text-sm mt-1">Agrega productos para continuar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - FIJO */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6 shadow-lg">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={limpiarCarrito}
                    disabled={estaVacio}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl active:bg-gray-100 disabled:opacity-50 disabled:active:bg-transparent transition-colors"
                  >
                    Vaciar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarCarrito(false)
                      handleConfirmarPedido()
                    }}
                    disabled={estaVacio || isPending}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl active:bg-blue-800 disabled:opacity-50 disabled:active:bg-blue-600 transition-colors"
                  >
                    {isPending ? "Procesando..." : "Confirmar Pedido"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}