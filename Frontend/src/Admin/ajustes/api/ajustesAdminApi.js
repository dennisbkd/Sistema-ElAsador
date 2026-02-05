import { instancia } from "../../../config/axios"

export const obtenerVentasAdmin = async ({filtros, page})=>{
  const limit = 5
  const offset = (page - 1) * limit
  const res = await instancia.get(`/admin/ventas-admin?filtroEstado=${filtros?.filtroEstado}&tipoVenta=${filtros?.tipoVenta}&limit=${limit}&offset=${offset}`)
  return res.data
}

export const obtenerVentaPorId = async (ventaId)=>{
  const res =  await instancia.get(`/admin/venta-admin/${ventaId}`)
  return res.data
}

export const agregarProductoAPedidoMesero = async ({ventaId, detalle})=>{
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/agregar-producto-mesero`, detalle)
  return res.data
}

export const asignarReservaAMesero = async ({ventaId, body})=>{
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/asignar-reserva-mesero`, body)
  return res.data
}

export const anularProductosDeVenta = async (ventaId, productoData)=>{
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/anular-producto`, productoData)
  return res.data
}

export const anularVenta = async (ventaId)=>{
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/anular-venta`)
  return res.data
}

export const cambiarEstadoVenta = async (ventaId, nuevoEstado)=>{
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/cambiar-estado`, {nuevoEstado})
  return res.data
}

export const imprimirComandaCocina = async (ventaId) => {
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/imprimir-comanda-cocina`)
  return res.data
}

export const imprimirVenta = async (ventaId) => {
  const res = await instancia.post(`/admin/venta-admin/${ventaId}/imprimir-venta`)
  return res.data
}