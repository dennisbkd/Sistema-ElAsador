import instancia from "../../config/axios";

export const ObtenerUsuarios = async () => {
  const response = await instancia.get("/usuario/obtener");
  return response.data;
}

export const EditarUsuario = async (id, data) =>{
  const response = await instancia.put(`/usuario/actualizar/${id}`, data)
   return response.data
}

export const AgregarUsuario = async (body) => {
  const respuesta = await instancia.post('/usuario/agregar', body)
  return respuesta.data
}