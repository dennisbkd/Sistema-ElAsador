import express, { json } from 'express'
import path from 'node:path'
import { createServer } from 'node:http'
import cors from 'cors'

import { Conexiondatabase } from './database/conexion.js'

import { rutaUsuario } from './router/usuario.js'
import { rutaVentas } from './router/ventas.js'
import { rutaStock } from './router/stock.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProducto } from './router/producto.js'
import { SocketConfig } from './config/socket.js'

export const App = ({ usuarioServicio, ventaServicio, stockServicio, categoriaServicio, productoServicio }) => {
  const app = express()
  const port = 3000

  app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.9:5173'],
    credentials: true
  }
  ))
  app.use(json())

  Conexiondatabase()
  app.use('/uploads', express.static(path.resolve('uploads')))
  // Montar el router en /usuario
  app.use('/usuario', rutaUsuario({ usuarioServicio }))
  app.use('/venta', rutaVentas({ ventaServicio }))
  app.use('/stock', rutaStock({ stockServicio }))
  app.use('/categoria', rutaCategoria({ categoriaServicio }))
  app.use('/producto', rutaProducto({ productoServicio }))

  const server = createServer(app)
  const io = SocketConfig(server)

  app.set('io', io)
  server.listen(port, () => {
    console.log('Servidor activo en el puerto:', port)
  })
}
