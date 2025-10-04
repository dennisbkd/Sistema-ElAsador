
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { EditarUsuario } from '../api/usuarioPeticion'
import toast from 'react-hot-toast'

export const useUsuarioActualizarMutation = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }) => EditarUsuario(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['obtener'] })
      const usuarioAnterior = queryClient.getQueryData(['obtener'])
      console.log('estado', data.activo)
      const esSuspension = Object.keys(data).length === 1 && 'activo' in data;
      queryClient.setQueryData(['obtener'], (old) => {
        if (!old) return old
        const usuariosActualizados = old.DtoUsuario.map((usuarioCache) =>
          usuarioCache.id === id ? esSuspension
            ? { ...usuarioCache, activo: data.activo }
            : { ...usuarioCache, ...data }
            : usuarioCache
        )
        const nuevosTotales = esSuspension
          ? {
            activos: data.activo
              ? old.totales.activos + 1  // Si se activa, +1 activo
              : old.totales.activos - 1,  // Si se suspende, -1 activo
            totalAdmin: old.totales.totalAdmin // Los admin no cambian
          }
          : calculateTotals(usuariosActualizados);

        return {
          ...old,
          DtoUsuario: usuariosActualizados,
          totales: nuevosTotales
        }
      })
      return { usuarioAnterior, id, esSuspension }
    },
    onSuccess: (usuarioEditado, _, context) => {

      const mensaje = context.esSuspension
        ? `Usuario ${usuarioEditado.activo ? 'activado' : 'suspendido'} exitosamente`
        : `Usuario ${usuarioEditado.nombre} actualizado exitosamente`;

      toast.success(mensaje)

      queryClient.setQueryData(['obtener'], (old) => {
        if (!old) return old
        const usuariosActualizados = old.DtoUsuario.map(usuario => {
          return usuario.id === context?.id ? usuarioEditado : usuario
        })
        console.log('actualizo', usuariosActualizados)
        return {
          ...old,
          DtoUsuario: usuariosActualizados,
          totales: calculateTotals(usuariosActualizados)
        }
      })
    },
    onError: (error, _, context) => {
      toast.error(context?.esSuspension
        ? 'Error al cambiar estado del usuario'
        : 'Error al actualizar usuario'
      );

      if (context?.previousData) {
        queryClient.setQueryData(['obtener'], context.previousData);
      }
    },
  })

  return mutation
}

const calculateTotals = (usuarios) => ({
  activos: usuarios.filter(user => user.activo).length,
  totalAdmin: usuarios.filter(user => user?.rol.toLowerCase() === 'administrador').length
})