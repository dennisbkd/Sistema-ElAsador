import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export const ModalObservacion = ({
  mostrarObservacion,
  producto,
  observacionLocal,
  setObservacionLocal,
  onActualizarObservacion,
  setMostrarObservacion,
  handleGuardarObservacion }) => {
  const handleOverlayClick = (e) => {
    // Solo cerrar si se hace click directamente en el overlay
    if (e.target === e.currentTarget) {
      setMostrarObservacion(false)
    }
  }
  return (
    <AnimatePresence>
      {mostrarObservacion && producto.esPreparado && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Observación para {producto.nombre}</h3>
                <p className="text-sm text-gray-600">Ej: "Sin sal", "Bien cocido", "Sin cebolla"</p>
              </div>
              <button
                onClick={() => setMostrarObservacion(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <textarea
              value={observacionLocal}
              onChange={(e) => setObservacionLocal(e.target.value)}
              onClick={(e) => e.stopPropagation()} // ← Esto también ayuda
              onFocus={(e) => e.stopPropagation()} // ← Prevenir en focus también
              placeholder="Escribe aquí las indicaciones especiales para la preparación..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={200}
            />

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {observacionLocal.length}/200 caracteres
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setObservacionLocal('')
                    onActualizarObservacion(producto.id, '')
                    setMostrarObservacion(false)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarObservacion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
