import React, { useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const decodeToken = token ? jwtDecode(token) : null

    const nuevaConexionIo = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
      {
        auth: {
          usuario: {
            id: decodeToken?.id, usuario: decodeToken?.usuario
          }
        },
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
