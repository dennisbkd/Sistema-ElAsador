import { useUsuarios } from "./useUsuarioQuery"


export const useUsuarioAdministrador = () => {
  const { data: usuarios = [], error, isLoading } = useUsuarios()

  return {
    usuarios,
    error,
    isLoading
  }
}
