import { instancia } from "../../../../config/axios"

export const obtenerCategorias = async({ page = 1, filtro})=>{
  const limit = 5
  const offset = (page-1) * limit
  const res = await instancia.get(`/categoria/obtener?offset=${offset}&limit=${limit}&filtroTipo=${filtro}`)
  return res.data 
}

export const crearCategoria = async ({data}) => {
  const res = await instancia.post('/categoria/crear', data)

  return res.data
}

export const editarCategoria = async ({id, data})=>{
  const res = await instancia.put(`/categoria/actualizar/${id}`, data)
  return res.data
}

export const eliminarCategoria = async({id})=>{
  const res =await instancia.delete(`/categoria/eliminar/${id}`)
  return res.data
}