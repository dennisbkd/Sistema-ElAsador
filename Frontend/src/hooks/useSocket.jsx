
import React, { useCallback, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

export const useSocket = () => {
  const socket = useContext(SocketContext)

  const escuchar = useCallback((evento, callback) => {
    if (!socket) return
    socket.on(evento, callback)
    return () => socket.off(evento, callback)
  }, [socket])

  const emitir = useCallback((evento, datos) => {
    if (!socket) return
    socket.emit(evento, datos)
  }, [socket])

  return {
    socket,
    escuchar,
    emitir,
    isConnected: socket?.connected || false
  }
}