// components/detalleComponents/AsignarMeseroModal.jsx
import { X, UserCheck, Users, Table } from 'lucide-react'
import { UsuarioFiltro } from '../reserva/UsuarioFiltro'
import { useState, useEffect } from 'react'

export const AsignarMeseroModal = ({
  isOpen,
  onClose,
  venta,
  onAsignarMesero,
  isAsignando
}) => {
  const [meseroId, setMeseroId] = useState(venta.mesero?.id || null)
  const [mesa, setMesa] = useState(venta.nroMesa || 0)

  // Resetear valores cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setMeseroId(venta.mesero?.id || null)
      setMesa(venta.nroMesa || 0)
    }
  }, [isOpen, venta])

  const handleSubmit = () => {
    if (!meseroId) {
      alert('Por favor selecciona un mesero')
      return
    }

    onAsignarMesero({
      meseroId,
      nroMesa: mesa || null
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Asignar Mesero</h3>
              <p className="text-sm text-gray-600">Venta #{venta.codigo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isAsignando}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Información actual */}
          {venta.mesero && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-blue-700">Mesero actual:</p>
              <p className="text-sm text-blue-600">{venta.mesero}</p>
            </div>
          )}

          {/* Campo Mesero */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Mesero *
            </label>
            <UsuarioFiltro
              usuarioId={meseroId}
              setUsuarioId={setMeseroId}
              placeholder="Elige un mesero..."
            />
          </div>

          {/* Campo Mesa */}
          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Table className="w-4 h-4" />
              Número de Mesa
            </label>
            <input
              type="number"
              min="1"
              value={mesa}
              onChange={(e) => setMesa(Number(e.target.value))}
              placeholder="Ej: 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isAsignando}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg 
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!meseroId || isAsignando}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2"
            >
              {isAsignando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Asignando...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  {venta.mesero ? 'Actualizar' : 'Asignar'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}