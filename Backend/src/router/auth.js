import { Router } from 'express'
import { AuthControlador } from '../controller/auth.js'

export const rutaAuth = ({ authServicio }) => {
  const ruta = Router()
  const authControlador = new AuthControlador({ authServicio })

  ruta.post('/iniciar-sesion', authControlador.iniciarSesion)

  return ruta
}
