import React, { useContext } from 'react'
import { NotificacionContext } from '../context/NotificacionContext'

export const useNotificacion = () => useContext(NotificacionContext)