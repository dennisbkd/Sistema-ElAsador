// pages/cajero/components/CajaFilters.jsx
import { Search } from 'lucide-react'

export const CajaFilters = ({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onEstadoChange,
  estadosFiltro,
  isLoading
}) => (
  <div className="px-6 pb-4">
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por código, cliente, mesa..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        {estadosFiltro.map(estado => {
          const Icon = estado.icon
          return (
            <button
              key={estado.valor}
              onClick={() => onEstadoChange(estado.valor)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${filtroEstado === estado.valor
                  ? estado.valor === 'PENDIENTE' ? 'bg-yellow-600 text-white' :
                    estado.valor === 'PAGADO' ? 'bg-green-600 text-white' :
                      'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              disabled={isLoading}
            >
              <Icon className="w-4 h-4" />
              {estado.label}
            </button>
          )
        })}
      </div>
    </div>
  </div>
)