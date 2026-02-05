// components/BusquedaProductos.jsx
import { Search, X } from "lucide-react"

export const BusquedaProductos = ({ nombreBusqueda, setNombreBusqueda }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar productos por nombre..."
        value={nombreBusqueda}
        onChange={(e) => setNombreBusqueda(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               transition-all duration-200 outline-none"
      />
      {nombreBusqueda && (
        <button
          onClick={() => setNombreBusqueda('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}