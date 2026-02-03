import { Server } from 'socket.io'

export function SocketConfig (server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://192.168.1.9:5173'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 30000
  })

  io.on('connection', (socket) => {
    const usuarioId = socket.handshake.auth.usuario?.id || null

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
