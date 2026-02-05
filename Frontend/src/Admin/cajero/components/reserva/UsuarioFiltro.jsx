// components/reserva/UsuarioFiltro.jsx
import { SpinnerCargando } from "../../../../ui/spinner/SpinnerCargando"
import { Filter } from "lucide-react"
import { useUsuarioAdministrador } from "../../../usuarios/hooks/useUsuarioAdministrador"

export const UsuarioFiltro = ({
  usuarioId,
  setUsuarioId,
  placeholder = "Seleccionar mesero...",
  className = "",
  disabled = false
}) => {
  const { usuarios, isLoading: isLoadingUsuarios } = useUsuarioAdministrador({ rol: 'MESERO' })

  if (isLoadingUsuarios) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <SpinnerCargando tamaño="sm" />
        <span className="text-sm">Cargando usuarios...</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <select
        value={usuarioId || ''}
        onChange={(e) => {
          // Solo actualiza el estado local, no llama a la API
          setUsuarioId(e.target.value || null)
        }}
        disabled={disabled}
        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               transition-all duration-200 outline-none appearance-none bg-white
               ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {usuarios.map((usuario) => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}