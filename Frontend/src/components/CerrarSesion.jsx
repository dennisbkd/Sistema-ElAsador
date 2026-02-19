import React from 'react'
import { useNavigate } from 'react-router'
import { LogOut, Power, ChevronRight, User, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export const CerrarSesion = ({
  variant = 'dropdown', // 'dropdown', 'sidebar', 'header', 'button', 'card'
  showText = true,
  showUserInfo = false,
  className = '',
  onClose,
  userData = null
}) => {
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    // Remover token y usuario del localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    sessionStorage.clear()
    
    // Disparar evento personalizado para desconectar el socket
    window.dispatchEvent(new Event('auth-logout'))
    
    toast.success('Sesión cerrada exitosamente')

    // Cerrar dropdown si existe
    if (onClose) onClose()

    // Redirigir al login
    navigate('/', { replace: true })
  }

  // Variante para dropdown (menú desplegable)
  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleCerrarSesion}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg group"
      >
        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="flex-1 text-left">Cerrar Sesión</span>
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    )
  }

  // Variante para sidebar (barra lateral)
  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleCerrarSesion}
        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <LogOut className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
        <span className="font-medium relative z-10">Cerrar Sesión</span>
        {showUserInfo && userData && (
          <span className="text-xs text-gray-500 ml-auto relative z-10">
            {userData.email || userData.usuario}
          </span>
        )}
      </button>
    )
  }

  // Variante para header (barra superior)
  if (variant === 'header') {
    return (
      <button
        onClick={handleCerrarSesion}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group"
        title="Cerrar Sesión"
      >
        <Power className="w-4 h-4 group-hover:text-red-600 transition-colors" />
        {showText && <span className="hidden sm:inline">Salir</span>}
      </button>
    )
  }

  // Variante para botón principal
  if (variant === 'button') {
    return (
      <button
        onClick={handleCerrarSesion}
        className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 active:scale-95 transition-all shadow-lg shadow-red-500/30 ${className}`}
      >
        <LogOut className="w-5 h-5" />
        {showText && 'Cerrar Sesión'}
      </button>
    )
  }

  // Variante para tarjeta (card)
  if (variant === 'card') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        {showUserInfo && userData && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {userData.nombre?.[0] || userData.usuario?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {userData.nombre || userData.usuario}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.email || userData.rol || 'Usuario'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleCerrarSesion}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    )
  }

  // Variante minimalista (solo icono)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleCerrarSesion}
        className={`p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${className}`}
        title="Cerrar Sesión"
      >
        <LogOut className="w-5 h-5" />
      </button>
    )
  }

  // Variante por defecto
  return (
    <button
      onClick={handleCerrarSesion}
      className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {showText && 'Cerrar Sesión'}
    </button>
  )
}

// Componente adicional para mostrar en sidebar con información del usuario
export const SidebarFooter = ({ userData, onClose }) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {userData?.nombre?.[0] || userData?.usuario?.[0] || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userData?.nombre || userData?.usuario}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {userData?.rol || 'Usuario'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => { }} // Navegar a perfil
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Perfil</span>
        </button>

        <button
          onClick={() => { }} // Navegar a configuración
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Config.</span>
        </button>

        <CerrarSesion variant="icon" onClose={onClose} />
      </div>
    </div>
  )
}