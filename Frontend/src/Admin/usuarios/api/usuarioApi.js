import { instancia } from "../../../config/axios"

export const ObtenerUsuarios = async (page, filtroRol) => {
  const limit = 5
  const offset = (page - 1) * limit
  const response = await instancia.get(`/usuario/obtener?offset=${offset}&limit=${limit}&filtroRol=${filtroRol}`)
  
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

export const obtenerTotalUsuarios = async () => {
  const response = await instancia.get('/usuario/total-usuarios')
  return response.data
}

export const EliminarUsuario = async (id) => {
  const response = await instancia.delete(`/usuario/eliminar/${id}`)
  return response.data
}