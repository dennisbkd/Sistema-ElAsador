/* eslint-disable no-undef */


import React, { useEffect, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { getSocketUrl } from '../utils/networkUtils'
import { getValidToken, clearAuthData } from '../utils/tokenUtils'

// Función para decodificar token de forma segura
const safeDecodeToken = (token) => {
  if (!token) return null

  try {
    return jwtDecode(token)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error decodificando token:', error.message)
    }
    // Si el token es inválido, eliminarlo
    clearAuthData()
    return null
  }
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Asegurar que window está disponible
    if (typeof window === 'undefined') return

    const token = getValidToken()
    const decodeToken = safeDecodeToken(token)

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

    try {
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
        // Error silencioso para evitar problemas en Chrome móvil
        if (process.env.NODE_ENV === 'development') {
          console.error('Socket error:', error.message)
        }
      })

      setSocket(nuevaConexionIo)

      return () => {
        if (nuevaConexionIo) {
          nuevaConexionIo.disconnect()
        }
      }
    } catch (error) {
      // Error al obtener URL o crear socket
      if (process.env.NODE_ENV === 'development') {
        console.error('Error inicializando socket:', error)
      }
      setSocket(null)
      setIsConnected(false)
    }
  }, []) // Solo se ejecuta al montar el componente

  // Efecto separado para escuchar cambios en localStorage (login/logout)
  useEffect(() => {
    const handleLogin = () => {
      if (typeof window === 'undefined') return

      const token = getValidToken()

      if (token) {
        try {
          // Desconectar socket anterior si existe
          if (socket) {
            socket.disconnect()
          }

          // Usuario hizo login, crear nuevo socket
          const decodeToken = safeDecodeToken(token)

          // Si el token es inválido, no crear conexión
          if (!decodeToken) {
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
            if (process.env.NODE_ENV === 'development') {
              console.error('Socket error:', error.message)
            }
          })

          setSocket(nuevaConexionIo)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error en handleLogin:', error)
          }
        }
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