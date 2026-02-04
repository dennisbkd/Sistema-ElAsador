import { Lock, RefreshCw } from 'lucide-react'

export const CajaHeader = ({ onRefresh, onCerrarCaja, isLoading }) => (
  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 mb-2">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Caja</h1>
        <p className="text-gray-600">Sistema de cobros y pagos</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>

        <button
          onClick={onCerrarCaja}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Cerrar Caja
        </button>
      </div>
    </div>
  </div>
)