// components/CategoriasFiltro.jsx
import { SpinnerCargando } from "../../../../ui/spinner/SpinnerCargando"
import { Filter } from "lucide-react"
import { useCategoriaManager } from "../../../gestion-items/categoria/hooks/useCategoriaManager"

export const CategoriasFiltro = ({ categoriaId, setCategoriaId }) => {
  const { categorias, isLoading } = useCategoriaManager({ filtro: '', limit: 50 })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <SpinnerCargando tamaño="sm" />
        <span className="text-sm">Cargando categorías...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <select
        value={categoriaId || ''}
        onChange={(e) => setCategoriaId(e.target.value || null)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               transition-all duration-200 outline-none appearance-none bg-white"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}