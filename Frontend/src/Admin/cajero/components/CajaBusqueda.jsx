// pages/cajero/components/CajaFilters.jsx
import { Search, X } from 'lucide-react'
import { BotonAccion } from '../../../ui/boton/BotonAccion'

export const CajaBusqueda = ({
  busqueda,
  onBusquedaChange,
  isLoading
}) => (
  <div className="px-6 pb-4">
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por cliente, mesa..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <BotonAccion
        icon={X}
        variant="edit"
        label={"Limpiar"}
        onClick={() => onBusquedaChange('')}
      />
    </div>
  </div>
)