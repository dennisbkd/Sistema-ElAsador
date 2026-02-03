import { useState } from "react"
import { motion } from "framer-motion"
import { X, Search, Plus, Minus } from "lucide-react"
import { useProductoManager } from "../../gestion-items/producto/hooks/useProductoManager"
import { SpinnerCargando } from "../../../ui/spinner/SpinnerCargando"
import { useDebonce } from "../../gestion-items/producto/hooks/useDebonce"
import { ErrorMessage } from "../../../ui/ErrorMessage"

export const ModalAgregarProducto = ({ isOpen, onClose, onAgregar, pedidoId, isPending }) => {
  const [busqueda, setBusqueda] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [observacion, setObservacion] = useState('')
  const nombreDebonce = useDebonce({ value: busqueda, delay: 300 })

  const { productosEncontrados = [], isLoadingBusqueda, isErrorBusqueda } = useProductoManager({ nombre: nombreDebonce, activo: true })

  const resetearDetalles = () => {
    setProductoSeleccionado(null)
    setCantidad(1)
    setObservacion('')
    setBusqueda('')
    onClose()
  }

  const handleAgregar = () => {
    if (!productoSeleccionado) return

    onAgregar({
      ventaId: pedidoId,
      detalle: [{
        productoId: productoSeleccionado.id,
        cantidad: parseInt(cantidad) || 1,
        observaciones: observacion.trim() || null
      }]
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Agregar Producto a la Orden</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar producto por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="mb-4">
            {isErrorBusqueda && (
              <ErrorMessage mensaje='Error al cargar los productos.'
                titulo='Error al solicitar los productos'
                onRetry={() => window.location.reload()}
              />
            )}
            {isLoadingBusqueda ? (
              <SpinnerCargando
                texto="Buscando productos..."
                tamaño="md"
              />
            ) : productosEncontrados?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {productosEncontrados?.map(producto => (
                  <button
                    key={producto.id}
                    onClick={() => setProductoSeleccionado(producto)}
                    className={`p-3 border rounded-lg text-left transition-colors ${productoSeleccionado?.id === producto.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">Bs {Number(producto.precio)?.toFixed(2)}</p>
                    {producto.stock && (
                      <p className="text-xs text-gray-500">Stock: {producto.stock.cantidad}</p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {busqueda ? 'No se encontraron productos' : 'Escribe para buscar productos'}
              </div>
            )}
          </div>

          {/* Detalles del producto seleccionado */}
          {productoSeleccionado && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {productoSeleccionado.nombre}
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(c => Math.max(1, c - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <button
                      onClick={() => setCantidad(c => c + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Ej: Sin picante, bien cocido, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total a agregar:</p>
                  <p className="text-lg font-bold text-gray-900">
                    Bs {Number(productoSeleccionado.precio * cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex gap-3">
            <button
              onClick={resetearDetalles}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgregar}
              disabled={!productoSeleccionado || isPending}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar a la Orden
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}