import React, { useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    const nuevaConexionIo = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
      {
        auth: { token },
        autoConnect: !!token
      }
    )

    nuevaConexionIo.on("connect", () => {
      setIsConnected(true)
    })

    nuevaConexionIo.on("disconnect", () => {
      setIsConnected(false)
    })

    setSocket(nuevaConexionIo)

    return () => nuevaConexionIo.disconnect()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )

}
