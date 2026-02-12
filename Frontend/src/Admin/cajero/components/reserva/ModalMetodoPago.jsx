// components/ModalMetodoPago.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QrCode, DollarSign, X } from 'lucide-react'

export const ModalMetodoPago = ({ isOpen, onClose, onConfirmar }) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null)

  const handleConfirmar = () => {
    if (metodoSeleccionado) {
      onConfirmar(metodoSeleccionado)
      onClose()
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden">
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