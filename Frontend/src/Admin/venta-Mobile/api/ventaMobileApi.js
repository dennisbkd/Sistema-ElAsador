import { instancia } from "../../../config/axios"

export const obtenerVentaPorUsuario = async ({ filtroEstado }) => {
  const res = await instancia.get(`/venta/mobile/delDia?filtroEstado=${filtroEstado}`)
  return res.data
}

export const crearVentaMobile = async ({pedido}) => {
  const res = await instancia.post('/venta/registrar-venta', pedido)
  return res.data
}

export const agregarProductoAVentaMobile = async ({ ventaId, detalle }) => {
  const res = await instancia.post(`/venta/${ventaId}/agregar-producto`, detalle)
  return res.data
}

export const obtenerVentaIdMobile = async ({ventaId}) => {
  const res = await instancia.get(`/venta/${ventaId}`)
  return res.data
}