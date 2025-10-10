import { instancia } from "../../../config/axios"

export const ObtenerUsuarios = async () => {
  const response = await instancia.get('/usuario/obtener')

  return response.data
}

export const CrearUsuario = async (data) => {
  const response = await instancia.post('/usuario/agregar', data)
  return response.data
}