// pages/cajero/components/CajaEmptyState.jsx
import { DollarSign } from 'lucide-react'

export const CajaEmptyState = ({ busqueda, onLimpiarBusqueda }) => (
  <div className="text-center py-20">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <DollarSign className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      {busqueda ? 'No se encontraron ventas' : 'No hay ventas pendientes'}
    </h3>
    <p className="text-gray-500">
      {busqueda
        ? 'No se encontraron ventas con esa búsqueda'
        : 'Todas las ventas han sido pagadas'
      }
    </p>
    {busqueda && (
      <button
        onClick={onLimpiarBusqueda}
        className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
      >
        Limpiar búsqueda
      </button>
    )}
  </div>
)