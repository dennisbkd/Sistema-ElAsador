
import React, { useCallback, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

export const useSocket = () => {
  const { socket, isConnected } = useContext(SocketContext)

  const escuchar = useCallback((evento, callback) => {
    if (!socket) return
    socket.on(evento, callback)
    return () => socket.off(evento, callback)
  }, [socket])

  const emitir = useCallback((evento, datos) => {
    if (!socket) return
    socket.emit(evento, datos)
  }, [socket])

  // funciones para manejar rooms
  const unirARoom = useCallback((roomName) => {
    if (!socket) return
    socket.emit('join_room', roomName)
  }, [socket])

  const salirDeRoom = useCallback((roomName) => {
    if (!socket) return
    socket.emit('leave_room', roomName)
  }, [socket])

  return {
    socket,
    escuchar,
    emitir,
    isConnected: isConnected,
    unirARoom,
    salirDeRoom
  }
}