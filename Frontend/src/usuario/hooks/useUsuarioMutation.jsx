import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AgregarUsuario } from '../api/usuarioPeticion'
import toast from 'react-hot-toast'

export const useUsuarioMutation = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (body) => AgregarUsuario(body),

    onMutate: async (data) => {

      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['obtener'] })
      console.log('mutatuoin', data)
      const previousData = queryClient.getQueryData(['obtener'])
      const now = new Date()
      const newUsuario = {
        ...data,
        id: Math.random(),
        fecha: now.toISOString().split('T')[0], // YYYY-MM-DD
        hora: now.toTimeString().slice(0, 5),   // HH:MM
        activo: true
      }


      // Optimistic update
      queryClient.setQueryData(['obtener'], (old) => {
        if (!old) {
          return {
            DtoUsuario: [newUsuario],
            totales: {
              activos: newUsuario.activo ? 1 : 0,
              totalAdmin: newUsuario.rol.toLowerCase() === 'administrador' ? 1 : 0
            }
          }
        }

        return {
          ...old,
          DtoUsuario: [...old.DtoUsuario, newUsuario],
          totales: {
            activos: old.totales.activos + (newUsuario.activo ? 1 : 0),
            totalAdmin: old.totales.totalAdmin + (newUsuario.rol.toLowerCase() === 'administrador' ? 1 : 0)
          }
        }
      })

      return { newUsuario, previousData }
    },

    onError: (error, newUsuario, context) => {
      toast.error('Error al crear usuario')
      if (context?.previousData) {
        queryClient.setQueryData(['obtener'], context.previousData)
      }
    },

    onSuccess: (data, _, context) => {
      toast.success('Usuario creado exitosamente', { duration: 3000 })

      console.log({ data, _, context })
      // Reemplazar el dato optimístico con el real

      queryClient.setQueryData(['obtener'], (old) => {
        if (!old) return { DtoUsuario: [data], totales: calculateTotals([data]) }
        const usuariosActualizados = old.DtoUsuario.map(user =>
          user.id === context?.newUsuario.id ? { ...data } : user
        )
        return {
          ...old,
          DtoUsuario: usuariosActualizados,
          totales: calculateTotals(usuariosActualizados)
        }
      })
    },
  })

  return mutation
}

// Función helper para calcular totals
const calculateTotals = (usuarios) => ({
  activos: usuarios.filter(user => user.activo).length,
  totalAdmin: usuarios.filter(user => user.rol.toLowerCase() === 'administrador').length
})