// components/ModalMetodoPago.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QrCode, DollarSign, X, Coins } from 'lucide-react'

export const ModalMetodoPago = ({ isOpen, onClose, onConfirmar, total }) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null)
  const [cambio, setCambio] = useState(0)
  const [montoRecibido, setMontoRecibido] = useState('')

  const totalVenta = parseFloat(total)
  const montoRecibidoNum = parseFloat(montoRecibido) || 0
  // Calcular cambio cuando el método es EFECTIVO y hay monto recibido
  useEffect(() => {
    if (metodoSeleccionado === 'EFECTIVO' && montoRecibidoNum > 0) {
      const cambioCalculado = montoRecibidoNum - totalVenta
      setCambio(cambioCalculado > 0 ? cambioCalculado : 0)
    } else {
      setCambio(0)
    }
  }, [metodoSeleccionado, montoRecibidoNum, totalVenta])

  const handleConfirmar = () => {
    if (metodoSeleccionado) {
      onConfirmar(metodoSeleccionado)
      onClose()
      setCambio(0)
      setMontoRecibido('')
      setMetodoSeleccionado(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose()
              setMetodoSeleccionado(null)
            }}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
              {/* Header compacto */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">Método de pago</h3>
                <button
                  onClick={() => {
                    onClose()
                    setMetodoSeleccionado(null)
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Opciones de pago - Minimalista */}
              <div className="p-4">
                <div className="space-y-2">
                  {/* Opción QR */}
                  <button
                    onClick={() => setMetodoSeleccionado('QR')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
                      ${metodoSeleccionado === 'QR'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${metodoSeleccionado === 'QR' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <QrCode size={20} className={metodoSeleccionado === 'QR' ? 'text-purple-600' : 'text-gray-600'} />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-900">QR</span>
                    {metodoSeleccionado === 'QR' && (
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </button>

                  {/* Opción Efectivo */}
                  <button
                    onClick={() => setMetodoSeleccionado('EFECTIVO')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
                      ${metodoSeleccionado === 'EFECTIVO'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${metodoSeleccionado === 'EFECTIVO' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <DollarSign size={20} className={metodoSeleccionado === 'EFECTIVO' ? 'text-green-600' : 'text-gray-600'} />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-900">Efectivo</span>
                    {metodoSeleccionado === 'EFECTIVO' && (
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    )}
                  </button>
                </div>

                {/* Sección de cálculo de cambio - Se muestra cuando se selecciona EFECTIVO */}
                {metodoSeleccionado === 'EFECTIVO' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Monto recibido */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h5 className="font-medium text-gray-900">Monto Recibido</h5>
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-medium">
                          Bs
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={montoRecibido}
                          onChange={(e) => setMontoRecibido(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 text-2xl font-bold text-gray-900 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                          placeholder="0.00"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Resumen de cambio */}
                    {montoRecibidoNum > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {/* Total */}
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              Bs {totalVenta.toFixed(2)}
                            </p>
                          </div>

                          {/* Recibido */}
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Recibido</p>
                            <p className="text-lg font-bold text-green-600">
                              Bs {montoRecibidoNum.toFixed(2)}
                            </p>
                          </div>

                          {/* Cambio */}
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Cambio</p>
                            <div className="flex items-center justify-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-600" />
                              <p className={`text-lg font-bold ${cambio > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                                Bs {cambio.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer con botón de confirmar */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={handleConfirmar}
                  disabled={!metodoSeleccionado}
                  className={`
                    w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all
                    ${metodoSeleccionado
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}