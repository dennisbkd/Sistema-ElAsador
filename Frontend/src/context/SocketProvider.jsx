/* eslint-disable no-undef */

import React, { useEffect, useRef, useState } from 'react'
import { SocketContext } from './SocketContext'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { getSocketUrl } from '../utils/networkUtils'
import { getValidToken, clearAuthData } from '../utils/tokenUtils'

const safeDecodeToken = (token) => {
  if (!token) return null

  try {
    return jwtDecode(token)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error decodificando token:', error.message)
    }
    clearAuthData()
    return null
  }
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef(null)

  const createSocketConnection = (token) => {
    const decodeToken = safeDecodeToken(token)

    if (!decodeToken) {
      setSocket(null)
      setIsConnected(false)
      return null
    }

    const socketUrl = getSocketUrl()

    const nuevaConexionIo = io(socketUrl, {
      auth: {
        usuario: {
          id: decodeToken?.id,
          usuario: decodeToken?.usuario
        }
      },
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.3,
      withCredentials: true
    })

    nuevaConexionIo.on('connect', () => {
      setIsConnected(true)
    })

    nuevaConexionIo.on('disconnect', (reason) => {
      setIsConnected(false)

      if (reason === 'ping timeout' && document.visibilityState === 'visible') {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!nuevaConexionIo.connected) {
            nuevaConexionIo.connect()
          }
        }, 700)
      }
    })

    nuevaConexionIo.on('connect_error', (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Socket error:', error.message)
      }
    })

    return nuevaConexionIo
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = getValidToken()

    if (!token) {
      setSocket(null)
      setIsConnected(false)
      return
    }

    try {
      const nuevaConexionIo = createSocketConnection(token)
      if (!nuevaConexionIo) return
      setSocket(nuevaConexionIo)

      return () => {
        clearTimeout(reconnectTimeoutRef.current)
        nuevaConexionIo.disconnect()
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error inicializando socket:', error)
      }
      setSocket(null)
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    const handleLogin = () => {
      if (typeof window === 'undefined') return

      const token = getValidToken()
      if (!token) return

      try {
        if (socket) {
          socket.disconnect()
        }

        const nuevaConexionIo = createSocketConnection(token)
        if (!nuevaConexionIo) return
        setSocket(nuevaConexionIo)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error en handleLogin:', error)
        }
      }
    }

    const handleLogout = () => {
      if (socket) {
        socket.disconnect()
      }
      setSocket(null)
      setIsConnected(false)
    }

    window.addEventListener('auth-login', handleLogin)
    window.addEventListener('auth-logout', handleLogout)

    return () => {
      clearTimeout(reconnectTimeoutRef.current)
      window.removeEventListener('auth-login', handleLogin)
      window.removeEventListener('auth-logout', handleLogout)
    }
  }, [socket])

  useEffect(() => {
    if (!socket || typeof window === 'undefined') return

    const forzarReconexion = () => {
      if (!socket.connected) {
        socket.connect()
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forzarReconexion()
      }
    }

    const onOnline = () => {
      forzarReconexion()
    }

    const onOffline = () => {
      setIsConnected(false)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
