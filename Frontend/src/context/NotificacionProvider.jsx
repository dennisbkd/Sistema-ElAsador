import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { NotificacionContext } from './NotificacionContext'

export const NotificacionProvider = ({ children }) => {
  const { escuchar, isConnected } = useSocket()
  const [notificacion, setNotificacion] = useState([])
  const [hayNuevasNotificaciones, setHayNuevasNotificaciones] = useState(false)

  const agregarNotificacion = useCallback((data) => {
    const nuevaNotificacion = {
      id: Date.now(),
      mensaje: data.mensaje,
      nombre: data.nombre,
      leida: false
    }
    setNotificacion((prev) => [...prev, nuevaNotificacion])
    setHayNuevasNotificaciones(true)
  }, [])

  useEffect(() => {
    if (!isConnected) return

    const limpiarProductoActualizado = escuchar('productoActualizado', (data) => {
      agregarNotificacion(data)
    })

    return () => {
      limpiarProductoActualizado?.()
    }

  }, [escuchar, isConnected, agregarNotificacion])

  const reiniciarNotificaciones = () => {
    setNotificacion([])
    setHayNuevasNotificaciones(false)
  }

  const marcarComoLeidas = useCallback(() => {
    setNotificacion(prev => prev.map(noti => ({ ...noti, leida: true })))
    setHayNuevasNotificaciones(false)
  }, [])

  return (
    <NotificacionContext.Provider value={{
      notificacion,
      reiniciarNotificaciones,
      marcarComoLeidas,
      notificacionesNoLeidas: notificacion.filter(noti => !noti.leida).length,
      hayNuevasNotificaciones,
      totalNotificaciones: notificacion.length,
    }}>
      {children}
    </NotificacionContext.Provider >
  )
}
