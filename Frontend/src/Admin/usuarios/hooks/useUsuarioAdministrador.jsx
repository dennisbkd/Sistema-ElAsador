import { useCambiarEstadoUsuario, useUsuarios } from "./useUsuarioQuery"


export const useUsuarioAdministrador = () => {
  const { data: usuarios = [], error, isLoading } = useUsuarios()
  const estadoUsuarioMutation = useCambiarEstadoUsuario()

  const cambiarEstadoUsuario = (id) => {
    estadoUsuarioMutation.mutate(id)
  }

  return {
    usuarios,
    error,
    isLoading,
    cambiarEstadoUsuario,
    estaCambiandoEstado: estadoUsuarioMutation.isPending
  }
}
