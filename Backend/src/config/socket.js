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
    console.log('🟢 Cliente conectado:', socket.id)

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id)
    })
  })

  return io
}
