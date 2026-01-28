import { useMutation } from '@tanstack/react-query'
import { IniciarSesion } from '../api/authApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const useAuthLogin = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['auth-login'],
    mutationFn: (body) => IniciarSesion({ body }),
    onSuccess: (data) => {
      // guardar el token en el localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      // redigir al usuario segun su rol

      const rol = data.usuario.rol
      if (rol === 'ADMINISTRADOR') {
        navigate('/home', { replace: true })
      }
      if (rol === 'MESERO') {
        navigate('/mesero', { replace: true })
      }
      if (rol === 'CAJERO') {
        navigate('/cajero', { replace: true })
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.mensaje || 'Error al iniciar sesión')
    }
  })
}