import { Server } from 'socket.io'
import { Token } from './token.js'

export function SocketConfig (server) {
  // Configuración de CORS para Socket.IO
  const corsConfig = {
    origin: (origin, callback) => {
      // Permitir conexiones sin origin (apps nativas)
      if (!origin) return callback(null, true)

      // En modo Electron, permitir cualquier IP local
      if (process.env.ELECTRON_MODE === 'true') {
        const patronesLocales = [
          /^http:\/\/localhost/,
          /^http:\/\/127\.0\.0\.1/,
          /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/,
          /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
          /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}/
        ]

        if (patronesLocales.some(patron => patron.test(origin))) {
          return callback(null, true)
        }
      }

      // Orígenes específicos permitidos
      const origenesPemitidos = [
        'http://localhost:5173',
        'http://192.168.1.9:5173',
        process.env.FRONTEND_URL
      ].filter(Boolean)

      if (origenesPemitidos.includes(origin)) {
        return callback(null, true)
      }

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  }

  const io = new Server(server, {
    cors: corsConfig,
    pingTimeout: 120000,
    pingInterval: 25000
  })

  const token = new Token()

  io.use((socket, next) => {
    const jwtToken = socket.handshake.auth?.token

    if (!jwtToken) {
      return next(new Error('TOKEN_MISSING'))
    }

    try {
      const usuarioDecodificado = token.verificarToken(jwtToken)
      socket.data.usuario = {
        id: usuarioDecodificado.id,
        usuario: usuarioDecodificado.usuario,
        rol: usuarioDecodificado.rol
      }
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new Error('TOKEN_EXPIRED'))
      }
      return next(new Error('TOKEN_INVALID'))
    }
  })

  io.on('connection', (socket) => {
    const usuarioId = socket.data.usuario?.id || null

    if (usuarioId) {
      socket.join(`usuario_${usuarioId}`)
      console.log('🟢 Cliente conectado:', socket.id, 'Usuario:', usuarioId)
    }
    socket.on('join_room', (room) => {
      socket.join(room)
      console.log('🟢 Cliente conectado:', socket.id, 'se unió a la sala:', room)
    })

    socket.on('leave_room', (room) => {
      socket.leave(room)
      console.log('🟠 Cliente desconectado:', socket.id, 'salió de la sala:', room)
    })

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id)
    })
  })

  return io
}
