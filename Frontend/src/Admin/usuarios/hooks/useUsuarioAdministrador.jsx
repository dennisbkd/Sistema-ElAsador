import { useModal } from "../../../hooks/useModal"
import { useCambiarEstadoUsuario, useEliminarUsuario, useTotalUsuarios, useUsuarios } from "./useUsuarioQuery"


export const useUsuarioAdministrador = ({ rol, activo, limit = 5 }) => {
  const modalEliminar = useModal()
  const { usuarioQuery, siguiente, anterior, filtrarRol, page } = useUsuarios({ rol, activo, limit })
  const { data: totalUsuarios, isLoading: isLoadingTotal, error: errorTotal } = useTotalUsuarios()
  const eliminarUsuarioMutation = useEliminarUsuario()
  const estadoUsuarioMutation = useCambiarEstadoUsuario()

  const eliminarUsuario = (id) => {
    eliminarUsuarioMutation.mutate(id)
  }

  const cambiarEstadoUsuario = (id) => {
    estadoUsuarioMutation.mutate(id)
  }

  return {
    usuarios: usuarioQuery?.data || [],
    page,
    error: usuarioQuery.error,
    isLoading: usuarioQuery.isLoading,
    totalUsuarios: totalUsuarios || [],
    errorTotal,
    isLoadingTotal,
    cambiarEstadoUsuario,
    siguiente,
    anterior,
    eliminarUsuario,
    filtrarRol,
    modalEliminar,
    estaCambiandoEstado: estadoUsuarioMutation.isPending || eliminarUsuarioMutation.isPending
  }
}
