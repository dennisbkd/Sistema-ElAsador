// components/reserva/UsuarioFiltro.jsx
import { SpinnerCargando } from "../../../../ui/spinner/SpinnerCargando"
import { useUsuarioAdministrador } from "../../../usuarios/hooks/useUsuarioAdministrador"
import { SelectOption } from "../../../../components/SelectOption"

export const UsuarioFiltro = ({
  usuarioId,
  setUsuarioId,
  placeholder = "Seleccionar mesero...",
  className = "",
  disabled = false
}) => {
  const { usuarios, isLoading: isLoadingUsuarios } = useUsuarioAdministrador({ rol: 'MESERO', limit: 100, activo: true })

  if (isLoadingUsuarios) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <SpinnerCargando tamaño="sm" />
        <span className="text-sm">Cargando usuarios...</span>
      </div>
    )
  }

  // Convertir datos de usuarios al formato que necesita SelectOption
  const usuariosOptions = usuarios.map((usuario) => ({
    value: String(usuario.id),
    label: usuario.nombre
  }))

  return (
    <div className={`${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
      <SelectOption
        props={{ className }}
        value={usuarioId ? String(usuarioId) : ''}
        placeholder={placeholder}
        options={usuariosOptions}
        selectValue={(value) => {
          if (!disabled) {
            // Solo actualiza el estado local, no llama a la API
            setUsuarioId(value ? Number(value) : null)
          }
        }}
      />
    </div>
  )
}