import React from 'react'
import { Navigate } from 'react-router'

export const Rutaprotegida = ({ rolesPermitidos = [], children }) => {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}

  if (!token) {
    return <Navigate to="/" replace />
  }
  if (usuario.rol === 'ADMINISTRADOR') {
    return children
  }

  // Verificar si el rol está en los permitidos
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/autorizacion-restringida" replace />
  }
  return children
}
