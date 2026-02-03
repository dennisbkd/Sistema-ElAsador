// SideBarMobileLayout.jsx - Versión completa
import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import {
  ListOrdered,
  PlusCircle,
  ShoppingCart,
  Home,
  Bell,
  User
} from 'lucide-react'
import { BotonIcon } from '../components/BotonIcon'
import { useNotificacion } from '../../hooks/useNotificacion'
import { useAjustesSocket } from '../../Admin/ajustes/hooks/useAjustesSocket'

export const SideBarMobileLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}
  const {
    notificacionesNoLeidas,
    hayNuevasNotificaciones
  } = useNotificacion()
  useAjustesSocket()

  // Detectar tab activa basado en la ruta
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/mesero/pedidos')) setActiveTab('pedidos')
    else if (path.includes('/mesero/nueva-orden')) setActiveTab('nueva')
    else setActiveTab('home')
  }, [location])

  const navItems = [

    {
      id: 'pedidos',
      icon: ListOrdered,
      text: 'Pedidos',
      path: '/mesero/pedidos',

    },
    {
      id: 'nueva',
      icon: PlusCircle,
      text: 'Nueva',
      path: '/mesero/nueva-orden',
      badge: null,
      notification: false
    },
    {
      id: 'notificaciones',
      icon: Bell,
      text: 'Alertas',
      path: '/mesero/notificaciones',
      badge: notificacionesNoLeidas > 0 ? notificacionesNoLeidas : null,
      notification: hayNuevasNotificaciones
    }
  ]

  const handleNavigate = (path, tabId) => {
    setActiveTab(tabId)
    navigate(path)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* Header fijo superior */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Mesero: {usuario.userName}</h1>
              <p className="text-xs text-gray-500">Turno activo</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4">
        <Outlet />
      </main>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="px-4 py-2">
          {/* Indicador visual */}
          <div className="flex justify-center mb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-50"></div>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between">
            {navItems.map((item) => (
              <BotonIcon
                key={item.id}
                text={item.text}
                icon={item.icon}
                isActive={activeTab === item.id}
                size={22}
                badge={item.badge}
                notification={item.notification}
                onClick={() => handleNavigate(item.path, item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}