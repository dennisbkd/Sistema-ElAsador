import { instancia } from "../../../../config/axios"

export const obtenerProductos = async ({ filtroCategoria, page, filtroActivo })=>{
  const limit = 5
  const offset = (page-1) * limit
  const res = await instancia.get(`/producto/obtener-productos?offset=${offset}&limit=${limit}&filtroCategoria=${filtroCategoria}&filtroActivo=${filtroActivo}`)
  return res.data
}

export const crearProducto = async ({data})=>{
  const res = await instancia.post('/producto/crear-producto', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}

export const editarProducto = async ({data, id}) => {
  console.log('Datos para editar el producto:',id)
  const res = await instancia.put(`/producto/actualizar/${id}`, data, {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}

export const obtenerProductoId = async (id) => {
  const res = await instancia.get(`/producto/obtener-producto/${id}`)
  return res.data
}

export const eliminarProducto = async (id)=>{
  const res = await instancia.delete(`/producto/eliminar/${id}`)
  return res.data
}

export const busquedaProductoNombre = async (nombre) => {
  const res = await instancia.get(`/producto/busqueda-producto-nombre?nombre=${nombre}`)
  return res.data
}

export const cambiarEstadoProducto = async ({id, activo}) => {
  const res = await instancia.put(`/producto/cambiar-estado/${id}`, { activo })
  return res.data
}