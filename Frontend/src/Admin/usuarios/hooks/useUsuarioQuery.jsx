import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ObtenerUsuarios, CrearUsuario, EditarUsuario, CambiarEstadoUsuario } from "../api/usuarioApi";
import toast from "react-hot-toast";

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: ObtenerUsuarios,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export const useCrearUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['crear-usuario'],
    mutationFn: (data) => CrearUsuario(data),

    onSuccess: () => {
      toast.success('Usuario creado con éxito')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}

export const useEditarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['editar-usuario'],
    mutationFn: ({ id, data }) => EditarUsuario(id, data),
    onSuccess: () => {
      toast.success('Usuario editado con éxito')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}

export const useCambiarEstadoUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['cambiar-estado-usuario'],
    mutationFn: (id) => CambiarEstadoUsuario(id),
    onSuccess: () => {
      toast.success('Estado de usuario cambiado con éxito')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}
