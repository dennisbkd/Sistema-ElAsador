import React from 'react'
import { Navigate } from 'react-router'
import { getValidToken, getValidUser } from '../../utils/tokenUtils'

export const Rutaprotegida = ({ rolesPermitidos = [], children }) => {
  const token = getValidToken()
  const usuario = getValidUser()

  // Si no hay token válido, redirigir al login
  if (!token) {
    return <Navigate to="/" replace />
  }

  // Si no hay usuario o el usuario es inválido, redirigir al login
  if (!usuario || !usuario.rol) {
    return <Navigate to="/" replace />
  }

  // Admin tiene acceso a todo
  if (usuario.rol === 'ADMINISTRADOR') {
    return children
  }

  // Verificar si el rol está en los permitidos
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/autorizacion-restringida" replace />
  }

  return children
}
