import { instancia } from "../../../config/axios"

export const abrirCaja = async({ montoInicial })=>{
  const res = await instancia.post('/cajero/abrir-caja', montoInicial)
  return res.data
}

export const cerrarCaja = async({ body })=>{
  const res = await instancia.post('/cajero/cerrar-caja', body)
  return res.data
}

export const obtenerCajaAbierta = async()=>{
  const res = await instancia.get('/cajero/caja-abierta')
  return res.data
}

export const registrarPago = async({ ventaId, metodoPago })=>{
  const res = await instancia.post('/cajero/registrar-pago', { ventaId, metodoPago })
  return res.data
}