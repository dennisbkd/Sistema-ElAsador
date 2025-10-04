import express, { json } from 'express'
import { Conexiondatabase } from './database/conexion.js'

import cors from 'cors'
import { rutaUsuario } from './router/usuario.js'
import { rutaVentas } from './router/ventas.js'
import { rutaStock } from './router/stock.js'

export const App = ({ usuarioServicio, ventaServicio, stockServicio }) => {
  const app = express()
  const port = 3000

  app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.9:5173'],
    credentials: true
  }
  ))
  app.use(json())

  Conexiondatabase()

  // Montar el router en /usuario
  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/venta', rutaVentas({ ventaServicio }))
  app.use('/stock', rutaStock({ stockServicio }))

  app.listen(port, () => {
    console.log('Servidor activo en el puerto:', port)
  })
}
