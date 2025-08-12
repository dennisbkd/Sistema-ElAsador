import express, { json } from 'express'
import { Conexiondatabase } from './database/conexion.js'

import cors from 'cors'
import { rutaUsuario } from './router/usuario.js'

export const App = ({ usuarioServicio }) => {
  const app = express()
  const port = 3000

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }
  ))
  app.use(json())

  Conexiondatabase()

  // Montar el router en /usuario
  app.use('/usuario', rutaUsuario({ usuarioServicio }))

  app.listen(port, () => {
    console.log('Servidor activo en el puerto:', port)
  })
}
