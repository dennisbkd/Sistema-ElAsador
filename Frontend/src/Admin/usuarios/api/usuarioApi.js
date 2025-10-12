import { instancia } from "../../../config/axios"

export const ObtenerUsuarios = async () => {
  const response = await instancia.get('/usuario/obtener')

  return response.data
}

export const CrearUsuario = async (data) => {
  const response = await instancia.post('/usuario/agregar', data)
  return response.data
}

export const EditarUsuario = async (id, data) => {
  const response = await instancia.put(`/usuario/actualizar/${id}`, data)
  return response.data
}

export const CambiarEstadoUsuario = async (id) => {
  const response = await instancia.put(`/usuario/cambiar-estado/${id}`)
  return response.data
}