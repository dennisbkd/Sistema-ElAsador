import { instancia } from "../../../config/axios"

export const IniciarSesion = async ({body})=>{
  const res = await instancia.post('/auth/iniciar-sesion', body)
  return res.data
}