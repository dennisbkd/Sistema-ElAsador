import React, { useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const token = localStorage.getItem('token') || null
    const nuevaConexionIo = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      auth: {
        token
      },
      autoConnect: !!token
    })
    setSocket(nuevaConexionIo)

    return () => {
      nuevaConexionIo.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )

}
