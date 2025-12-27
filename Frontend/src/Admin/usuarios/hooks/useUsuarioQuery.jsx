import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ObtenerUsuarios, CrearUsuario, EditarUsuario, CambiarEstadoUsuario, obtenerTotalUsuarios, EliminarUsuario } from "../api/usuarioApi";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

export const useUsuarios = ({ rol }) => {
  const [page, setPage] = useState(1);
  const usuarioQuery = useQuery({
    queryKey: ['usuarios', { page, rol }],
    queryFn: () => ObtenerUsuarios(page, rol),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  const siguiente = () => {
    if (usuarioQuery.data?.length === 0) {
      return
    }

    setPage((prev) => prev + 1)
  }

  const anterior = () => {
    if (page === 1) {
      return
    }
    setPage((prev) => prev - 1)
  }

  useEffect(() => {
    setPage(1)
  }, [rol])

  return {
    usuarioQuery,
    page,
    siguiente,
    anterior
  }
}

export const useCrearUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['crear-usuario'],
    mutationFn: (data) => CrearUsuario(data),

    onSuccess: () => {
      toast.success('Usuario creado con éxito')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      queryClient.invalidateQueries({ queryKey: ['total-usuarios'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al crear el usuario')
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
      queryClient.invalidateQueries({ queryKey: ['total-usuarios'] })
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
      queryClient.invalidateQueries({ queryKey: ['total-usuarios'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al cambiar el estado del usuario')
    }
  })
}

export const useTotalUsuarios = () => {

  return useQuery({
    queryKey: ['total-usuarios'],
    queryFn: obtenerTotalUsuarios,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

export const useEliminarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['eliminar-usuario'],
    mutationFn: (id) => EliminarUsuario(id),
    onSuccess: () => {
      toast.success('Usuario eliminado con éxito')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      queryClient.invalidateQueries({ queryKey: ['total-usuarios'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Error al eliminar el usuario')
    }
  })
}
