import React from 'react'
import { useMemo } from 'react'
import z from 'zod'
import { useAuthLogin } from './useAuthQuery'

export const useFormLogin = () => {

  const iniciarSesionMutation = useAuthLogin()

  const iniciarSesion = (datos) => {
    iniciarSesionMutation.mutate(datos)
  }

  const logindataValues = useMemo(() => ({
    defaultValues: {
      usuario: '',
      password: ''
    }
  }), [])

  const loginSquema = z.object({
    usuario: z.string().min(2, 'El usuario debe tener al menos 2 caracteres'),
    password: z.string().nonempty('La contraseña es obligatoria')
  })


  return {
    logindataValues,
    loginSquema,
    iniciarSesion,
    iniciandoSesion: iniciarSesionMutation.isPending,
    iniciadoSesion: iniciarSesionMutation.isSuccess
  }
}
