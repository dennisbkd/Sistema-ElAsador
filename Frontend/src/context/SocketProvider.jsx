import React, { useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { getSocketUrl } from '../utils/networkUtils'

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const decodeToken = token ? jwtDecode(token) : null

    // Si ya existe un socket, desconectarlo antes de crear uno nuevo
    if (socket) {
      socket.disconnect()
    }

    // Solo crear conexión si hay token
    if (!token) {
      setSocket(null)
      setIsConnected(false)
      return
    }

    const socketUrl = getSocketUrl()

    const nuevaConexionIo = io(
      socketUrl,
      {
        auth: {
          usuario: {
            id: decodeToken?.id, usuario: decodeToken?.usuario
          }
        },
        autoConnect: true
      }
    )

    nuevaConexionIo.on("connect", () => {
      setIsConnected(true)
    })

    nuevaConexionIo.on("disconnect", () => {
      setIsConnected(false)
    })

    nuevaConexionIo.on("connect_error", (error) => {
      console.error('❌ Error de conexión socket:', error.message)
    })

    setSocket(nuevaConexionIo)

    return () => {
      if (nuevaConexionIo) {
        nuevaConexionIo.disconnect()
      }
    }
  }, []) // Solo se ejecuta al montar el componente

  // Efecto separado para escuchar cambios en localStorage (login/logout)
  useEffect(() => {
    const handleLogin = () => {
      const token = localStorage.getItem('token')

      if (token) {
        // Desconectar socket anterior si existe
        if (socket) {
          console.log('🔌 Desconectando socket anterior')
          socket.disconnect()
        }

        // Usuario hizo login, crear nuevo socket
        console.log('🔌 Creando nueva conexión socket después de login')
        const decodeToken = jwtDecode(token)
        const socketUrl = getSocketUrl()

        const nuevaConexionIo = io(
          socketUrl,
          {
            auth: {
              usuario: {
                id: decodeToken?.id, usuario: decodeToken?.usuario
              }
            },
            autoConnect: true
          }
        )

        nuevaConexionIo.on("connect", () => {
          setIsConnected(true)
        })

        nuevaConexionIo.on("disconnect", () => {
          setIsConnected(false)
        })

        nuevaConexionIo.on("connect_error", (error) => {
          console.error('❌ Error de conexión socket:', error.message)
        })

        setSocket(nuevaConexionIo)
      }
    }

    const handleLogout = () => {
      // Usuario hizo logout, desconectar socket
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }

    // Escuchar eventos personalizados
    window.addEventListener('auth-login', handleLogin)
    window.addEventListener('auth-logout', handleLogout)

    return () => {
      window.removeEventListener('auth-login', handleLogin)
      window.removeEventListener('auth-logout', handleLogout)
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}