import express, { json } from 'express'
import path from 'node:path'
import { createServer } from 'node:http'
import { corsMiddleware } from './config/corsUrl.js'
import { Conexiondatabase } from './database/conexion.js'

import { rutaUsuario } from './router/usuario.js'
import { rutaVentas } from './router/ventas.js'
import { rutaStock } from './router/stock.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProducto } from './router/producto.js'
import { SocketConfig } from './config/socket.js'
import { rutaAuth } from './router/auth.js'
import { decodificarToken } from '../middleware/DecodificarToken.js'

export const App = ({ usuarioServicio, ventaServicio, stockServicio, categoriaServicio, productoServicio, authServicio }) => {
  const app = express()
  const port = 3000

  app.use(corsMiddleware())
  app.use(json())

  Conexiondatabase()
  app.use('/uploads', express.static(path.resolve('uploads')))
  // Montar el router en /usuario
  app.use('/usuario', decodificarToken, rutaUsuario({ usuarioServicio }))
  app.use('/venta', decodificarToken, rutaVentas({ ventaServicio }))
  app.use('/stock', decodificarToken, rutaStock({ stockServicio }))
  app.use('/categoria', decodificarToken, rutaCategoria({ categoriaServicio }))
  app.use('/producto', decodificarToken, rutaProducto({ productoServicio }))
  app.use('/auth', rutaAuth({ authServicio }))

  const server = createServer(app)
  const io = SocketConfig(server)

  app.set('io', io)
  server.listen(port, () => {
    console.log('Servidor activo en el puerto:', port)
  })
}
